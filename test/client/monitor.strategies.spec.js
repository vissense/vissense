import VisSense from "../../src/entry.js";

describe('VisSense.Monitor', () => {
    var clock;

    beforeEach(() => {
        clock = sinon.useFakeTimers();
    });
    afterEach(() => {
        clock.restore();
    });

    var monitorMock;

    beforeEach(() => {
        monitorMock = {
            update: VisSense.Utils.noop,
            visobj: () => {
                return {
                    referenceWindow: () => window
                };
            }
        };
    });

    describe('Strategy', () => {
        var strategy;

        beforeEach(() => {
            strategy = new VisSense.VisMon.Strategy();
        });

        it('should not throw an error on init', () => {
            expect(() => {
                strategy.init(monitorMock);
            }).to.not.throw;
        });

        it('should not throw an error on start', () => {
            expect(() => {
                strategy.start(monitorMock);
            }).to.not.throw;
        });

        it('should not throw an error on stop', () => {
            expect(() => {
                strategy.stop(monitorMock);
            }).to.not.throw;
        });
    });


    describe('CompositeStrategy', () => {
        var strategy, strategies;

        beforeEach(() => {
            strategies = [
                new VisSense.VisMon.Strategy.PollingStrategy(),
                new VisSense.VisMon.Strategy.EventStrategy(),
                new VisSense.VisMon.Strategy.CompositeStrategy()
            ];

            for (var i = 0, n = strategies.length; i < n; i++) {
                sinon.spy(strategies[i], 'init');
                sinon.spy(strategies[i], 'start');
                sinon.spy(strategies[i], 'stop');
            }

            strategy = new VisSense.VisMon.Strategy.CompositeStrategy(strategies);
        });

        it('should call all inner objects init() method', () => {
            strategy.init(monitorMock);

            for (var i = 0, n = strategies.length; i < n; i++) {
                expect(strategies[i].init.callCount).to.be.eql(1);
            }
        });

        it('should call all inner objects start() method', () => {
            strategy.start(monitorMock);

            for (var i = 0, n = strategies.length; i < n; i++) {
                expect(strategies[i].start.callCount).to.be.eql(1);
            }
        });

        it('should call all inner objects stop() method', () => {
            strategy.stop(monitorMock);

            for (var i = 0, n = strategies.length; i < n; i++) {
                expect(strategies[i].stop.callCount).to.be.eql(1);
            }
        });
    });

    describe('PollingStrategy', () => {
        var strategy;

        beforeEach(() => {
            strategy = new VisSense.VisMon.Strategy.PollingStrategy();
        });

        it('should return true on start()', () => {
            expect(strategy.start(monitorMock)).to.be.eql(true);
        });
        it('should return true on start() when already running', () => {
            strategy.start(monitorMock);
            expect(strategy.start(monitorMock)).to.be.eql(true);
        });
        it('should return true on stop()', () => {
            strategy.start(monitorMock);
            expect(strategy.stop(monitorMock)).to.be.eql(true);
        });
        it('should return false on stop() when not running', () => {
            expect(strategy.stop(monitorMock)).to.be.eql(false);
        });
    });


    describe('EventStrategy', () => {
        function fireScrollEvent() {
            var event = document.createEvent('Event');
            event.initEvent('scroll', true, true);
            window.dispatchEvent(event);
        }

        var element, visobj;
        beforeEach(() => {
            fixture.set('<div id="element" style="height: 100px; width: 100px; display: none;"></div>');
            element = document.getElementById('element');
            visobj = new VisSense(element);
        });

        describe('start/stop', () => {
            var strategy;

            beforeEach(() => {
                strategy = new VisSense.VisMon.Strategy.EventStrategy();
            });

            it('should return true on start()', () => {
                expect(strategy.start(monitorMock)).to.be.eql(true);
            });
            it('should return true on start() when already running', () => {
                strategy.start(monitorMock);
                expect(strategy.start(monitorMock)).to.be.eql(true);
            });
            it('should return true on stop()', () => {
                strategy.start(monitorMock);
                expect(strategy.stop(monitorMock)).to.be.eql(true);
            });
            it('should return false on stop() when not running', () => {
                expect(strategy.stop(monitorMock)).to.be.eql(false);
            });
        });

        it('should that throttled function calls on multiple events', () => {
            var throttled = 100;

            var config = {
                strategy: new VisSense.VisMon.Strategy.EventStrategy({
                    debounce: throttled
                }),
                update: () => {
                }
            };

            // deprecated 'debounce' options should still be supported
            expect(config.strategy._config.throttle).to.be.eql(throttled);

            sinon.spy(config, 'update');

            var vismon = visobj.monitor(config);

            expect(config.update.callCount).to.be.eql(0);

            vismon.start();

            expect(vismon.state().visible).to.be.eql(false);
            expect(config.update.callCount).to.be.eql(1);

            element.style.display = 'block'; // set visible

            clock.tick(throttled + 42);

            // must still be false, because no event has been fired yet
            expect(vismon.state().visible).to.be.eql(false);
            expect(config.update.callCount).to.be.eql(1);

            fireScrollEvent();

            expect(vismon.state().visible).to.be.eql(false);
            expect(config.update.callCount).to.be.eql(1);

            clock.tick(1);

            expect(vismon.state().visible).to.be.eql(true);
            expect(config.update.callCount).to.be.eql(2);

            fireScrollEvent();

            clock.tick(1);

            expect(vismon.state().visible).to.be.eql(true);
            expect(config.update.callCount).to.be.eql(2);

            clock.tick(throttled);

            expect(vismon.state().visible).to.be.eql(true);
            expect(config.update.callCount).to.be.eql(3);

            vismon.stop();
        });
    });
});
