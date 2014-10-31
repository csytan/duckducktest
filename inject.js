// This script is injected into the browser

DuckDuckTest = (function() {
    var self = {
        errors: [],
        badImages: [],
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
        if ($('.zci:visible').length || elapsed > 2000) {
            self.loaded = true;
            clearTimeout(timer);
        }
    }, 100);

    return self;
})();

DuckDuckTest.run = function() {
    var self = this;
    
    // Test if ZCI is visible
    // TODO: check if the right ZCI is displayed
    var zci = $('.zci:visible');
    if (zci.length == 0) {
        this.errors.push('ZCI not displayed!');
    }
    
    // Prep for screen shot
    var badImageLinks = {};
    zci.find('img[class*=img]')
        .each(function() {
            // Test for broken images
            // http://stackoverflow.com/questions/1977871/check-if-an-image-is-loaded-no-errors-in-javascript
            if (this.src && this.naturalWidth === 0 || this.naturalHeight === 0) {
                badImageLinks[this.src] = 1;
            }
            // Hide non-UI images (for screen shot comparison)
            $(this).css('visibility', 'hidden');
        });
        
    // Bad image links without dupes
    var badImages = [];
    for (var url in badImageLinks) {
        badImages.push(url);
    }
    
    // Remove content, only looking at ZCI
    $('.content-wrap').remove();

    // Gather links to test later
    var links = [];
    zci.find('a')
        .each(function() {
            if (this.href) {
                links.push(this.href);
            }
        });
    
    self.complete = true;
    
    return {
        errors: this.errors,
        badImages: badImages,
        links: links
    };
};

