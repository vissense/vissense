/* global VisSenseUtils,beforeEach,afterEach,$*/

/**
 * @license
 * VisSense <http://twyn.com/>
 * Copyright 2014 twyn group IT solutions & marketing services AG <vissense@twyn.com>
 * Available under MIT license <http://opensource.org/licenses/MIT>
 */
;(function() {
'use strict';

    function plain() {
        return {
            'Hidden-plain': $('<div></div>')[0]
        };
    }


    function zeroWidthAndHeight() {
         var e = $('<div></div>')
            .height(0)
            .width(0)
            .css('left', '0')
            .css('top', '0')
            .css('display', 'block')
            .css('position', 'fixed');

         return {
            'Hidden-element-zero-width-zero-height': e[0]
         };
    }

    function outOfViewport() {
         var top = $('<div></div>').height(1).width(1)
            .css('left', '0').css('top', '-1px')
            .css('position', 'fixed');

         var right = $('<div></div>').height(1).width(1)
            .css('right', '-1px').css('top', '0')
            .css('position', 'fixed');

         var bottom = $('<div></div>').height(1).width(1)
            .css('left', '0').css('bottom', '-1px')
            .css('position', 'fixed');

         var left = $('<div></div>').height(1).width(1)
            .css('left', '-1px').css('top', '0')
            .css('position', 'fixed');

         return {
            'Hidden-element-out-of-viewport-top': top[0],
            'Hidden-element-out-of-viewport-right': right[0],
            'Hidden-element-out-of-viewport-bottom': bottom[0],
            'Hidden-element-out-of-viewport-left': left[0]
         };
    }

    function setupElements(VIS_ELEMENTS) {
        VisSenseUtils.extend(VIS_ELEMENTS, plain());
        VisSenseUtils.extend(VIS_ELEMENTS, zeroWidthAndHeight());
        VisSenseUtils.extend(VIS_ELEMENTS, outOfViewport());
        return VIS_ELEMENTS;
    }

    function getElementsByType(elements, type) {
        var filtered = {};
        Object.keys(elements).forEach(function(key) {
            if(key[0] === type) {
                filtered[key] = elements[key];
            }
        });
        return filtered;
    }

    beforeEach(function () {
        this.VIS_ELEMENTS = setupElements({});

        this.VIS_HIDDEN_ELEMENTS = getElementsByType(this.VIS_ELEMENTS, 'H');

        var that = this;
        // now append them all to body
        Object.keys(this.VIS_ELEMENTS).forEach(function(key) {
            document.body.appendChild(that.VIS_ELEMENTS[key]);
        });
    });

    afterEach(function() {
        var that = this;
        Object.keys(this.VIS_ELEMENTS).forEach(function(key) {
            document.body.removeChild(that.VIS_ELEMENTS[key]);
        });

    });

}());