/*global VisSenseUtils,describe,it,it,expect,beforeEach,afterEach*/
/**
 * @license
 * VisSense <http://twyn.com/>
 * Copyright 2014 twyn group IT solutions & marketing services AG <vissense@twyn.com>
 * Available under MIT license <http://opensource.org/licenses/MIT>
 */
describe('VisSenseUtils', function() {
    'use strict';

    describe('browser viewport', function() {
        var simpleNode;
        beforeEach(function() {
            simpleNode = document.createElement('div');
            simpleNode.id = 'node-simple';

            document.body.appendChild(simpleNode);
        });

        afterEach(function() {
            document.body.removeChild(simpleNode);
        });

        it('should verify defined values from viewport()', function () {
            var viewport = VisSenseUtils.viewport(simpleNode);

            expect(viewport.height).toBeDefined();
            expect(viewport.width).toBeDefined();
        });
    });

    describe('element position', function() {
        var simpleNode;
        var nodeWithViewportSize;

        beforeEach(function() {
            simpleNode = document.createElement('div');
            simpleNode.id = 'node-simple';

            nodeWithViewportSize = document.createElement('div');
            nodeWithViewportSize.id = 'node-with-viewport-size';

            nodeWithViewportSize.style.display = 'block';
            nodeWithViewportSize.style.left = '0';
            nodeWithViewportSize.style.top = '0';
            nodeWithViewportSize.style.position = 'fixed';

            var viewport = VisSenseUtils.viewport(nodeWithViewportSize);
            nodeWithViewportSize.style.width = viewport.width + 'px';
            nodeWithViewportSize.style.height = viewport.height + 'px';

            document.body.appendChild(nodeWithViewportSize);
        });

        afterEach(function() {
            document.body.removeChild(nodeWithViewportSize);
        });

        it('should verify _getBoundingClientRect gives 0 values for nodeWithViewportSize NOT in document', function () {
            var rect = VisSenseUtils._getBoundingClientRect(simpleNode);
            expect(rect.bottom).toBe(0);
            expect(rect.top).toBe(0);
            expect(rect.left).toBe(0);
            expect(rect.right).toBe(0);
            expect(rect.height).toBe(0);
            expect(rect.width).toBe(0);
        });

        it('should test _getBoundingClientRect with concrete values', function () {

            var viewport = VisSenseUtils.viewport(nodeWithViewportSize);

            var rect = VisSenseUtils._getBoundingClientRect(nodeWithViewportSize);
            expect(rect.top).toBe(0);
            expect(rect.right).toBe(viewport.width);
            expect(rect.bottom).toBe(viewport.height);
            expect(rect.left).toBe(0);
            expect(rect.height).toBe(viewport.height);
            expect(rect.width).toBe(viewport.width);
        });

    });

    describe('elements visibility', function() {
        it('should verify that all VIS_HIDDEN_ELEMENTS are in fact hidden', function () {
            var that = this;
            Object.keys(that.VIS_HIDDEN_ELEMENTS).forEach(function(key) {
                //expect(that.VIS_HIDDEN_ELEMENTS[key]).toBeHidden();
                expect(that.VIS_HIDDEN_ELEMENTS[key]).toBeVisSenseHidden();
                //expect(that.VIS_HIDDEN_ELEMENTS[key]).toHaveVisSensePercentageOf(0);
            });
        });
    });
});
