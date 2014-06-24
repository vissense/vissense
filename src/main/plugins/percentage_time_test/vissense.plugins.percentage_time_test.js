
 ;(function(window, VisSense, VisSenseUtils) {
    'use strict';

    /**
    * This function invokes a callback if and only if
    * the element has been visible at least ´percentageLimit´ percent
    * for at least ´timeLimit´ milliseconds.
    *
    * Important: Every invocation starts a new test! This means the callback will
    * not be called for at least ´timeLimit´ milliseconds.
    *
    * The initial check interval is 100 milliseconds.
    *
    * percentageLimit number     between 0 and 1
    * timeLimit       number     in milliseconds
    * callback        function   the function to call when condition fulfilled
    */
    VisSense.fn.onPercentageTimeTestPassed = function(percentageLimit, timeLimit, callback) {
        var me = this;
        var timer = me.timer();

        var timeElapsed = 0;
        var timeStarted = null;

        // TODO: make the checkInterval configurable (?)
        var checkInterval = timeLimit > 100 ? 100 : timeLimit;

        var timerId = timer.every(checkInterval, checkInterval, function(monitor) {
            if(monitor.percentage() < percentageLimit) {
                timeStarted = null;
            } else {
                timeStarted = timeStarted || VisSenseUtils.now();
                timeElapsed = VisSenseUtils.now() - timeStarted;

                if(timeElapsed >= timeLimit) {
                    callback();

                    // stop timer after test has passed
                    VisSenseUtils.defer(function() {
                        timer.stop(timerId);
                    });
                }
            }
        }, true);
    };

}(this, this.VisSense, this.VisSenseUtils));