/*global VisSenseUtils,$,jasmine,describe,it,expect*/
/**
 * @license
 * VisSense <http://twyn.com/>
 * Copyright 2014 twyn group IT solutions & marketing services AG <vissense@twyn.com>
 * Available under MIT license <http://opensource.org/licenses/MIT>
 */
describe('VisSenseUtils', function() {
    'use strict';

    describe('browser viewport', function() {
        it('should verify defined values from viewport()', function () {
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
            /*it('should verify that all VIS_HIDDEN_ELEMENTS are in fact hidden', function () {
                var that = this;
                Object.keys(that.VIS_HIDDEN_ELEMENTS).forEach(function(key) {
                    //expect($(that.VIS_HIDDEN_ELEMENTS[key])).toBeHidden(); // jQuery hidden
                    expect(that.VIS_HIDDEN_ELEMENTS[key]).toBeVisSenseHidden();
                    //expect(that.VIS_HIDDEN_ELEMENTS[key]).toHaveVisSensePercentageOf(0);
                });
            });*/

            describe('elements hidden by dimension', function() {

                it('should detect element where height and width are 0 as hidden', function () {
                    jasmine.getFixtures().set('<div id="element" style="width: 0; height: 0"></div>');
                    expect($('#element')[0]).toBeVisSenseHidden();
                });

                it('should detect element where height is 0 as hidden', function () {
                    jasmine.getFixtures().set('<div id="element" style="height: 0"></div>');
                    expect($('#element')[0]).toBeVisSenseHidden();
                });

                it('should detect element where width is 0 as hidden', function () {
                    jasmine.getFixtures().set('<div id="element" style="width: 0"></div>');
                    expect($('#element')[0]).toBeVisSenseHidden();
                });
            });

            describe('elements hidden by styling', function() {

                it('should detect element with ´opacity´ < 0.01 as hidden', function () {
                    jasmine.getFixtures().set('<div id="element" style="width: 10px; height: 10px; opacity: 0.00999;"></div>');
                    expect($('#element')[0]).toBeVisSenseHidden();
                });

                it('should detect element with ´visibility´ "hidden" as hidden', function () {
                    jasmine.getFixtures().set('<div id="element" style="width: 10px; height: 10x; visibility: hidden;"></div>');
                    expect($('#element')[0]).toBeVisSenseHidden();
                });

                it('should detect element with ´visibility´ "collapse" as hidden', function () {
                    jasmine.getFixtures().set('<div id="element" style="width: 10px; height: 10x; visibility: collapse;"></div>');
                    expect($('#element')[0]).toBeVisSenseHidden();
                });
            });

            describe('elements hidden by position', function() {

                it('should detect element out of viewport (top) as hidden', function () {
                    jasmine.getFixtures().set('<div id="element" ' +
                        'style="top:-10px; left:0; position: fixed; width: 10px; height: 10px"></div>');
                    expect($('#element')[0]).toBeVisSenseHidden();
                });

                /* SpecRunner.html has a problem with "top:0; right-10px;" as a scrollbar is added -  */
                it('should detect element out of viewport (right) as hidden', function () {
                    jasmine.getFixtures().set('<div id="element" ' +
                        'style="top:0; right:-25px; position: fixed; width: 10px; height: 10px"></div>');
                    expect($('#element')[0]).toBeVisSenseHidden();
                });

                it('should detect element out of viewport (bottom) as hidden', function () {
                    jasmine.getFixtures().set('<div id="element" ' +
                        'style="bottom:-10px; left:0; position: fixed; width: 10px; height: 10px"></div>');
                    expect($('#element')[0]).toBeVisSenseHidden();
                });

                it('should detect element out of viewport (left) as hidden', function () {
                    jasmine.getFixtures().set('<div id="element" ' +
                        'style="top:0; left:-10px; position: fixed; width: 10px; height: 10px"></div>');
                    expect($('#element')[0]).toBeVisSenseHidden();
                    expect($('#element')[0]).toBeVisSenseHidden();
                });
            });
        });

        describe('visible elements', function() {
            it('should detect an element as visible', function () {
                //jasmine.getFixtures().load('testVisible.html');
                jasmine.getFixtures().set('<div id="element" style="width: 1px; height: 1px;"></div>');
                expect($('#element')).toBeVisible();
                expect($('#element')[0]).toBeVisSenseVisible();
            });
            it('should detect element with ´opacity´ >= 0.01 as visible', function () {
                jasmine.getFixtures().set('<div id="element" style="width: 1px; height: 1px; opacity: 0.1;"></div>');
                expect($('#element')).toBeVisible();
                expect($('#element')[0]).toBeVisSenseVisible();
            });
        });

    });
});
