var fs = require('fs');
var request = require('request');
var path = require('path');
var wd = require('wd');
var Q = require('q');
var asserters = wd.asserters;


// Load inject javascript
var injectjs = fs.readFileSync('inject.js', {encoding: 'utf8'});

// Create results folder
var resultsPath = path.join(process.cwd(), 'results');
try {
    fs.mkdirSync(resultsPath);
} catch(e) {
    if (e.code != 'EEXIST') throw e;
}

// Initialize Browser
var browser = wd.promiseChainRemote('localhost', 9515)
    .init({browserName:'chrome'});

// Fetch Instant Answer data
request('https://duck.co/ia/json', function(error, response, body) {
    if (!error && response.statusCode == 200) {
        crawl(JSON.parse(body));
    }
});

// Crawl IA pages
function crawl(ias) {
    var spices = [];
    ias.forEach(function(ia) {
        if (ia.example_query) {
            spices.push(ia);
        }
    });
    crawlPage(spices);
}

function crawlPage(ias) {
    var ia = ias.pop();
    if (!ia) return;
    var url = 'https://bttf.duckduckgo.com/?q=' + 
        encodeURIComponent(ia.example_query);
    var testData;
        
    // Create IA directory
    var iaPath = path.join(resultsPath, ia.name);
    try {
        fs.mkdirSync(iaPath);
    } catch(e) {
        if (e.code != 'EEXIST') throw e;
    }
    
    // Find the largest image id
    var id = 1;
    fs.readdirSync(iaPath)
        .forEach(function(file) {
            var imageId = /\d+\.png/.exec(file);
            if (imageId) {
                id = Math.max(parseInt(imageId) + 1, id);
            }
        });
    
    console.log(ia.perl_module);
    console.log(url);
    
    browser
        .get(url)
        .waitFor(asserters.jsCondition('document.readyState === "complete"'), 5000)
        .execute(injectjs)
        .waitFor(asserters.jsCondition('window.DuckDuckTest && window.DuckDuckTest.loaded'), 5000)
        .execute('return DuckDuckTest.run()', function(err, result) {
            testData = result;
            testData.errors.forEach(function(error) {
                console.log('JS error:', error);
            });
            testData.badImages.forEach(function(url) {
                console.log('Image not found:', url);
            });
        })
        .waitFor(asserters.jsCondition('window.DuckDuckTest.complete', 5000))
        .saveScreenshot(path.join(iaPath, id + '.png'))
        .then(function() {
            return checkLinks(testData.links);
        })
        .then(function(badLinks) {
            for (var link in badLinks) {
                console.log('Bad Link (' + badLinks[link] + '):', link);
            }
        })
        .then(function() {
            return compareImages(iaPath, id);
        })
        .then(function(imgChange) {
            console.log('Screenshot change:', (imgChange * 100).toFixed(2), '%');
            console.log('-----------------------------------------------------');
            crawlPage(ias);
        })
        .done();
}


function checkLinks(links) {
    var deferred = Q.defer();
    var badLinks = {};
    var done = 1;

    if (links.length) {
        links.forEach(function(link) {
            request(link, function(error, response, body) {
                done++;
                if (error || response.statusCode != 200) {
                    badLinks[link] = error || response.statusCode;
                }
                if (done >= links.length) {
                    deferred.resolve(badLinks);
                }
            });
        });
    } else {
        deferred.resolve(badLinks);
    }
    return deferred.promise;
}


function compareImages(iaPath, id) {
    // Compares the most recent image with the previous image
    // Returns a float percentage: 0.80
    var deferred = Q.defer();
    var exec = require('child_process').exec;
    if (id > 1) {
        var cmd = 'compare -metric rmse ' + 
            id + '.png ' + (id - 1) + '.png null: 2>&1';
        // Run Imagemagick command
        exec(cmd, {cwd: iaPath}, function (error, stdout, stderr) {
            // Extract percent 
            // "2941.46 (0.0448838)" --> 0.0448838
            var percent = parseFloat(/\((.+)\)/.exec(stdout)[1]);
            deferred.resolve(percent);
        });
    } else {
        deferred.resolve(0);
    }
    return deferred.promise;
}


