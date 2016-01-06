/*global $,it,expect*/
/* jshint undef: false */

describe('VisSense CommonJS', function () {
  'use strict';

  it('should require VisSense object', function () {
    jasmine.getFixtures().set('<div id="element" style="width: 1px; height: 1px;"></div>');

    var VisSense = require('../dist/vissense')(window);
    expect(VisSense).toBeDefined();
    // mocked noConflict should at least return itself
    expect(VisSense.noConflict()).toBe(VisSense);

    var visobj = new VisSense($('#element')[0]);
    expect(visobj).toBeDefined();
    expect(visobj.isVisible()).toBe(true);
  });

});
