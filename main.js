var fs = require('fs');
var https = require('https');
var path = require('path');
var wd = require('wd');
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
https.request('https://duck.co/ia/json', function(response) {
    var body = '';
    response.on('data', function(chunk) { body += chunk; });
    response.on('end', function () {
        crawl(JSON.parse(body));
    });
}).end();

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
    
    console.log(id);
    console.log(ia.perl_module);
    console.log(url);
    
    browser
        .get(url)
        .waitFor(asserters.jsCondition('document.readyState === "complete"'), 5000)
        .execute(injectjs)
        .waitFor(asserters.jsCondition('window.DuckDuckTest.loaded'), 5000)
        .execute('return DuckDuckTest.run()', function(err, result) {
            testData = result;
        })
        .waitFor(asserters.jsCondition('window.DuckDuckTest.complete', 5000))
        .saveScreenshot(path.join(iaPath, id + '.png'))
        .then(function() {
            generateData(iaPath, id);
            crawlPage(ias);
        });
}


function checkLinks(links) {
    
}


function generateData(iaPath, id) {
    var exec = require('child_process').exec;
    if (id > 1) {
        var cmd = 'compare -metric rmse ' + 
            id + '.png ' + (id - 1) + '.png null: 2>&1';
        exec(cmd, {cwd: iaPath}, function (error, stdout, stderr) {
            console.log('img difference: ' + stdout);
        });
    }
}


