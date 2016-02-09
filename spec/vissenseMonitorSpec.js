/*global VisSense,$,jasmine,describe,it,expect,beforeEach,afterEach,spyOn*/

describe('VisSense Monitor', function () {
  'use strict';

  beforeEach(function () {
    jasmine.clock().install();
    jasmine.clock().mockDate();
  });

  afterEach(function () {
    jasmine.clock().uninstall();
  });

  describe('VisState', function () {

    it('should create all 3 VisState objects', function () {
      expect(VisSense.VisState.hidden(0)).toBeDefined();
      expect(VisSense.VisState.visible(0.1)).toBeDefined();
      expect(VisSense.VisState.fullyvisible(1)).toBeDefined();
    });

  });

  describe('strategies', function () {
    var monitorMock;

    beforeEach(function () {
      monitorMock = {
        update: VisSense.Utils.noop,
        visobj: function() {
          return {
            referenceWindow: function() {
              return window;
            }
          };
        }
      };
    });

    describe('Strategy', function () {
      var strategy;

      beforeEach(function () {
        strategy = new VisSense.VisMon.Strategy();
      });

      it('should not throw an error on init', function () {
        expect(function () {
          strategy.init(monitorMock);
        }).not.toThrow();
      });

      it('should not throw an error on start', function () {
        expect(function () {
          strategy.start(monitorMock);
        }).not.toThrow();
      });

      it('should not throw an error on stop', function () {
        expect(function () {
          strategy.stop(monitorMock);
        }).not.toThrow();
      });
    });

    describe('PollingStrategy', function () {
      var strategy;

      beforeEach(function () {
        strategy = new VisSense.VisMon.Strategy.PollingStrategy();
      });

      it('should return true on start()', function () {
        expect(strategy.start(monitorMock)).toBe(true);
      });
      it('should return true on start() when already running', function () {
        strategy.start(monitorMock);
        expect(strategy.start(monitorMock)).toBe(true);
      });
      it('should return true on stop()', function () {
        strategy.start(monitorMock);
        expect(strategy.stop(monitorMock)).toBe(true);
      });
      it('should return false on stop() when not running', function () {
        expect(strategy.stop(monitorMock)).toBe(false);
      });
    });

    describe('EventStrategy', function () {
      function fireScrollEvent() {
        var event = document.createEvent('Event');
        event.initEvent('scroll', true, true);
        window.dispatchEvent(event);
      }

      var element, visobj;
      beforeEach(function () {
        jasmine.getFixtures().set('<div id="element" style="height: 100px; width: 100px; display: none;"></div>');
        element = $('#element')[0];
        visobj = new VisSense(element);
      });

      describe('start/stop', function () {
        var strategy;

        beforeEach(function () {
          strategy = new VisSense.VisMon.Strategy.EventStrategy();
        });

        it('should return true on start()', function () {
          expect(strategy.start(monitorMock)).toBe(true);
        });
        it('should return true on start() when already running', function () {
          strategy.start(monitorMock);
          expect(strategy.start(monitorMock)).toBe(true);
        });
        it('should return true on stop()', function () {
          strategy.start(monitorMock);
          expect(strategy.stop(monitorMock)).toBe(true);
        });
        it('should return false on stop() when not running', function () {
          expect(strategy.stop(monitorMock)).toBe(false);
        });
      });

      it('should that throttled function calls on multiple events', function () {
        var throttled = 100;

        var config = {
          strategy: new VisSense.VisMon.Strategy.EventStrategy({
            debounce: throttled
          }),
          update: function () {
          }
        };

        // deprecated 'debounce' options should still be supported
        expect(config.strategy._config.throttle).toBe(throttled);

        spyOn(config, 'update');

        var vismon = visobj.monitor(config);

        expect(config.update.calls.count()).toBe(0);

        vismon.start();

        expect(vismon.state().visible).toBe(false);
        expect(config.update.calls.count()).toBe(1);

        element.style.display = 'block'; // set visible

        jasmine.clock().tick(throttled + 42);

        // must still be false, because no event has been fired yet
        expect(vismon.state().visible).toBe(false);
        expect(config.update.calls.count()).toBe(1);

        fireScrollEvent();

        expect(vismon.state().visible).toBe(false);
        expect(config.update.calls.count()).toBe(1);

        jasmine.clock().tick(1);

        expect(vismon.state().visible).toBe(true);
        expect(config.update.calls.count()).toBe(2);

        fireScrollEvent();

        jasmine.clock().tick(1);

        expect(vismon.state().visible).toBe(true);
        expect(config.update.calls.count()).toBe(2);

        jasmine.clock().tick(throttled);

        expect(vismon.state().visible).toBe(true);
        expect(config.update.calls.count()).toBe(3);

        vismon.stop();
      });
    });

    describe('CompositeStrategy', function () {
      var strategy, strategies;

      beforeEach(function () {
        strategies = [
          new VisSense.VisMon.Strategy.PollingStrategy(),
          new VisSense.VisMon.Strategy.EventStrategy(),
          new VisSense.VisMon.Strategy.CompositeStrategy()
        ];

        for (var i = 0, n = strategies.length; i < n; i++) {
          spyOn(strategies[i], 'init');
          spyOn(strategies[i], 'start');
          spyOn(strategies[i], 'stop');
        }

        strategy = new VisSense.VisMon.Strategy.CompositeStrategy(strategies);
      });

      it('should call all inner objects init() method', function () {
        strategy.init(monitorMock);

        for (var i = 0, n = strategies.length; i < n; i++) {
          expect(strategies[i].init.calls.count()).toEqual(1);
        }
      });

      it('should call all inner objects start() method', function () {
        strategy.start(monitorMock);

        for (var i = 0, n = strategies.length; i < n; i++) {
          expect(strategies[i].start.calls.count()).toEqual(1);
        }
      });

      it('should call all inner objects stop() method', function () {
        strategy.stop(monitorMock);

        for (var i = 0, n = strategies.length; i < n; i++) {
          expect(strategies[i].stop.calls.count()).toEqual(1);
        }
      });
    });

  });

  describe('VisMon', function () {
    var element, visobj;

    beforeEach(function () {
      jasmine.getFixtures().set('<div id="element" style="height: 100px; width: 100px; display: none;"></div>');
      element = $('#element')[0];
      visobj = new VisSense(element);
    });

    it('should create VisMon objects', function () {
      var vismon = visobj.monitor();

      expect(vismon).toBeDefined();

      var vismon2 = visobj.monitor({
        update: VisSense.Utils.noop,
        hidden: VisSense.Utils.noop,
        visible: VisSense.Utils.noop,
        fullyvisible: VisSense.Utils.noop,
        percentagechange: VisSense.Utils.noop,
        visibilitychange: VisSense.Utils.noop
      });

      expect(vismon2).toBeDefined();
    });

    it('should get the observed VisSense object', function () {
      var vismon = visobj.monitor();
      expect(vismon.visobj()).toBe(visobj);
    });

    it('should be able to start and stop a monitor with a smooth syntax', function () {
      var config = {
        update: function () {
        }
      };

      spyOn(config, 'update');

      var vismon = visobj.monitor(config);

      expect(vismon.start().stop()).toBe(undefined);

      expect(config.update.calls.count()).toEqual(1);

      jasmine.clock().tick(5);

      expect(config.update.calls.count()).toEqual(1);

      vismon.stop();
    });

    it('should be able to start a monitor asynchronously', function () {
      var config = {
        update: function () {
        }
      };

      spyOn(config, 'update');

      var vismon = visobj.monitor(config).start({async: true});

      expect(config.update.calls.count()).toEqual(0);

      jasmine.clock().tick(5);

      expect(config.update.calls.count()).toEqual(1);

      expect(vismon.stop()).toBe(undefined);
    });

    it('should be able to start and stop an async monitor before executing', function () {
      var config = {
        update: function () {
        }
      };

      spyOn(config, 'update');

      var vismon = visobj.monitor(config);

      expect(vismon.startAsync().stop()).toBe(undefined);

      jasmine.clock().tick(5);

      expect(config.update.calls.count()).toEqual(0);

      expect(vismon.startAsync().startAsync().stop()).toBe(undefined);

      jasmine.clock().tick(5);

      expect(config.update.calls.count()).toEqual(0);

    });

    it('should not fire start/stop events if already started/stopped', function () {
      var config = {
        start: function () {
        },
        stop: function () {
        }
      };

      spyOn(config, 'start');
      spyOn(config, 'stop');

      var vismon = visobj.monitor(config);

      expect(vismon.start()
          .start()
          .start()
          .start()
          .start()
          .stop()
      ).toBe(undefined);

      expect(vismon.stop()).toBe(undefined);
      expect(vismon.stop()).toBe(undefined);
      expect(vismon.stop()).toBe(undefined);
      expect(vismon.stop()).toBe(undefined);

      expect(config.start.calls.count()).toEqual(1);
      expect(config.stop.calls.count()).toEqual(1);

      jasmine.clock().tick(5);

      expect(config.start.calls.count()).toEqual(1);
      expect(config.stop.calls.count()).toEqual(1);

    });

    it('should update verify that first update() argument is a monitor', function () {
      var config = {
        update: function (monitor) {
          expect(monitor).toBe(vismon);
        }
      };

      spyOn(config, 'update');

      var vismon = visobj.monitor(config).start();

      expect(config.update.calls.count()).toEqual(1);

      vismon.stop();
    });

    it('should verify that default interval is 1000ms', function () {
      jasmine.getFixtures().set('<div id="element" style="display:none;"></div>');

      var config = {
        update: function () {
        },
        hidden: function () {
        },
        visible: function () {
        }
      };

      spyOn(config, 'update');
      spyOn(config, 'hidden');
      spyOn(config, 'visible');

      var vismon = VisSense.of($('#element')[0]).monitor(config).start();

      expect(config.update.calls.count()).toEqual(1);
      expect(config.hidden.calls.count()).toEqual(1);
      expect(config.visible.calls.count()).toEqual(0);

      jasmine.clock().tick(1001);
      vismon.stop();

      expect(config.update.calls.count()).toEqual(2);
      expect(config.hidden.calls.count()).toEqual(1);
      expect(config.visible.calls.count()).toEqual(0);
    });

    it('should verify that state instances are cached if nothing changes', function () {
      var vismon = visobj.monitor();

      expect(vismon.state()).toEqual({});

      vismon.start();

      var firstState = vismon.state();
      expect(firstState).toEqual({
        code: 0,
        state: 'hidden',
        percentage: 0,
        hidden: true,
        visible: false,
        fullyvisible: false,
        previous: {}
      });

      vismon.update();

      var cachedState = vismon.state();
      expect(cachedState.previous).toBeDefined();

      expect(cachedState).toEqual({
        code: 0,
        state: 'hidden',
        percentage: 0,
        hidden: true,
        visible: false,
        fullyvisible: false,
        previous: {
          code: 0,
          state: 'hidden',
          percentage: 0,
          hidden: true,
          visible: false,
          fullyvisible: false
        }
      });

      vismon.update();

      expect(vismon.state() === cachedState).toBe(true);

      vismon.stop();
    });

    it('start/stop without a strategy', function () {
      var config = {
        strategy: [],
        update: function () {
        }
      };

      spyOn(config, 'update');

      var vismon = visobj.monitor(config);

      expect(vismon.state()).toEqual({});
      expect(config.update.calls.count()).toEqual(0);

      vismon.start();

      var firstState = vismon.state();
      expect(firstState).toBeDefined();
      expect(firstState.previous).toEqual({});
      expect(config.update.calls.count()).toEqual(1);

      vismon.update();

      var secondState = vismon.state();
      expect(secondState).toBeDefined();
      expect(secondState.hidden).toBeDefined();
      expect(secondState.previous).not.toEqual({});
      expect(config.update.calls.count()).toEqual(2);

      vismon.stop();

      expect(config.update.calls.count()).toEqual(2);
    });

    it('should return unregister function when registering a listener', function () {
      var vismon = visobj.monitor();

      var unregister = vismon.on('some-event', VisSense.Utils.noop);

      expect(unregister).toBeDefined();
      expect(unregister()).toBe(true);
    });


    describe('Builder', function () {
      it('should build a VisMon object', function () {
        var vismon = null;

        VisSense.VisMon.Builder(visobj)
          .set('async', false)
          .strategy(new VisSense.VisMon.Strategy.PollingStrategy({interval: 1000}))
          .strategy(new VisSense.VisMon.Strategy.EventStrategy({debounce: 30}))
          .on('percentagechange', function (monitor, newValue) {
            console.log(newValue + '%');
          })
          .build(function (monitorByBuilder) {
            vismon = monitorByBuilder;
          });

        expect(vismon).toBeDefined();
      });

      it('should build a VisMon object without strategies', function () {
        var vismon = VisSense.VisMon.Builder(visobj)
          .set('strategy', false)
          .build();

        expect(vismon).toBeDefined();
      });
    });

    describe('Events', function () {

      beforeEach(function () {
        jasmine.getFixtures().set(
          '<div id="element" style="position: absolute; height: 10px; width: 10px; display: none;"></div>'
        );
        element = $('#element')[0];
        visobj = new VisSense(element);
      });

      it('should be possible to unregister a listener when it is fired', function () {
        var config = {
          strategy: [],
          update: function () {
          }
        };
        spyOn(config, 'update').and.callThrough();

        var cancelOnVisibleEvent = VisSense.Utils.noop;

        var observer = {
          onVisible: function () {
            cancelOnVisibleEvent();
          }
        };
        spyOn(observer, 'onVisible').and.callThrough();


        var monitor = visobj.monitor(config);

        cancelOnVisibleEvent = monitor.on('visible', observer.onVisible);

        monitor.start();

        expect(config.update.calls.count()).toEqual(1);
        expect(observer.onVisible.calls.count()).toEqual(0);

        element.style.display = 'block'; // set visible

        monitor.update();

        expect(config.update.calls.count()).toEqual(2);
        expect(observer.onVisible.calls.count()).toEqual(1); // <- unregistered here

        element.style.display = 'none'; // set hidden

        monitor.update();

        expect(config.update.calls.count()).toEqual(3);
        expect(observer.onVisible.calls.count()).toEqual(1);

        element.style.display = 'block'; // set visible again

        monitor.update();

        expect(config.update.calls.count()).toEqual(4);
        expect(observer.onVisible.calls.count()).toEqual(1);

        monitor.stop();
      });

      it('should verify that fullyvisible is fired after visible', function () {
        var model = {state: '?'};
        var config = {
          strategy: [],
          visible: function () {
            model.state = 'visible';
          },
          fullyvisible: function () {
            model.state = 'fullyvisible';
          },
          hidden: function () {
            model.state = 'hidden';
          },
          update: function () {
          }
        };

        spyOn(config, 'visible').and.callThrough();
        spyOn(config, 'fullyvisible').and.callThrough();
        spyOn(config, 'update').and.callThrough();
        spyOn(config, 'hidden').and.callThrough();

        var vismon = visobj.monitor(config).start();

        expect(config.update.calls.count()).toEqual(1);
        expect(config.hidden.calls.count()).toEqual(1);
        expect(config.visible.calls.count()).toEqual(0);
        expect(config.fullyvisible.calls.count()).toEqual(0);

        expect(model.state).toEqual('hidden');

        element.style.display = 'block'; // set visible

        vismon.update();

        expect(config.update.calls.count()).toEqual(2);
        expect(config.hidden.calls.count()).toEqual(1);
        expect(config.visible.calls.count()).toEqual(1);
        expect(config.fullyvisible.calls.count()).toEqual(1);

        expect(model.state).toEqual('fullyvisible');

        vismon.stop();
      });


      it('should verify that provided listeners can stop the monitor immediately', function () {
        element.style.display = 'block'; // set visible

        var config = {
          visible: function (monitor) {
            monitor.stop();
          },
          start: function () {
          },
          stop: function () {
          }
        };

        spyOn(config, 'start').and.callThrough();
        spyOn(config, 'visible').and.callThrough();
        spyOn(config, 'stop').and.callThrough();

        var vismon = visobj.monitor(config).start();

        expect(vismon._started).toEqual(false);
        expect(config.visible.calls.count()).toEqual(1);
        expect(config.start.calls.count()).toEqual(1);
        expect(config.stop.calls.count()).toEqual(1);

        jasmine.clock().tick(10000);

        element.style.display = 'none'; // set hidden

        jasmine.clock().tick(10000);

        element.style.display = 'block'; // set hidden

        jasmine.clock().tick(10000);

        expect(vismon._started).toEqual(false);
        expect(config.visible.calls.count()).toEqual(1);
        expect(config.start.calls.count()).toEqual(1);
        expect(config.stop.calls.count()).toEqual(1);
      });

      it('should verify event chain initially hidden -> visible -> fullyvisible -> visible -> hidden', function () {
        var model = {state: '?'};
        var config = {
          start: function () {
          },
          stop: function () {
          },
          update: function () {
          },
          visible: function () {
          },
          fullyvisible: function () {
          },
          hidden: function () {
          },
          visibilitychange: function (monitor) {
            model.state = monitor.state().state;
          },
          percentagechange: function () {
          }
        };

        spyOn(config, 'start').and.callThrough();
        spyOn(config, 'stop').and.callThrough();
        spyOn(config, 'update').and.callThrough();
        spyOn(config, 'hidden').and.callThrough();
        spyOn(config, 'visible').and.callThrough();
        spyOn(config, 'fullyvisible').and.callThrough();
        spyOn(config, 'visibilitychange').and.callThrough();
        spyOn(config, 'percentagechange').and.callThrough();

        var vismon = visobj.monitor({
          strategy: new VisSense.VisMon.Strategy.PollingStrategy({interval: 100})
        });

        vismon.on('start', config.start);
        vismon.on('stop', config.stop);
        vismon.on('update', config.update);
        vismon.on('hidden', config.hidden);
        vismon.on('visible', config.visible);
        vismon.on('fullyvisible', config.fullyvisible);
        vismon.on('visibilitychange', config.visibilitychange);
        vismon.on('percentagechange', config.percentagechange);

        expect(config.start.calls.count()).toEqual(0);
        expect(config.stop.calls.count()).toEqual(0);
        expect(config.update.calls.count()).toEqual(0);
        expect(config.hidden.calls.count()).toEqual(0);
        expect(config.visible.calls.count()).toEqual(0);
        expect(config.fullyvisible.calls.count()).toEqual(0);
        expect(config.visibilitychange.calls.count()).toEqual(0);
        expect(config.percentagechange.calls.count()).toEqual(0);

        expect(model.state).toEqual('?');

        vismon.start();

        expect(config.start.calls.count()).toEqual(1);
        expect(config.stop.calls.count()).toEqual(0);
        expect(config.update.calls.count()).toEqual(1);
        expect(config.hidden.calls.count()).toEqual(1);
        expect(config.visible.calls.count()).toEqual(0);
        expect(config.fullyvisible.calls.count()).toEqual(0);
        expect(config.visibilitychange.calls.count()).toEqual(1);
        expect(config.percentagechange.calls.count()).toEqual(1);

        expect(model.state).toEqual('hidden');

        jasmine.clock().tick(100);

        expect(config.start.calls.count()).toEqual(1);
        expect(config.stop.calls.count()).toEqual(0);
        expect(config.update.calls.count()).toEqual(2);
        expect(config.hidden.calls.count()).toEqual(1);
        expect(config.visible.calls.count()).toEqual(0);
        expect(config.fullyvisible.calls.count()).toEqual(0);
        expect(config.visibilitychange.calls.count()).toEqual(1);
        expect(config.percentagechange.calls.count()).toEqual(1);

        expect(model.state).toEqual('hidden');

        jasmine.clock().tick(100);

        expect(config.start.calls.count()).toEqual(1);
        expect(config.stop.calls.count()).toEqual(0);
        expect(config.update.calls.count()).toEqual(3);
        expect(config.hidden.calls.count()).toEqual(1);
        expect(config.visible.calls.count()).toEqual(0);
        expect(config.fullyvisible.calls.count()).toEqual(0);
        expect(config.visibilitychange.calls.count()).toEqual(1);
        expect(config.percentagechange.calls.count()).toEqual(1);

        expect(model.state).toEqual('hidden');

        element.style.display = 'block'; // set visible

        jasmine.clock().tick(100);

        expect(config.start.calls.count()).toEqual(1);
        expect(config.stop.calls.count()).toEqual(0);
        expect(config.update.calls.count()).toEqual(4);
        expect(config.hidden.calls.count()).toEqual(1);
        expect(config.visible.calls.count()).toEqual(1);
        expect(config.fullyvisible.calls.count()).toEqual(1);
        expect(config.visibilitychange.calls.count()).toEqual(2);
        expect(config.percentagechange.calls.count()).toEqual(2);

        expect(model.state).toEqual('fullyvisible');

        element.style.left = '-5px'; // 50% visible

        jasmine.clock().tick(100);

        expect(config.start.calls.count()).toEqual(1);
        expect(config.stop.calls.count()).toEqual(0);
        expect(config.update.calls.count()).toEqual(5);
        expect(config.hidden.calls.count()).toEqual(1);
        expect(config.visible.calls.count()).toEqual(1);
        expect(config.fullyvisible.calls.count()).toEqual(1);
        expect(config.visibilitychange.calls.count()).toEqual(3);
        expect(config.percentagechange.calls.count()).toEqual(3);

        expect(model.state).toEqual('visible');

        element.style.left = '-9px'; // 10% visible

        jasmine.clock().tick(100);

        expect(config.start.calls.count()).toEqual(1);
        expect(config.stop.calls.count()).toEqual(0);
        expect(config.update.calls.count()).toEqual(6);
        expect(config.hidden.calls.count()).toEqual(1);
        expect(config.visible.calls.count()).toEqual(1);
        expect(config.fullyvisible.calls.count()).toEqual(1);
        expect(config.visibilitychange.calls.count()).toEqual(3);
        expect(config.percentagechange.calls.count()).toEqual(4);

        expect(model.state).toEqual('visible');

        element.style.left = '-10px'; // 0% visible

        jasmine.clock().tick(100);

        expect(config.start.calls.count()).toEqual(1);
        expect(config.stop.calls.count()).toEqual(0);
        expect(config.update.calls.count()).toEqual(7);
        expect(config.hidden.calls.count()).toEqual(2);
        expect(config.visible.calls.count()).toEqual(1);
        expect(config.fullyvisible.calls.count()).toEqual(1);
        expect(config.visibilitychange.calls.count()).toEqual(4);
        expect(config.percentagechange.calls.count()).toEqual(5);

        expect(model.state).toEqual('hidden');

        vismon.stop();

        expect(config.start.calls.count()).toEqual(1);
        expect(config.stop.calls.count()).toEqual(1);

      });


      it('should be possible to publish custom events', function () {
        var consumer = {
          onEvent: function () {
          }
        };

        spyOn(consumer, 'onEvent').and.callThrough();

        var config = {
          strategy: []
        };

        var monitor = visobj.monitor(config);

        monitor.on('myEvent', consumer.onEvent);

        expect(consumer.onEvent.calls.count()).toEqual(0);

        monitor.publish('myEvent', []);

        expect(consumer.onEvent.calls.count()).toEqual(1);

        monitor.stop();
      });

      it('should throw an error if an internal event is published', function () {
        var consumer = {
          onInternalEvent: function () {
          }
        };

        spyOn(consumer, 'onInternalEvent').and.callThrough();

        var monitor = visobj.monitor({
          strategy: []
        });

        monitor.on('visible', consumer.onInternalEvent);

        expect(consumer.onInternalEvent.calls.count()).toEqual(0);

        var expectedError = new Error('Cannot publish internal event "visible" from external scope.');
        expect(function () {
          monitor.publish('visible', []);
        }).toThrow(expectedError);

        expect(consumer.onInternalEvent.calls.count()).toEqual(0);
      });

      it('should be able to publish events asynchronously', function () {
        var consumer = {
          onEvent: function () {
          }
        };

        spyOn(consumer, 'onEvent').and.callThrough();

        var monitor = new VisSense(element).monitor({
          strategy: [],
          async: true
        });

        monitor.on('myEvent', consumer.onEvent);

        expect(consumer.onEvent.calls.count()).toEqual(0);

        monitor.publish('myEvent', []);

        expect(consumer.onEvent.calls.count()).toEqual(0);

        jasmine.clock().tick(1);

        expect(consumer.onEvent.calls.count()).toEqual(1);

      });

      it('should be able to cancel asynchronously published events', function () {
        var consumer = {
          onEvent: function () {
          }
        };

        spyOn(consumer, 'onEvent').and.callThrough();

        var monitor = new VisSense(element).monitor({
          strategy: [],
          async: true
        });

        monitor.on('myEvent', consumer.onEvent);

        expect(consumer.onEvent.calls.count()).toEqual(0);

        var cancel = monitor.publish('myEvent', []);

        expect(consumer.onEvent.calls.count()).toEqual(0);

        cancel();

        jasmine.clock().tick(1000);

        expect(consumer.onEvent.calls.count()).toEqual(0);

      });
    });
  });

});
