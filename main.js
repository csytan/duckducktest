var fs = require('fs');
var https = require('https');
var wd = require('wd');
var asserters = wd.asserters;

var browser = wd.promiseChainRemote('localhost', 9515);

browser.on('status', function(info) {
  console.log(info);
});

browser = browser.init({browserName:'chrome'});
    
var injectjs = fs.readFileSync('inject.js', {encoding: 'utf8'});

//https://github.com/admc/wd


https.request('https://duck.co/ia/json', function(response) {
    var body = '';
    response.on('data', function(chunk) { body += chunk; });
    response.on('end', function () {
        crawl(JSON.parse(body));
    });
}).end();


function crawl(ias) {
    var spices = [];
    ias.forEach(function(ia) {
        if (ia.repo == 'spice' && ia.example_query) {
            spices.push(ia);
        }
    });
    crawlPages(spices);
}


function crawlPages(spices) {
    var spice = spices.pop();
    if (!spice) return;
    var url = 'https://bttf.duckduckgo.com/?q=' + 
        spice.example_query.replace(/ /g, '+');
    console.log('Visiting ' + spice.name);
    console.log(url);
    browser
        .get(url)
        .execute(injectjs)
        .waitFor(asserters.jsCondition('window.DuckDuckTest && window.DuckDuckTest.loaded'), 60000)
        .execute('return DuckDuckTest.describeIA()', function(err, result) {
            if (!result) {
                console.log('Zci not found!');
            }
        })
        .execute('return DuckDuckTest.errors', function(err, result) {
            if (result.length) {
                console.log('Errors: ', result);
            }
            console.log('-------------------------------------------');
            crawlPages(spices);
        });
}



