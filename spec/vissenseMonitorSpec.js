/*global VisSense,VisSenseUtils,jasmine,describe,it,expect,beforeEach,afterEach*/
/**
 * @license
 * VisSense <http://twyn.com/>
 * Copyright 2014 twyn group IT solutions & marketing services AG <vissense@twyn.com>
 * Available under MIT license <http://opensource.org/licenses/MIT>
 */
describe('VisSense Monitor', function() {
    'use strict';

    //var noop = function() { /*empty*/ };

    // TODO: uncomment this if jasmine supports mocking the Date object natively
    //it('should verify that jasmine mocks the Date object', function () {
    //    expect(jasmine.clock().mockDate).toBeDefined();
    //});

    describe('vissense.monitor.js', function() {
        var element, visobj;

        beforeEach(function() {

           element = document.createElement('div');
           element.id = 'testNode1';
           visobj = new VisSense(element);

           jasmine.clock().install();

            //jasmine.clock().mockDate();
        });

        afterEach(function() {
            jasmine.clock().uninstall();
        });

        it('should create a VisMon object', function () {
            var vismon = visobj.monitor();

            expect(vismon).toBeDefined();
        });

        it('should create all 3 VisState objects', function () {

            expect(VisSenseUtils.VisState.hidden(0)).toBeDefined();
            expect(VisSenseUtils.VisState.visible(1)).toBeDefined();
            expect(VisSenseUtils.VisState.fullyvisible(100)).toBeDefined();
        });

    });

});
