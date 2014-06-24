
 ;(function(window, VisSense) {
    'use strict';

    /**
    * This function invokes a callback if and only if
    * the element has been visible at least 50 percent
    * for at least 1 second.
    */
    VisSense.fn.on50_1TestPassed = function(callback) {
        this.onPercentageTimeTestPassed(0.5, 1000, callback);
    };

}(this, this.VisSense));