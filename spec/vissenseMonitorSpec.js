/*global VisSense,$,jasmine,describe,it,expect,beforeEach,afterEach,spyOn*/
/**
 * @license
 * Vissense <http://vissense.com/>
 * Copyright 2014 tbk <theborakompanioni+vissense@gmail.com>
 * Available under MIT license <http://opensource.org/licenses/MIT>
 */
describe('VisSense Monitor', function () {
  'use strict';

  it('should verify that jasmine mocks the Date object', function () {
      expect(jasmine.clock().mockDate).toBeDefined();
  });

  describe('VisState', function () {

    it('should create all 3 VisState objects', function () {
      expect(VisSense.VisState.hidden(0)).toBeDefined();
      expect(VisSense.VisState.visible(0.1)).toBeDefined();
      expect(VisSense.VisState.fullyvisible(1)).toBeDefined();
    });

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
      monitorMock = {update: VisSense.Utils.noop};
    });

    describe('Strategy', function () {
      var strategy;

      beforeEach(function () {
        strategy = new VisSense.VisMon.Strategy();
      });

      it('should throw error on start', function () {
        expect(function () {
          strategy.start(monitorMock);
        }).toThrow();
      });

      it('should throw error on stop', function () {
        expect(function () {
          strategy.stop(monitorMock);
        }).toThrow();
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

        jasmine.clock().install();

        jasmine.clock().mockDate();
      });

      afterEach(function () {
        jasmine.clock().uninstall();
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

      it('should verify proper event handling', function () {
        var debounceInMilliseconds = 10;

        var vismon = visobj.monitor({
          strategy: new VisSense.VisMon.Strategy.EventStrategy({
            debounce: debounceInMilliseconds
          })
        }).start();

        expect(vismon.state().visible).toBe(false);

        element.style.display = 'block'; // set visible

        jasmine.clock().tick(42);

        // must still be false, because no event has been fired yet
        expect(vismon.state().visible).toBe(false);

        fireScrollEvent();

        jasmine.clock().tick(1);

        expect(vismon.state().visible).toBe(false);

        jasmine.clock().tick(debounceInMilliseconds);

        expect(vismon.state().visible).toBe(true);

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
          spyOn(strategies[i], 'start');
          spyOn(strategies[i], 'stop');
        }

        strategy = new VisSense.VisMon.Strategy.CompositeStrategy(strategies);
      });

      it('should call all inner objects start() method', function () {
        expect(strategy.start(monitorMock)).toBe(undefined);

        for (var i = 0, n = strategies.length; i < n; i++) {
          expect(strategies[i].start.calls.count()).toEqual(1);
        }
      });

      it('should call all inner objects stop() method', function () {
        expect(strategy.stop(monitorMock)).toBe(undefined);

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

      jasmine.clock().install();

      jasmine.clock().mockDate();
    });

    afterEach(function () {
      jasmine.clock().uninstall();
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
      var vismon = visobj.monitor();
      vismon.start().stop();
      expect(vismon.start().stop()).toBe(undefined);
    });


    it('should be able to start a monitor asynchronously', function () {
      var config = {
        update: function (monitor) {
          expect(monitor).toBe(vismon);
        }
      };

      spyOn(config, 'update');

      var vismon = visobj.monitor(config).start({async: true});

      expect(config.update.calls.count()).toEqual(0);

      jasmine.clock().tick(5);

      expect(config.update.calls.count()).toEqual(1);

      expect(vismon.stop()).toBe(undefined);
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
        update : function() {},
        hidden : function() {},
        visible : function() {}
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

      vismon.use(new VisSense.VisMon.Strategy.EventStrategy());

      expect(config.update.calls.count()).toEqual(3);

      vismon.use(new VisSense.VisMon.Strategy.PollingStrategy());

      expect(config.update.calls.count()).toEqual(4);

      vismon.stop();
    });

    it('should return unregister function when registering a listener', function () {
      var vismon = visobj.monitor();

      var unregister = vismon.on('some-event', VisSense.Utils.noop);

      expect(unregister).toBeDefined();
      expect(unregister()).toBe(true);
    });

    describe('Events', function () {

      beforeEach(function () {
        jasmine.getFixtures().set(
          '<div id="element" style="position: absolute; height: 10px; width: 10px; display: none;"></div>'
        );
        element = $('#element')[0];
        visobj = new VisSense(element);

        jasmine.clock().install();

        jasmine.clock().mockDate();
      });

      afterEach(function () {
        jasmine.clock().uninstall();
      });

      it('should verify event chain initially hidden -> fullyvisible -> visible -> visible -> hidden', function () {
        var config = {
          strategy: new VisSense.VisMon.Strategy.PollingStrategy({interval: 100}),
          update: function () {
          },
          visible: function () {
          },
          fullyvisible: function () {
          },
          hidden: function () {
          },
          visibilitychange: function () {
          },
          percentagechange: function () {
          }
        };

        spyOn(config, 'update');
        spyOn(config, 'hidden');
        spyOn(config, 'visible');
        spyOn(config, 'fullyvisible');
        spyOn(config, 'visibilitychange');
        spyOn(config, 'percentagechange');

        var vismon = visobj.monitor(config);

        expect(config.update.calls.count()).toEqual(0);
        expect(config.hidden.calls.count()).toEqual(0);
        expect(config.visible.calls.count()).toEqual(0);
        expect(config.fullyvisible.calls.count()).toEqual(0);
        expect(config.visibilitychange.calls.count()).toEqual(0);
        expect(config.percentagechange.calls.count()).toEqual(0);

        vismon.start();

        expect(config.update.calls.count()).toEqual(1);
        expect(config.hidden.calls.count()).toEqual(1);
        expect(config.visible.calls.count()).toEqual(0);
        expect(config.fullyvisible.calls.count()).toEqual(0);
        expect(config.visibilitychange.calls.count()).toEqual(1);
        expect(config.percentagechange.calls.count()).toEqual(1);

        jasmine.clock().tick(150);

        expect(config.update.calls.count()).toEqual(2);
        expect(config.hidden.calls.count()).toEqual(1);
        expect(config.visible.calls.count()).toEqual(0);
        expect(config.fullyvisible.calls.count()).toEqual(0);
        expect(config.visibilitychange.calls.count()).toEqual(1);
        expect(config.percentagechange.calls.count()).toEqual(1);

        jasmine.clock().tick(100);

        expect(config.update.calls.count()).toEqual(3);
        expect(config.hidden.calls.count()).toEqual(1);
        expect(config.visible.calls.count()).toEqual(0);
        expect(config.fullyvisible.calls.count()).toEqual(0);
        expect(config.visibilitychange.calls.count()).toEqual(1);
        expect(config.percentagechange.calls.count()).toEqual(1);

        element.style.display = 'block'; // set visible

        jasmine.clock().tick(100);

        expect(config.update.calls.count()).toEqual(4);
        expect(config.hidden.calls.count()).toEqual(1);
        expect(config.visible.calls.count()).toEqual(1);
        expect(config.fullyvisible.calls.count()).toEqual(1);
        expect(config.visibilitychange.calls.count()).toEqual(2);
        expect(config.percentagechange.calls.count()).toEqual(2);

        element.style.left = '-5px'; // 50% visible

        jasmine.clock().tick(100);

        expect(config.update.calls.count()).toEqual(5);
        expect(config.hidden.calls.count()).toEqual(1);
        expect(config.visible.calls.count()).toEqual(1);
        expect(config.fullyvisible.calls.count()).toEqual(1);
        expect(config.visibilitychange.calls.count()).toEqual(3);
        expect(config.percentagechange.calls.count()).toEqual(3);

        element.style.left = '-9px'; // 10% visible

        jasmine.clock().tick(100);

        expect(config.update.calls.count()).toEqual(6);
        expect(config.hidden.calls.count()).toEqual(1);
        expect(config.visible.calls.count()).toEqual(1);
        expect(config.fullyvisible.calls.count()).toEqual(1);
        expect(config.visibilitychange.calls.count()).toEqual(3);
        expect(config.percentagechange.calls.count()).toEqual(4);

        element.style.left = '-10px'; // 0% visible

        jasmine.clock().tick(100);

        expect(config.update.calls.count()).toEqual(7);
        expect(config.hidden.calls.count()).toEqual(2);
        expect(config.visible.calls.count()).toEqual(1);
        expect(config.fullyvisible.calls.count()).toEqual(1);
        expect(config.visibilitychange.calls.count()).toEqual(4);
        expect(config.percentagechange.calls.count()).toEqual(5);

        vismon.stop();

      });
    });
  });

});
