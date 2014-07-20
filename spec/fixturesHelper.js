/* global jasmine,beforeEach,afterEach */

/**
 * @license
 * VisSense <http://twyn.com/>
 * Copyright 2014 twyn group IT solutions & marketing services AG <vissense@twyn.com>
 * Available under MIT license <http://opensource.org/licenses/MIT>
 */
;(function() {
'use strict';
    function karma() {
        return (typeof window.__karma__ !== 'undefined');
    }

    if(karma()) {
        console.log('[fixturesHelper] Running inside Karma.');
    }

    beforeEach(function () {
        var path = karma() ? 'base/' : '';

        jasmine.getFixtures().fixturesPath = path + 'spec/javascripts/fixtures';
    });

    afterEach(function() {

    });

}());