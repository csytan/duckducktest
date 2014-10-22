// This script will be injected into the browser


DuckDuckTest = {
    errors: [],
    loaded: false
};

DuckDuckTest.init = function() {
    var self = this;
    // Capture errors
    window.onerror = function(message, file, line) {
        self.errors.push([message, file, line]);
    };
    
    // On window loaded
    window.onload = function() {
        console.log('loaded!')
        self.loaded = true;
    };
};

DuckDuckTest.run = function() {
    // Page Timing
    // https://developer.mozilla.org/en-US/docs/Web/API/PerformanceTiming
    var timing = window.performance.timing;
    var now = new Date().getTime();
    var loadTime = now - timing.navigationStart;
    var connTime = timing.responseEnd - timing.requestStart
    
    // ZCI info
    var zci = $('.zci.is-active');
    var zciInfo = zci[0] ? this.describeNode(zci[0]) : null;
    
    return {
        'Page load time': loadTime,
        'Connection time': connTime,
        'Errors': this.errors
    }
};

DuckDuckTest.describeNode = function(node, level) {
    // Builds a HAMLish description of a dom object
    //
    //   .container
    //      .video
    //         .title
    //      .blah
    var self = this;
    var out = '';
    level = level || 1;
        
    // Indentation
    out += new Array(level).join('  ');
    // Node name
    out += node.nodeName.toLowerCase();
    // Class names
    out += '.' + $.makeArray(node.classList).join('.');
    out += '\n';
    
    // Recurse through children
    $(node)
        .children()
        .each(function() {
            out += self.describeNode(this, level + 1);
        });
    return out;
};


DuckDuckTest.init();
