var page = require('webpage').create();
var _ = require('underscore');


page.open('https://duck.co/ia/json', function() {
    var json = page.evaluate(function() { return document.body.textContent; });
    var ias = JSON.parse(json);
    var spices = _.filter(ias, function(ia) {
        return ia.repo == 'spice';
    });
    fetchPage(spices);
});



function fetchPage(spices) {
    var spice = spices.pop();
    if (!spice) {
        return phantom.exit();
    }
    if (!spice.example_query) {
        return fetchPage(spices);
    }
    var url = 'https://bttf.duckduckgo.com/?q=' + 
        spice.example_query.replace(/ /g, '+');
    console.log('visiting: ' + spice.name);
    console.log('url: ' + url);
    
    page.open(url, function() {
        page.injectJs('lib/inject.js');
        var html = page.evaluate(function() {
            return DuckDuckTest.run();
        });
        console.log(html);
        fetchPage(spices);
    });
}


