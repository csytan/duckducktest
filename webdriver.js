var fs = require('fs');
var request = require('request');
var wd = require('wd');
var asserters = wd.asserters;

var browser = wd.promiseChainRemote('localhost', 9515);

browser.on('status', function(info) {
  console.log(info);
});

browser = browser.init({browserName:'chrome'});
    
var injectlib = fs.readFileSync('lib/inject.js', {encoding: 'utf8'});

//https://github.com/admc/wd

request('https://duck.co/ia/json', function(error, response, body) {
    var ias = JSON.parse(body);
    var spices = [];
    ias.forEach(function(ia) {
        if (ia.repo == 'spice' && ia.example_query) {
            spices.push(ia);
        }
    });
    crawlPages(spices);
});


function crawlPages(spices) {
    var spice = spices.pop();
    if (!spice) return;
    var url = 'https://bttf.duckduckgo.com/?q=' + 
        spice.example_query.replace(' ', '+');
    console.log('visiting: ' + spice.name);
    console.log('url: ' + url);
    browser
        .get(url)
        .waitFor(asserters.jsCondition('document.body ? true: false'))
        .execute(injectlib)
        .waitFor(asserters.jsCondition('window.DuckDuckTest ? true: false'), 60000)
        .waitFor(asserters.jsCondition('window.DuckDuckTest.loaded'), 60000)
        .execute('return window.DuckDuckTest.run()', function(err, result) {
            console.log(err);
            console.log('---------')
            console.log(result);
            console.log('finished visiting: ' + spice.name);
            crawlPages(spices);
        });
}



