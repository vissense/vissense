/* global jasmine,beforeEach */

(function () {
    'use strict';
    function karma() {
        return (typeof window.__karma__ !== 'undefined');
    }

    if (karma()) {
        console.debug('[fixturesHelper] Running inside Karma.');
    }

    // If base path is different from the default `spec/fixtures`
    before(() => {
        //var path = karma() ? 'base/' : '';
        //fixture.setBase(path + 'test/client/fixtures');
        var fixtureBase = 'test/client/fixtures';
        console.debug('[fixturesHelper] set fixture base to ' + fixtureBase);
        fixture.setBase(fixtureBase);
    });

    afterEach(() => {
        fixture.cleanup()
    });
}());
