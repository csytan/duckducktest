var Casper = require('casper');
var utils = require('utils');
var _ = require('underscore');

// http://docs.casperjs.org/en/latest/modules/index.html

casper = Casper.create({
    logLevel: "info",
    verbose: true  
});

casper.start('https://duck.co/ia/json', function() {
    utils.dump(this.getPageContent());
    var ias = JSON.parse(this.getPageContent());
    var spices = _.filter(ias, function(ia) {
        return ia.repo == 'spice';
    });
    utils.dump(spices);
    //spices.forEach(fetchPage);
    fetchPage(spices[1]);
}, {
    method: 'get',
    headers: {
        'Accept': 'application/json'
    }
});

function fetchPage(spice) {
    if (!spice.example_query) return;
    //var url = 'https://bttf.duckduckgo.com/?q=' + 
    //    spice.example_query.replace(' ', '+');
    var url = 'https://duckduckgo.com';
    utils.dump('visiting: ' + spice.name);
    casper.start(url);
    casper.wait(2000);
    casper.then(function() {
        utils.dump(this.getHTML());
        utils.dump('spiced: ' + spice.name);
    });
}

casper.run();