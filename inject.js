// This script will be injected into the browser


DuckDuckTest = {
    errors: [],
    loaded: false
};

DuckDuckTest.init = function() {
    var self = this;
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
};

DuckDuckTest.run = function() {
    // Page Timing
    // https://developer.mozilla.org/en-US/docs/Web/API/PerformanceTiming
    var timing = window.performance.timing;
    var loadTime = (new Date().getTime()) - timing.navigationStart;
    var connTime = timing.responseEnd - timing.requestStart;
    
    // Test if ZCI is visible
    if ($('.zci:visible').length == 0) {
        this.errors.push('ZCI not displayed!');
    }
    
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
