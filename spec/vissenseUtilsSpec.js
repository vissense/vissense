/*global VisSenseUtils,$,jasmine,describe,it,expect*/
/**
 * @license
 * VisSense <http://twyn.com/>
 * Copyright 2014 twyn group IT solutions & marketing services AG <vissense@twyn.com>
 * Available under MIT license <http://opensource.org/licenses/MIT>
 */
describe('VisSenseUtils', function(undefined) {
    'use strict';


    it('should retrieve support object', function () {
        var support = VisSenseUtils.support();
        expect(support).toBeDefined();
        expect(support.compatible).toBe(true);
    });

    it('should verify that identity() returns the object passed', function () {
        var a = {};
        expect(VisSenseUtils.identity(a)).toBe(a);
    });

    describe('_', function() {

        it('should verify that noop() returns undefined', function () {
            expect(VisSenseUtils.noop()).not.toBeDefined();
        });

        it('should verify that identity() returns the object passed', function () {
            var a = {};
            expect(VisSenseUtils.identity(a)).toBe(a);
        });

        describe('isObject', function() {
            it('should detect {} as object', function () {
                expect(VisSenseUtils.isObject({})).toBe(true);
            });

            it('should detect [] as object', function () {
                expect(VisSenseUtils.isObject([])).toBe(true);
            });

            it('should detect a function as object', function () {
                expect(VisSenseUtils.isObject(VisSenseUtils.isObject)).toBe(true);
            });

            it('should NOT detect null/undefined/number/string/etc. as object', function () {
                expect(VisSenseUtils.isObject(null)).toBe(false);
                expect(VisSenseUtils.isObject(undefined)).toBe(false);
                expect(VisSenseUtils.isObject(0/0)).toBe(false);
                expect(VisSenseUtils.isObject(13)).toBe(false);
                expect(VisSenseUtils.isObject('string')).toBe(false);
            });
        });

        describe('extend', function() {
            it('should throw errors on non-objects', function () {
                expect(function() { VisSenseUtils.extend(null); }).toThrow();
                expect(function() { VisSenseUtils.extend(undefined); }).toThrow();
                expect(function() { VisSenseUtils.extend(0/0); }).toThrow();
                expect(function() { VisSenseUtils.extend(13); }).toThrow();
                expect(function() { VisSenseUtils.extend('string'); }).toThrow();
            });

            it('should extend an object with given values', function () {
                var dest = {
                    'aEnabled': 13,
                    'bEnabled': {},
                    'cEnabled': false,
                    'dEnabled': true,
                    'xEnabled': 'string'
                };

                var source = {
                    'aEnabled': true,
                    'bEnabled': false,
                    'cEnabled': false,
                    'dEnabled': true,
                    'eEnabled': 1,
                    'fEnabled': false
                };

                expect(VisSenseUtils.extend(dest, source)).toEqual({
                    'aEnabled': true,
                    'bEnabled': false,
                    'cEnabled': false,
                    'dEnabled': true,
                    'eEnabled': 1,
                    'fEnabled': false,
                    'xEnabled': 'string'
                });
            });

            it('should extend an array with given values', function () {
                var dest = [
                    false,
                    true,
                    false,
                    true,
                    null,
                    null,
                    13
                ];

                var source = [
                    true,
                    false,
                    false,
                    true,
                    true,
                    false
                ];

                expect(VisSenseUtils.extend(dest, source)).toEqual([
                    true,
                    false,
                    false,
                    true,
                    true,
                    false,
                    13
                 ]);
            });

            it('should extend with callback values', function () {
                var sneakIn = {
                    'aEnabled': 42
                };

                var dest = {
                    'aEnabled': 13,
                    'bEnabled': {},
                    'cEnabled': false
                };

                var source = {
                    'aEnabled': false,
                    'cEnabled': true
                };

                var callback = function(destVal, sourceVal, key) {
                    if(sneakIn[key] !== undefined) {
                        return sneakIn[key];
                    }
                    return sourceVal;
                };

                expect(VisSenseUtils.extend(dest, source, callback)).toEqual({
                    'aEnabled': 42,
                    'bEnabled': {},
                    'cEnabled': true
                });
            });
        });

        describe('defaults', function() {
            it('should immediately return on non-object values', function () {
                expect(VisSenseUtils.defaults(true, false)).toBe(false);
                expect(VisSenseUtils.defaults(null, false)).toBe(false);
            });

            it('should add default values to object', function () {
                var dest = {
                    'aEnabled': 13,
                    'bEnabled': {},
                    'cEnabled': false,
                    'dEnabled': true,
                    'xEnabled': 'string'
                };

                var defaults = {
                    'bEnabled': false,
                    'cEnabled': false,
                    'dEnabled': true,
                    'eEnabled': 1,
                    'fEnabled': false
                };

                expect(VisSenseUtils.defaults(dest, defaults)).toEqual({
                    'aEnabled': 13,
                    'bEnabled': {},
                    'cEnabled': false,
                    'dEnabled': true,
                    'eEnabled': 1,
                    'fEnabled': false,
                    'xEnabled': 'string'
                });
            });

            it('should add default values to array', function () {
                var dest = [
                    false,
                    true,
                    false,
                    true
                ];

                var defaults = [
                    true,
                    false,
                    false,
                    true,
                    true,
                    false
                ];

                expect(VisSenseUtils.defaults(dest, defaults)).toEqual([
                     false,
                     true,
                     false,
                     true,
                     true,
                     false
                 ]);
            });
        });
    });

    describe('window', function() {
        it('should verify defined values from window()', function () {
            var win = VisSenseUtils._window();

            expect(win).toBe(window);
        });

        it('should verify defined values from window(element)', function () {
            jasmine.getFixtures().set('<div id="element"></div>');

            var win = VisSenseUtils._window($('#element')[0]);

            expect(win).toBe(window);
        });
    });

    describe('viewport', function() {

        it('should verify defined values from viewport()', function () {
            var viewport = VisSenseUtils.viewport();

            expect(viewport.height).toBeDefined();
            expect(viewport.width).toBeDefined();
        });

        it('should verify defined values from viewport(element)', function () {
            jasmine.getFixtures().set('<div id="element"></div>');

            var viewport = VisSenseUtils.viewport($('#element')[0]);

            expect(viewport.height).toBeDefined();
            expect(viewport.width).toBeDefined();
        });
    });

    describe('element position', function() {
        it('should verify _getBoundingClientRect gives 0 values for elements not appended to DOM', function () {
            var elementNotInDom = $('<div></div>')[0];
            var rect = VisSenseUtils._getBoundingClientRect(elementNotInDom);
            expect(rect.bottom).toBe(0);
            expect(rect.top).toBe(0);
            expect(rect.left).toBe(0);
            expect(rect.right).toBe(0);
            expect(rect.height).toBe(0);
            expect(rect.width).toBe(0);
        });

        it('should test _getBoundingClientRect with concrete values', function () {
            var viewport = VisSenseUtils.viewport();

            jasmine.getFixtures().set('<div id="element" ' +
                'style="top:0; left:0; position: fixed; width: '+viewport.width+'px; height: '+viewport.height+'px"></div>');

            var rect = VisSenseUtils._getBoundingClientRect($('#element')[0]);
            expect(rect.top).toBe(0);
            expect(rect.right).toBe(viewport.width);
            expect(rect.bottom).toBe(viewport.height);
            expect(rect.left).toBe(0);
            expect(rect.height).toBe(viewport.height);
            expect(rect.width).toBe(viewport.width);
        });

    });

    describe('elements visibility', function() {

        describe('hidden elements', function() {

            describe('by dimension', function() {

                it('should detect element where height and width are 0 as hidden', function () {
                    jasmine.getFixtures().load('hidden_dimension.html');
                    expect($('#element')[0]).toBeVisSenseHidden();
                    expect($('#element')[0]).not.toBeVisSenseVisible();
                    expect($('#element')[0]).toHaveVisSensePercentageOf(0);
                });

                it('should detect element where width is 0 as hidden', function () {
                    jasmine.getFixtures().load('hidden_dimension_width.html');
                    expect($('#element')[0]).toBeVisSenseHidden();
                    expect($('#element')[0]).not.toBeVisSenseVisible();
                    expect($('#element')[0]).toHaveVisSensePercentageOf(0);
                });

                it('should detect element where height is 0 as hidden', function () {
                    jasmine.getFixtures().load('hidden_dimension_height.html');
                    expect($('#element')[0]).toBeVisSenseHidden();
                    expect($('#element')[0]).not.toBeVisSenseVisible();
                    expect($('#element')[0]).toHaveVisSensePercentageOf(0);
                });
            });

            describe('by styling', function() {

                it('should detect element with ´display´ "none" as hidden', function () {
                    jasmine.getFixtures().load('hidden_styling-display-none.html');
                    expect($('#element')[0]).toBeVisSenseHidden();
                    expect($('#element')[0]).not.toBeVisSenseVisible();
                    expect($('#element')[0]).toHaveVisSensePercentageOf(0);
                });

                it('should detect element with ´opacity´ <= 1% as hidden', function () {
                    jasmine.getFixtures().load('hidden_styling-opacity.html');
                    expect($('#element')[0]).toBeVisSenseHidden();
                    expect($('#element')[0]).not.toBeVisSenseVisible();
                    expect($('#element')[0]).toHaveVisSensePercentageOf(0);
                });

                it('should detect element with ´visibility´ "hidden" as hidden', function () {
                    jasmine.getFixtures().load('hidden_styling-visibility-collapse.html');
                    expect($('#element')[0]).toBeVisSenseHidden();
                    expect($('#element')[0]).not.toBeVisSenseVisible();
                    expect($('#element')[0]).toHaveVisSensePercentageOf(0);
                });

                it('should detect element with ´visibility´ "collapse" as hidden', function () {
                    jasmine.getFixtures().load('hidden_styling-visibility-hidden.html');
                    expect($('#element')[0]).toBeVisSenseHidden();
                    expect($('#element')[0]).not.toBeVisSenseVisible();
                    expect($('#element')[0]).toHaveVisSensePercentageOf(0);
                });
            });

            describe('by position', function() {

                it('should detect element out of viewport (top) as hidden', function () {
                    jasmine.getFixtures().load('hidden_out-of-viewport-top.html');
                    expect($('#element')[0]).toBeVisSenseHidden();
                    expect($('#element')[0]).not.toBeVisSenseVisible();
                    expect($('#element')[0]).toHaveVisSensePercentageOf(0);
                });

                it('should detect element out of viewport (right) as hidden', function () {
                    jasmine.getFixtures().load('hidden_out-of-viewport-right.html');
                    expect($('#element')[0]).toBeVisSenseHidden();
                    expect($('#element')[0]).not.toBeVisSenseVisible();
                    expect($('#element')[0]).toHaveVisSensePercentageOf(0);
                });

                it('should detect element out of viewport (bottom) as hidden', function () {
                    jasmine.getFixtures().load('hidden_out-of-viewport-bottom.html');
                    expect($('#element')[0]).toBeVisSenseHidden();
                    expect($('#element')[0]).not.toBeVisSenseVisible();
                    expect($('#element')[0]).toHaveVisSensePercentageOf(0);
                });

                it('should detect element out of viewport (left) as hidden', function () {
                    jasmine.getFixtures().load('hidden_out-of-viewport-left.html');
                    expect($('#element')[0]).not.toBeVisSenseVisible();
                    expect($('#element')[0]).toBeVisSenseHidden();
                    expect($('#element')[0]).toHaveVisSensePercentageOf(0);
                });
            });
        });

        describe('visible elements', function() {
            it('should detect element with 1% visibility as visible', function () {
                jasmine.getFixtures().load('visible_1_percent_top_left.html');
                expect($('#element')).toBeVisible();
                expect($('#element')[0]).not.toBeVisSenseHidden();
                expect($('#element')[0]).toBeVisSenseVisible();
                expect($('#element')[0]).not.toBeVisSenseFullyVisible();
                expect($('#element')[0]).toHaveVisSensePercentageOf(0.01);
            });

            it('should detect element bigger than viewport as visible', function () {
                jasmine.getFixtures().load('visible_bigger_than_viewport.html');
                expect($('#element')).toBeVisible();
                expect($('#element')[0]).not.toBeVisSenseHidden();
                expect($('#element')[0]).toBeVisSenseVisible();
                expect($('#element')[0]).not.toBeVisSenseFullyVisible();

                /* we really dont know what the viewport size will be */
                var percentage = VisSenseUtils.percentage($('#element')[0]);
                expect(percentage).toBeLessThan(1);
                expect(percentage).toBeGreaterThan(0);

            });
        });

        describe('fullyvisible elements', function() {
            it('should detect an element as fullyvisible', function () {
                jasmine.getFixtures().load('fullyvisible_simple.html');
                expect($('#element')).toBeVisible();
                expect($('#element')[0]).not.toBeVisSenseHidden();
                expect($('#element')[0]).toBeVisSenseVisible();
                expect($('#element')[0]).toBeVisSenseFullyVisible();
                expect($('#element')[0]).toHaveVisSensePercentageOf(1);
            });

            it('should detect element with ´opacity´ >= 0.01 as fullyvisible', function () {
                jasmine.getFixtures().load('fullyvisible_styling-opacity.html');
                expect($('#element')).toBeVisible();
                expect($('#element')[0]).toBeVisSenseVisible();
                expect($('#element')[0]).toBeVisSenseFullyVisible();
                expect($('#element')[0]).toHaveVisSensePercentageOf(1);
            });

        });

    });
});
