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

  describe('overlapping elements', function () {
    it('does not detect elements overlapped by other content as hidden yet', function () {
      jasmine.getFixtures().load('false_positives/hidden_by_overlapping_element.html');

      var visobj = new VisSense($('#element')[0]);
      expect(visobj.isVisible()).toBe(true);
    });
  });

  describe('opacity', function () {
    it('does not take opacity of elements into account -> this a design decision', function () {
      jasmine.getFixtures().load('false_positives/hidden_by_opacity.html');

      var visobj = new VisSense($('#element')[0]);
      expect(visobj.isVisible()).toBe(true);
    });
  });

  describe('scrollbars', function () {
    it('does not detect elements hidden behind scrollbars as hidden yet', function () {
      jasmine.getFixtures().load('false_positives/hidden_behind_scrollbar.html');

      var visobj = new VisSense($('#element')[0]);
      expect(visobj.isVisible()).toBe(true);
    });
  });

});
