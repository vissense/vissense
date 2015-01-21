/*jshint -W121 */

// bind is missing in phantomjs 1.9.7
// @href github.com/ariya/phantomjs/issues/10522

(function () {
  'use strict';
  if (!Function.prototype.bind) {
    Function.prototype.bind = function (oThis) {
      if (typeof this !== 'function') {
        // closest thing possible to the ECMAScript 5
        // internal IsCallable function
        throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
      }

      var aArgs = Array.prototype.slice.call(arguments, 1),
        fToBind = this,
        NOP = function () {
        },
        fBound = function () {
          return fToBind.apply(this instanceof NOP && oThis ? this : oThis, aArgs.concat(Array.prototype.slice.call(arguments)));
        };

      NOP.prototype = this.prototype;
      fBound.prototype = new NOP();

      return fBound;
    };
  }
}());

// window.hidden may not be available in certain phantomjs versions

(function () {
  'use strict';
  if (document.hidden === undefined) {
    document.hidden = false;
  }
}());
