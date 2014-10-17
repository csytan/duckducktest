var request = require('request');
var _ = require('./underscore.js');
var Nightmare = require('nightmare');


request('https://duck.co/ia/json', function(error, response, body) {
    crawl(JSON.parse(body));
});


var nightmare = new Nightmare()
    .on('error', function(msg, trace) {
        console.error(msg, trace);
    })
    .on('consoleMessage', function(msg, lineNumber, sourceId) {
        console.log(msg);
    });


function crawl(ias) {
    var spices = _.filter(ias, function(ia) {
        return ia.repo == 'spice';
    });
    
    //spices.forEach(crawlPage);
    crawlPage(spices[1]);
}


function crawlPage(spice) {
    if (!spice.example_query) return;
    var url = 'https://bttf.duckduckgo.com/?q=' + 
        spice.example_query.replace(' ', '+');
    //var url = 'https://duck.com';
    console.log('visiting: ' + spice.name);
    console.log('url: ' + url);
    nightmare.goto(url)
        //.inject('js', 'lib/inject.js')
        .wait()
        .evaluate(function() {
            return document.body;
            //return $('#zero_click_wrapper').text();
        }, function (res) {
            console.log('hi')
            console.log(res);
        })
        .run(function(err, nightmare) {
            console.log(err)
            console.log('finished visiting: ' + spice.name);
        });
}
