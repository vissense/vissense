/*global VisSense,$,jasmine,describe,it,expect*/

describe('False positives detected by VisSense', function () {
  'use strict';

  describe('"overflow: hidden;" flaw', function () {
    it('does not detect elements hidden by "overflow: hidden;" as hidden yet', function () {
      jasmine.getFixtures().load('false_positives/hidden_by_overflow_hidden.html');

      var visobj = new VisSense($('#element')[0]);
      expect(visobj.isVisible()).toBe(true);
    });
  });
});
