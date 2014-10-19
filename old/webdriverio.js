var fs = require('fs');
var webdriverio = require('webdriverio');

var inject = fs.readFileSync('.lib/inject.js', {encoding: 'utf8'});

console.log(inject);


// https://github.com/webdriverio/webdriverio#options

var browser = webdriverio
    .remote({desiredCapabilities: {browserName: 'chrome'}});

    
/*    
    .init()
    .url('https://duckduckgo.com')
    .title(function(err, res) {
        console.log('Title was: ' + res.value);
    })
    .execute('lib/inject.js')
    .execute(function() {
        return DuckDuckTest.run();
    }, function(val) {
        console.log(val);
    });

*/