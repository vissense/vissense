/*global Again,jasmine,describe,it,expect,beforeEach,afterEach*/
/**
 * @license
 * VisSense <http://twyn.com/>
 * Copyright 2014 twyn group IT solutions & marketing services AG <vissense@twyn.com>
 * Available under MIT license <http://opensource.org/licenses/MIT>
 */
describe('VisSense', function() {
    'use strict';

    var noop = function() { /*empty*/ };

    // TODO: uncomment this if jasmine supports mocking the Date object natively
    //it('should verify that jasmine mocks the Date object', function () {
    //    expect(jasmine.clock().mockDate).toBeDefined();
    //});

    it('should get the version of VisSense', function () {
        expect(VisSense.version).toBe('0.0.1');
    });

    describe('vissense.core.js', function() {
        var element;

        beforeEach(function() {

           element = document.createElement('div');
           element.id = 'testNode1';

           jasmine.clock().install();

            //jasmine.clock().mockDate();
        });

        afterEach(function() {
            jasmine.clock().uninstall();
        });

        it('should create a VisSense object', function () {
            var visobj = new VisSense(element);
            var visobj2 = VisSense(element);

            expect(visobj).toBeDefined();
            expect(visobj2).toBeDefined();
        });

        it('should create and test for a hidden object', function () {
            var visobj = new VisSense(element);

            expect(visobj.isHidden()).toBe(true);
            expect(visobj.isVisible()).toBe(false);
            expect(visobj.isFullyVisible()).toBe(false);
            expect(visobj.percentage()).toBe(0);
        });

        it('should create and test for a fully visible object', function () {
            document.body.appendChild(element);

            element.style.display = 'block';
            element.style.left = '1px';
            element.style.top = '1px';
            element.style.width = '1px';
            element.style.height = '1px';
            element.style.position = 'fixed';

            var visobj = new VisSense(element);

            expect(visobj.isHidden()).toBe(false);
            expect(visobj.isVisible()).toBe(true);
            expect(visobj.isFullyVisible()).toBe(true);
            expect(visobj.percentage()).toBe(1);
        });

    });
});
