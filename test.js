var casper = require('casper').create();
var utils = require('utils');
var _ = require('underscore');

// http://docs.casperjs.org/en/latest/modules/index.html

casper.start('https://duck.co/ia/json', function() {
    var ias = JSON.parse(this.getPageContent());
    var spices = _.filter(ias, function(ia) {
        return ia.repo == 'spice';
    });
    utils.dump(spices);
    
    spices.forEach(function(spice) {
        if (!spice.example_query) return;
        var url = 'https://bttf.duckduckgo.com/?q=' + 
            spice.example_query.replace(' ', '+');
        utils.dump('visiting: ' + spice.name);
        casper.open(url);
        casper.then(function() {
            utils.dump('spiced: ' + spice.name);
        });
    });
});


casper.run();