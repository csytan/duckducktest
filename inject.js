// This script is injected into the browser

DuckDuckTest = (function() {
    var self = {
        errors: [],
        complete: false,
        loaded: false
    };
    
    // Capture errors
    window.onerror = function(message, file, line) {
        self.errors.push(message + '\n' + file + ':' + line);
    };
    
    // Poll until ZCI is loaded (visible)
    var start = new Date().getTime();
    var timer = setInterval(function() {
        var elapsed = (new Date().getTime()) - start;
        if ($('.zci:visible').length || elapsed > 5000) {
            self.loaded = true;
            clearTimeout(timer);
        }
    }, 100);

    return self;
})();

DuckDuckTest.run = function() {
    var self = this;
    
    // Test if ZCI is visible
    var zci = $('.zci:visible');
    if (zci.length == 0) {
        this.errors.push('ZCI not displayed!');
    }
    
    // Prep for screen shot
    zci.find('img[class*=img]')
        .each(function() {
            // Test for broken images
            // http://stackoverflow.com/questions/1977871/check-if-an-image-is-loaded-no-errors-in-javascript
            if (this.naturalWidth === 0 || this.naturalHeight === 0) {
                self.errors.push('Broken Image: ' + this.src);
            }
            
            // Hide non-UI images (for screen shot comparison)
            $(this).css('visibility', 'hidden');
        });
    
    // Remove content, only looking at ZCI
    $('.content-wrap').remove();

    // Gather links to test later
    var links = [];
    zci.find('a')
        .each(function() {
            links.push(this.href);
        });
    
    self.complete = true;
    
    return {
        errors: this.errors,
        links: links
    };
};

