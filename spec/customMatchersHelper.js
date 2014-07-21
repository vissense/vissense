/* global VisSenseUtils,jasmine,beforeEach*/
/**
 * @license
 * VisSense <http://twyn.com/>
 * Copyright 2014 twyn group IT solutions & marketing services AG <vissense@twyn.com>
 * Available under MIT license <http://opensource.org/licenses/MIT>
 */
beforeEach(function () {
    'use strict';
    function getMessage(result, actual, expected) {
        if(result.pass === true) {
            return 'Expected visibility to be "'+expected+'"';
        }
        return 'Expected visibility to be "'+expected+'", but it was "'+actual+'"! ';
    }

    jasmine.addMatchers({
        toHaveVisSensePercentageOf: function() {
            return {
                compare: function (element, expected) {
                    var result = {};
                    var actual = VisSenseUtils.percentage(element);

                    result.pass = (actual === expected);
                    result.message = getMessage(result, actual, expected);
                    return result;
                }
            };
        },
        toBeVisSenseHidden: function() {
            return {
                compare: function (element, expected) {
                    var result = {};
                    result.pass = VisSenseUtils.isHidden(element);
                    result.message = getMessage(result, element, expected);
                    return result;
                }
            };
        },
        toBeVisSenseVisible: function() {
            return {
                compare: function (element, expected) {
                    var result = {};
                    result.pass = VisSenseUtils.isVisible(element);
                    result.message = getMessage(result, element, expected);
                    return result;
                }
            };
        },
        toBeVisSenseFullyVisible: function() {
            return {
                compare: function (element, expected) {
                    var result = {};
                    result.pass = VisSenseUtils.isFullyVisible(element);
                    result.message = getMessage(result, element, expected);
                    return result;
                }
            };
        }
    });
});