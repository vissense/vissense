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

    describe('vissense.timer.js', function() {
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

        it('should create a VisTimer object', function () {
            var vistimer = visobj.timer();

            expect(vistimer).toBeDefined();
        });

        it('should attach and remove a handler', function () {
            var vistimer = visobj.timer();

            var id = vistimer.every(noop, {});
            var stopped = vistimer.stop(id);

            expect(stopped).toBe(true);
        });

        it('jasmine clearTimeout clearInverval test', function () {
            var intervalCount = 0;
            var timerCount = 0;

            var intervalId = setInterval(function() {
                intervalCount++;
            }, 100);

            jasmine.clock().tick(101);

            expect(intervalCount).toBe(1);

            clearInterval(intervalId);

            jasmine.clock().tick(101);

            expect(intervalCount).toBe(1);
        });

        it('should deregister a handler after first invocation', function () {
            var vistimer = visobj.timer();

            var invocations = 0;

            var timerId = vistimer.every(10, 10, function() {
                invocations = invocations + 1;

                // TODO: it should not be necessary to call setTimeout here..
                setTimeout(function() {
                    var stopped = vistimer.stop(timerId);

                    expect(stopped).toBe(true);
                });
            }, false);

            jasmine.clock().tick(11);

            expect(invocations).toBe(1);

            jasmine.clock().tick(111);

            expect(invocations).toBe(1);
        });

        it('should invoke a handler 100_000 times', function () {
            var vistimer = visobj.timer();

            var invocations = 0;

            var timerId = vistimer.every(10, 10, function() {
                invocations = invocations + 1;
            }, false);

            jasmine.clock().tick(1000001);

            expect(invocations).toBe(100000);
        });

    });

    /*
    var element1 = document.getElementById('testNode1');
    var vis1 = new VisSense(element1);
    var vistimer = vis1.timer();

    asyncTest( "if handler can be deregistered from VisTimer", function() {
        expect(2);
    });
    */
});
