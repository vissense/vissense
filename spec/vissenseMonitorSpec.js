/*global VisSense,jasmine,describe,it,expect,beforeEach,afterEach*/
/**
 * @license
 * Vissense <http://vissense.com/>
 * Copyright 2014 tbk <theborakompanioni+vissense@gmail.com>
 * Available under MIT license <http://opensource.org/licenses/MIT>
 */
describe('VisSense Monitor', function() {
    'use strict';

    //var noop = function() { /*empty*/ };

    // TODO: uncomment this if jasmine supports mocking the Date object natively
    //it('should verify that jasmine mocks the Date object', function () {
    //    expect(jasmine.clock().mockDate).toBeDefined();
    //});

    describe('VisState', function() {

        it('should create all 3 VisState objects', function () {

            expect(VisSense.VisState.hidden(0)).toBeDefined();
            expect(VisSense.VisState.visible(0.1)).toBeDefined();
            expect(VisSense.VisState.fullyvisible(1)).toBeDefined();
        });

    });


    describe('strategies', function() {

        describe('Strategy', function() {
            var strategy;

            beforeEach(function() {
                strategy = new VisSense.VisMon.Strategy();
            });

            it('should throw error on start', function () {
                expect(function() {
                    strategy.start();
                }).toThrow();
            });

            it('should throw error on stop', function () {
                expect(function() {
                    strategy.stop();
                }).toThrow();
            });
        });

        describe('NoopStrategy', function() {
            var strategy;

            beforeEach(function() {
                strategy = new VisSense.VisMon.Strategy.NoopStrategy();
            });

            it('should idle on start()', function () {
                expect(strategy.start({ update: VisSense.Utils.noop })).not.toBeDefined();
            });

            it('should idle on stop()', function () {
                expect(strategy.stop()).not.toBeDefined();
            });
        });

        describe('PollingStrategy', function() {
            var strategy;

            beforeEach(function() {
                strategy = new VisSense.VisMon.Strategy.PollingStrategy();
            });

            it('should return true on start()', function () {
                expect(strategy.start({ update: VisSense.Utils.noop })).toBe(true);
            });

            it('should return true on stop()', function () {
                strategy.start({ update: VisSense.Utils.noop });
                expect(strategy.stop()).toBe(true);
            });
            it('should return false on stop() when not running', function () {
                expect(strategy.stop()).toBe(false);
            });
        });

        describe('EventStrategy', function() {
            var strategy;

            beforeEach(function() {
                strategy = new VisSense.VisMon.Strategy.EventStrategy();
            });

            it('should return true on start()', function () {
                expect(strategy.start({ update: VisSense.Utils.noop })).toBe(true);
            });

            it('should return true on stop()', function () {
                strategy.start({ update: VisSense.Utils.noop });
                expect(strategy.stop()).toBe(true);
            });
            it('should return false on stop() when not running', function () {
                expect(strategy.stop()).toBe(false);
            });
        });

    });

    describe('VisMon', function() {
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

        it('should create VisMon objects', function () {
            var vismon = visobj.monitor();

            var vismon2 = visobj.monitor({
                update : VisSense.Utils.noop,
                hidden : VisSense.Utils.noop,
                visible : VisSense.Utils.noop,
                fullyvisible : VisSense.Utils.noop,
                percentagechange : VisSense.Utils.noop,
                visibilitychange : VisSense.Utils.noop
            });

            expect(vismon).toBeDefined();
            expect(vismon2).toBeDefined();
        });


        it('should update instance state with update()', function () {
            var config = {
                 update : function() {
                 }
            };
            var vismon = visobj.monitor(config);

            expect(vismon.status()).toBe(null);

            vismon.update();

            expect(vismon.status()).toBeDefined();

        });

        it('should verify that state instances are cached if nothing changes', function () {
            var config = {
                 update : function() {
                 }
            };
            var vismon = visobj.monitor(config);

            expect(vismon.status()).toBe(null);

            vismon.update();

            expect(vismon.status()).toBeDefined();

            vismon.update();

            var cachedState = vismon.status();
            expect(cachedState).toBeDefined();

            vismon.update();

            expect(vismon.status()).toBe(cachedState);

        });


        it('start/stop/use NoopStrategy', function () {
            var config = {
                strategy: VisSense.VisMon.Strategy.NoopStrategy(),
                update : function() {}
            };

            var vismon = visobj.monitor(config);

            expect(vismon.status()).toBe(null);

            vismon.start();

            expect(vismon.status()).toBeDefined();

            vismon.update();
            vismon.stop();

            vismon.use(config.strategy);
        });



        it('should return -1 on registering handler for invalid event', function () {
            var config = {
                strategy: VisSense.VisMon.Strategy.NoopStrategy(),
                update : function() {}
            };

            var vismon = visobj.monitor(config);

            var handlerId = vismon.on('non-existing-event', function() {
                // empty
            });

            expect(handlerId).toBe(-1);
        });

        it('should verify values on state changes', function () {
            var config = {
                strategy: VisSense.VisMon.Strategy.NoopStrategy(),
                update : function() {}
            };

            var vismon = visobj.monitor(config);

            vismon.start();

            var firstState  = vismon.status();

            expect(firstState.isHidden()).toBe(true);
            expect(firstState.isVisible()).toBe(false);
            expect(firstState.isFullyVisible()).toBe(false);

            expect(firstState.wasHidden()).toBe(false);
            expect(firstState.wasVisible()).toBe(false);
            expect(firstState.wasFullyVisible()).toBe(false);

            // from undefined to 'hidden'
            expect(firstState.hasVisibilityChanged()).toBe(true);

            vismon.update();

            var secondState  = vismon.status();

            expect(secondState.isHidden()).toBe(true);
            expect(secondState.isVisible()).toBe(false);
            expect(secondState.isFullyVisible()).toBe(false);

            expect(secondState.wasHidden()).toBe(true);
            expect(secondState.wasVisible()).toBe(false);
            expect(secondState.wasFullyVisible()).toBe(false);

            expect(secondState.hasVisibilityChanged()).toBe(false);
        });

    });

});
