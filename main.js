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
        if (ia.example_query) {
            spices.push(ia);
        }
    });
    crawlPages(spices);
}


function crawlPages(spices) {
    var spice = spices.pop();
    if (!spice) return;
    
    var url = 'https://bttf.duckduckgo.com/?q=' + 
        encodeURIComponent(spice.example_query);
    
    console.log(spice.perl_module);
    console.log(url);
    
    browser
        .get(url)
        .execute(injectjs)
        .waitFor(asserters.jsCondition('window.DuckDuckTest && window.DuckDuckTest.loaded'), 5000)
        .execute('return DuckDuckTest.run()', function(err, result) {
            for (key in result) {
                console.log(key + ': ' + result[key]);
            }
            console.log('-----------------------------------------\n');
        })
        .waitFor(asserters.jsCondition('window.DuckDuckTest.complete', 5000))
        .saveScreenshot(process.cwd() + '/images/' + spice.name + '.png')
        .then(function() {
            crawlPages(spices);
        });
}



