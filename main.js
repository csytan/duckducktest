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
    
    console.log(ia.perl_module);
    console.log(url);
    
    browser
        .get(url)
        .execute(injectjs)
        .waitFor(asserters.jsCondition('window.DuckDuckTest.loaded'), 5000)
        .execute('return DuckDuckTest.run()', function(err, result) {
            testData = result;
        })
        .waitFor(asserters.jsCondition('window.DuckDuckTest.complete', 5000))
        .saveScreenshot(path.join(iaPath, '1.png'))
        .then(function() {
            for (key in testData) {
                console.log(key + ': ' + testData[key]);
            }
            console.log('-----------------------------------------\n');
            
            crawlPage(ias);
        });
}


function checkLinks(links) {
    
}



