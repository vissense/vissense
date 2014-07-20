/**
 * @license
 * Vissense <http://vissense.com/>
 * Copyright 2014 tbk <theborakompanioni+vissense@gmail.com>
 * Available under MIT license <http://opensource.org/licenses/MIT>
 */
;(function(window, undefined) {
  'use strict';

    function _window(element) {
        if(!element) {
            return window;
        }
        var doc = element.ownerDocument;
        return 'defaultView' in doc ? doc.defaultView : doc.parentWindow;
	}

    /**
    * Returns a function that invokes callback only if call to when() is true
    */
    function fireIf(when, callback) {
      return function() {
        return when() ? callback() : undefined;
      };
    }

    this.VisSenseUtils = {
        _window : _window,
        fireIf: fireIf
    };

}.call(this, window));