/*global VisSenseUtils,$,jasmine,describe,it,beforeEach,afterEach,spyOn,expect,_*/
/**
 * @license
 * Vissense <http://vissense.com/>
 * Copyright 2014 tbk <theborakompanioni+vissense@gmail.com>
 * Available under MIT license <http://opensource.org/licenses/MIT>
 */
describe('VisSenseUtils', function(undefined) {
    'use strict';

    it('should verify that identity() returns the object passed', function () {
        var a = {};
        expect(VisSenseUtils.identity(a)).toBe(a);
    });

    it('should verify that now() returns a timestamp', function () {
        expect(VisSenseUtils.now()).toBeGreaterThan(0);
    });

    describe('_', function() {

        it('should verify that noop() returns undefined', function () {
            expect(VisSenseUtils.noop()).not.toBeDefined();
        });

        it('should verify that identity() returns the object passed', function () {
            var a = {};
            expect(VisSenseUtils.identity(a)).toBe(a);
        });

        describe('fireIf', function() {
            var func;
            beforeEach(function() {
                func = {
                  returnTrue: function() { return true; },
                  returnFalse: function() { return false; }
                };

                spyOn(func, 'returnTrue').and.callThrough();
            });

            it('should fire if expression is function returning true', function () {
                expect(VisSenseUtils.fireIf(true, func.returnTrue)()).toBe(true);
                expect(VisSenseUtils.fireIf(function() { return true; }, func.returnTrue)()).toBe(true);
                expect(func.returnTrue.calls.count()).toEqual(2);
            });
            it('should NOT fire if expression is false', function () {
                expect(VisSenseUtils.fireIf(false, func.returnTrue)()).not.toBeDefined();
                expect(VisSenseUtils.fireIf(func.returnFalse, func.returnTrue)()).not.toBeDefined();

                expect(func.returnTrue.calls.count()).toEqual(0);
            });
        });

        describe('defer', function() {
            var timerCallback;
            beforeEach(function() {
                timerCallback = jasmine.createSpy('timerCallback');
                jasmine.clock().install();
            });
            afterEach(function() {
                jasmine.clock().uninstall();
            });
            it('should defer function', function () {
                VisSenseUtils.defer(function() {
                    timerCallback();
                });

                expect(timerCallback).not.toHaveBeenCalled();

                jasmine.clock().tick(10);

                expect(timerCallback).toHaveBeenCalled();
            });
        });

        describe('isFunction', function() {
            it('should detect `isFunction` as function', function () {
                expect(VisSenseUtils.isFunction(VisSenseUtils.isFunction)).toBe(true);
            });
            it('should NOT detect {} as function', function () {
                expect(VisSenseUtils.isFunction({})).toBe(false);
            });
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
            var viewport = VisSenseUtils._viewport();

            expect(viewport.height).toBeDefined();
            expect(viewport.width).toBeDefined();
        });

        it('should verify defined values from viewport(element)', function () {
            jasmine.getFixtures().set('<div id="element"></div>');

            var viewport = VisSenseUtils._viewport($('#element')[0]);

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
            var viewport = VisSenseUtils._viewport();

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

        describe('effective style', function() {

            it('should get style property of simple element', function () {
                jasmine.getFixtures().set('<div id="element"></div>');

                var border = VisSenseUtils._findEffectiveStyleProperty($('#element')[0], 'border');
                expect(border).toBeDefined();
            });

            it('should find inherit "visibility" property of simple element', function () {
                jasmine.getFixtures().set('<div id="element" style="visibility: hidden">' +
                    '<div></div>' +
                    '<div style="visibility: inherit"></div>' +
                    '<div style="visibility: visible"></div>' +
                    '<div style="visibility: collapse"></div>' +
                '</div>');

                var parentStyle = VisSenseUtils._findEffectiveStyleProperty($('#element')[0], 'visibility');
                var children = $('#element').children();

                var style0 = VisSenseUtils._findEffectiveStyleProperty(children[0], 'visibility');
                var style1 = VisSenseUtils._findEffectiveStyleProperty(children[1], 'visibility');
                var style2 = VisSenseUtils._findEffectiveStyleProperty(children[2], 'visibility');
                var style3 = VisSenseUtils._findEffectiveStyleProperty(children[3], 'visibility');

                expect(parentStyle).toEqual('hidden');
                expect(style0).toEqual('hidden');
                expect(style1).toEqual('hidden');
                expect(style2).toEqual('visible');
                expect(style3).toEqual('collapse');
            });

            it('should find inherit "display" property of simple element', function () {
                jasmine.getFixtures().set('<div id="element" style="display: none">' +
                    '<div style="display: inherit"></div>' +
                    '<div style="display: block"></div>' +
                    '<div style="display: inline-block"></div>' +
                '</div>');

                var parentStyle = VisSenseUtils._findEffectiveStyleProperty($('#element')[0], 'display');

                var children = $('#element').children();
                var style0 = VisSenseUtils._findEffectiveStyleProperty(children[0], 'display');
                var style1 = VisSenseUtils._findEffectiveStyleProperty(children[1], 'display');
                var style2 = VisSenseUtils._findEffectiveStyleProperty(children[2], 'display');

                expect(parentStyle).toEqual('none');
                expect(style0).toEqual('none');
                expect(style1).toEqual('block');
                expect(style2).toEqual('inline-block');
            });

            it('should detect children in container with style "display:none" to be hidden', function () {
                jasmine.getFixtures().set('<div id="element" style="display: none">' +
                    '<div style="display: inherit"></div>' +
                    '<div style="display: block"></div>' +
                    '<div style="display: inline-block"></div>' +
                    '<div style="display: none"></div>' +
                    '<div style="visibility: hidden"></div>' +
                    '<div style="visibility: collapse"></div>' +
                    '<div style="visibility: visible"></div>' +
                '</div>');

                expect(VisSenseUtils._isDisplayed($('#element')[0])).toBe(false);
                expect(VisSenseUtils.isVisibleByStyling($('#element')[0])).toBe(false);

                _.forEach($('#element').children(), function(child) {
                    expect(VisSenseUtils._isDisplayed(child)).toBe(false);
                    expect(VisSenseUtils.isVisibleByStyling(child)).toBe(false);
                });

            });


            it('should detect children in container with style "display:block" to be visible', function () {
                jasmine.getFixtures().set('<div id="element" style="display: block">' +
                    '<div style="display: inherit"></div>' +
                    '<div style="display: inline-block"></div>' +
                    '<div style="display: none"></div>' +
                '</div>');

                var children = $('#element').children();

                expect(VisSenseUtils._isDisplayed($('#element')[0])).toBe(true);
                expect(VisSenseUtils._isDisplayed(children[0])).toBe(true);
                expect(VisSenseUtils._isDisplayed(children[1])).toBe(true);
                expect(VisSenseUtils._isDisplayed(children[2])).toBe(false);

                expect(VisSenseUtils.isVisibleByStyling($('#element')[0])).toBe(true);
                expect(VisSenseUtils.isVisibleByStyling(children[0])).toBe(true);
                expect(VisSenseUtils.isVisibleByStyling(children[1])).toBe(true);
                expect(VisSenseUtils.isVisibleByStyling(children[2])).toBe(false);
            });

            it('should detect "document" has visible by styling', function () {
                expect(VisSenseUtils.isVisibleByStyling(document)).toBe(true);
            });
            it('should detect "null" has hidden by styling', function () {
                expect(VisSenseUtils.isVisibleByStyling(null)).toBe(false);
            });

        });

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

                it('should detect nested element with parent ´display´ "none" as hidden', function () {
                    jasmine.getFixtures().load('hidden_styling-display-none_nested.html');
                    expect($('#element')[0]).toBeVisSenseHidden();
                    expect($('#element')[0]).not.toBeVisSenseVisible();
                    expect($('#element')[0]).toHaveVisSensePercentageOf(0);
                });

                it('should detect element with ´visibility´ "collapse" as hidden', function () {
                    jasmine.getFixtures().load('hidden_styling-visibility-collapse.html');
                    expect($('#element')[0]).toBeVisSenseHidden();
                    expect($('#element')[0]).not.toBeVisSenseVisible();
                    expect($('#element')[0]).toHaveVisSensePercentageOf(0);
                });

                it('should detect nested element with parent ´visibility´ "collapse" as hidden', function () {
                    jasmine.getFixtures().load('hidden_styling-visibility-collapse_nested.html');
                    expect($('#element')[0]).toBeVisSenseHidden();
                    expect($('#element')[0]).not.toBeVisSenseVisible();
                    expect($('#element')[0]).toHaveVisSensePercentageOf(0);
                });

                it('should detect element with ´visibility´ "hidden" as hidden', function () {
                    jasmine.getFixtures().load('hidden_styling-visibility-hidden.html');
                    expect($('#element')[0]).toBeVisSenseHidden();
                    expect($('#element')[0]).not.toBeVisSenseVisible();
                    expect($('#element')[0]).toHaveVisSensePercentageOf(0);
                });

                it('should detect nested element with parent ´visibility´ "hidden" as hidden', function () {
                    jasmine.getFixtures().load('hidden_styling-visibility-hidden_nested.html');
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
            it('should detect element with 25% visibility as visible', function () {
                jasmine.getFixtures().load('visible_25_percent_top_left.html');
                expect($('#element')).toBeVisible();
                expect($('#element')[0]).not.toBeVisSenseHidden();
                expect($('#element')[0]).toBeVisSenseVisible();
                expect($('#element')[0]).not.toBeVisSenseFullyVisible();
                expect($('#element')[0]).toHaveVisSensePercentageOf(0.25);
            });
            it('should detect element with 50% visibility as visible', function () {
                jasmine.getFixtures().load('visible_50_percent_top.html');
                expect($('#element')).toBeVisible();
                expect($('#element')[0]).not.toBeVisSenseHidden();
                expect($('#element')[0]).toBeVisSenseVisible();
                expect($('#element')[0]).not.toBeVisSenseFullyVisible();
                expect($('#element')[0]).toHaveVisSensePercentageOf(0.5);
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
        });

    });
});
