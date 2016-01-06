/*global VisSense,it,expect*/
/* jshint undef: false */

describe('VisSense Globals', function () {
  'use strict';

  it('should have a `noConflict` method', function () {
    expect(VisSense.noConflict).toBeDefined();

    var _oldValue = VisSense;
    var newCustomNameForVisSense = VisSense.noConflict();

    expect(VisSense).not.toBeDefined();

    expect(newCustomNameForVisSense).toBe(_oldValue);

    // restore original state
    window.VisSense = newCustomNameForVisSense.noConflict();
  });

});
