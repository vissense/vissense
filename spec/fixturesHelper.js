/* global jasmine,beforeEach */
/**
 * @license
 * Vissense <http://vissense.com/>
 * Copyright 2014 tbk <theborakompanioni+vissense@gmail.com>
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

        if(window.VisSenseSpecRunner === 42) {
            path = 'http://localhost:3000/';
        }

        jasmine.getFixtures().fixturesPath = path + 'spec/javascripts/fixtures';
    });

}());