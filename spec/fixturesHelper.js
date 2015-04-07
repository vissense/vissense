/* global jasmine,beforeEach */

(function () {
  'use strict';
  function karma() {
    return (typeof window.__karma__ !== 'undefined');
  }

  if (karma()) {
    console.log('[fixturesHelper] Running inside Karma.');
  }

  beforeEach(function () {
    var path = karma() ? 'base/' : '';

    jasmine.getFixtures().fixturesPath = path + 'spec/javascripts/fixtures';
  });

}());
