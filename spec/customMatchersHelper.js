/* global VisSense,jasmine,beforeEach*/

beforeEach(function () {
  'use strict';
  function getMessage(valueDescription, result, actual, expected) {
    if (result.pass === true) {
      return 'Expected ' + valueDescription + ' to be "' + expected + '"';
    }
    return 'Expected ' + valueDescription + ' to be "' + expected + '", but it was "' + actual + '"! ';
  }

  function getVisibilityState(element) {
    var vis = VisSense.of(element);
    return vis.state().state;
  }

  jasmine.addMatchers({
    toHaveVisSensePercentageOf: function () {
      return {
        compare: function (element, expected) {
          var result = {};
          var actual = VisSense.Utils.percentage(element);

          result.pass = (actual === expected);
          result.message = getMessage('visibility percentage', result, actual, expected);
          return result;
        }
      };
    },
    toBeVisSenseHidden: function () {
      return {
        compare: function (element) {
          var result = {};
          result.pass = VisSense.of(element).isHidden();
          result.message = getMessage('visibility', result, getVisibilityState(element), 'hidden');
          return result;
        }
      };
    },
    toBeVisSenseVisible: function () {
      return {
        compare: function (element) {
          var result = {};
          result.pass = VisSense.of(element).isVisible();
          result.message = getMessage('visibility', result, getVisibilityState(element), 'visible');
          return result;
        }
      };
    },
    toBeVisSenseFullyVisible: function () {
      return {
        compare: function (element) {
          var result = {};
          result.pass = VisSense.of(element).isFullyVisible();
          result.message = getMessage('visibility', result, getVisibilityState(element), 'fullyvisible');
          return result;
        }
      };
    }
  });
});
