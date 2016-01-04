/*global VisSense,$,jasmine,describe,it,beforeEach,afterEach,spyOn,expect,_*/

describe('VisSense.Utils', function () {
  'use strict';

  beforeEach(function () {
    jasmine.clock().install();
  });

  afterEach(function () {
    jasmine.clock().uninstall();
  });

  it('should verify that identity() returns the object passed', function () {
    var a = {};
    expect(VisSense.Utils.identity(a)).toBe(a);
  });

  it('should verify that now() returns a timestamp', function () {
    expect(VisSense.Utils.now()).toBeGreaterThan(0);
  });

  describe('_', function () {

    it('should verify that noop() returns undefined', function () {
      expect(VisSense.Utils.noop()).not.toBeDefined();
    });

    it('should verify that identity() returns the first object passed', function () {
      var a = {};
      expect(VisSense.Utils.identity(a, [], null, undefined)).toBe(a);
    });

    describe('once', function () {
      it('should verify that a callback is only invoked once', function () {
        var config = {
          callback: function () {
          }
        };

        spyOn(config, 'callback');

        var oncedCallback = VisSense.Utils.once(config.callback);

        expect(config.callback.calls.count()).toEqual(0);

        oncedCallback();

        expect(config.callback.calls.count()).toEqual(1);

        oncedCallback();

        expect(config.callback.calls.count()).toEqual(1);

        oncedCallback();

        expect(config.callback.calls.count()).toEqual(1);

      });
    });

    describe('fireIf', function () {
      var func;
      beforeEach(function () {
        func = {
          returnTrue: function () {
            return true;
          },
          returnFalse: function () {
            return false;
          }
        };

        spyOn(func, 'returnTrue').and.callThrough();
      });

      it('should fire if expression is function returning true', function () {
        expect(VisSense.Utils.fireIf(true, func.returnTrue)()).toBe(true);
        expect(VisSense.Utils.fireIf(function () {
          return true;
        }, func.returnTrue)()).toBe(true);
        expect(func.returnTrue.calls.count()).toEqual(2);
      });

      it('should NOT fire if expression is false', function () {
        expect(VisSense.Utils.fireIf(false, func.returnTrue)()).not.toBeDefined();
        expect(VisSense.Utils.fireIf(func.returnFalse, func.returnTrue)()).not.toBeDefined();

        expect(func.returnTrue.calls.count()).toEqual(0);
      });
    });

    describe('debounce', function () {
      var callback;

      beforeEach(function () {
        callback = jasmine.createSpy('callback');
      });

      it('should debounce a function', function () {
        var debouncedFunction = VisSense.Utils.debounce(function () {
          callback();
        }, 1000);

        debouncedFunction();
        debouncedFunction();

        jasmine.clock().tick(300);

        debouncedFunction();
        debouncedFunction();
        debouncedFunction();
        debouncedFunction();

        jasmine.clock().tick(900);

        expect(callback).not.toHaveBeenCalled();

        debouncedFunction();
        debouncedFunction();

        jasmine.clock().tick(1001);

        expect(callback.calls.count()).toEqual(1);

        debouncedFunction();
        debouncedFunction();

        jasmine.clock().tick(1001);

        expect(callback.calls.count()).toEqual(2);

      });
    });

    describe('throttle', function () {
      var callback;

      beforeEach(function () {
        callback = jasmine.createSpy('callback');
      });

      it('should throttle a function', function () {
        var throttleFunction = VisSense.Utils.throttle(function () {
          callback();
        }, 1000);

        throttleFunction();
        throttleFunction();

        jasmine.clock().tick(1);

        expect(callback.calls.count()).toEqual(1);

        jasmine.clock().tick(300);

        throttleFunction();
        throttleFunction();

        jasmine.clock().tick(300);

        throttleFunction();
        throttleFunction();

        jasmine.clock().tick(1);

        expect(callback.calls.count()).toEqual(1);

        jasmine.clock().tick(1001);

        expect(callback.calls.count()).toEqual(2);

        throttleFunction();
        throttleFunction();

        jasmine.clock().tick(1);

        expect(callback.calls.count()).toEqual(2);

        jasmine.clock().tick(1001);

        expect(callback.calls.count()).toEqual(3);

      });
    });

    describe('defer', function () {
      var callback;

      beforeEach(function () {
        callback = jasmine.createSpy('callback');
      });

      it('should defer function', function () {
        VisSense.Utils.defer(function () {
          callback();
        });

        expect(callback).not.toHaveBeenCalled();

        jasmine.clock().tick(10);

        expect(callback).toHaveBeenCalled();
      });

      it('should defer function with a delay', function () {
        VisSense.Utils.defer(function () {
          callback();
        }, 100);

        jasmine.clock().tick(90);

        expect(callback).not.toHaveBeenCalled();

        jasmine.clock().tick(11);

        expect(callback).toHaveBeenCalled();
      });

      it('should cancel executing a deferred function', function () {
        var cancel = VisSense.Utils.defer(function () {
          callback();
        }, 100);

        jasmine.clock().tick(90);

        expect(callback).not.toHaveBeenCalled();

        cancel();

        jasmine.clock().tick(90001);

        expect(callback).not.toHaveBeenCalled();

      });
    });

    describe('async', function () {
      var callback;

      beforeEach(function () {
        callback = jasmine.createSpy('callback');
      });

      it('should create an async proxy function', function () {
        var callbackAsync = VisSense.Utils.async(callback);

        callbackAsync();

        expect(callback).not.toHaveBeenCalled();

        jasmine.clock().tick(10);

        expect(callback.calls.count()).toEqual(1);
      });

      it('should pass through the arguments supplied', function () {
        var callbackAsync = VisSense.Utils.async(callback);

        callbackAsync('foo', 'bar');

        expect(callback).not.toHaveBeenCalled();

        jasmine.clock().tick(10);

        expect(callback).toHaveBeenCalledWith('foo', 'bar');
      });

      it('should be able to specify the delay time', function () {
        var callbackAsync = VisSense.Utils.async(callback, 42);

        callbackAsync();

        expect(callback).not.toHaveBeenCalled();

        jasmine.clock().tick(10);

        expect(callback).not.toHaveBeenCalled();

        jasmine.clock().tick(100);

        expect(callback.calls.count()).toEqual(1);
      });


      it('should be able to cancel a triggered async function', function () {
        var callbackAsync = VisSense.Utils.async(callback, 42);

        var cancel = callbackAsync();

        jasmine.clock().tick(10);

        cancel();

        jasmine.clock().tick(100);

        expect(callback).not.toHaveBeenCalled();
      });
    });

    describe('isArray', function () {
      it('should detect [] as array', function () {
        expect(VisSense.Utils.isArray([])).toBe(true);
        expect(VisSense.Utils.isArray(new Array(3))).toBe(true);
      });

      it('should NOT detect null/undefined/number/string/etc. as array', function () {
        expect(VisSense.Utils.isArray({})).toBe(false);
        expect(VisSense.Utils.isArray(function () {
        })).toBe(false);
        expect(VisSense.Utils.isArray(null)).toBe(false);
        expect(VisSense.Utils.isArray(true)).toBe(false);
        expect(VisSense.Utils.isArray(undefined)).toBe(false);
        expect(VisSense.Utils.isArray(0 / 0)).toBe(false);
        expect(VisSense.Utils.isArray(13)).toBe(false);
        expect(VisSense.Utils.isArray('string')).toBe(false);
        expect((function () {
          return VisSense.Utils.isArray(arguments);
        })()).toBe(false);
      });
    });

    describe('isDefined', function () {
      it('should NOT detect a undefined as defined', function () {
        expect(VisSense.Utils.isDefined()).toBe(false);
        expect(VisSense.Utils.isDefined(undefined)).toBe(false);
      });

      it('should detect {}/null/number/string/etc. as defined', function () {
        expect(VisSense.Utils.isDefined(VisSense.Utils.isDefined)).toBe(true);
        expect(VisSense.Utils.isDefined({})).toBe(true);
        expect(VisSense.Utils.isDefined(null)).toBe(true);
        expect(VisSense.Utils.isDefined(true)).toBe(true);
        expect(VisSense.Utils.isDefined(0 / 0)).toBe(true);
        expect(VisSense.Utils.isDefined(13)).toBe(true);
        expect(VisSense.Utils.isDefined('string')).toBe(true);
      });
    });

    describe('isFunction', function () {
      it('should detect `isFunction` as function', function () {
        expect(VisSense.Utils.isFunction(VisSense.Utils.isFunction)).toBe(true);
      });

      it('should NOT detect {}/[]/null/undefined/number/string/etc. as function', function () {
        expect(VisSense.Utils.isFunction({})).toBe(false);
        expect(VisSense.Utils.isFunction([])).toBe(false);
        expect(VisSense.Utils.isFunction(null)).toBe(false);
        expect(VisSense.Utils.isFunction(undefined)).toBe(false);
        expect(VisSense.Utils.isFunction(true)).toBe(false);
        expect(VisSense.Utils.isFunction(0 / 0)).toBe(false);
        expect(VisSense.Utils.isFunction(13)).toBe(false);
        expect(VisSense.Utils.isFunction('string')).toBe(false);
      });
    });

    describe('isElement', function () {
      it('should detect a DOM element as element', function () {
        jasmine.getFixtures().set('<div id="element"></div>');

        expect(VisSense.Utils.isElement($('#element')[0])).toBe(true);
      });

      it('should NOT detect {}/[]/null/undefined/number/string/etc. as element', function () {
        expect(VisSense.Utils.isElement({})).toBe(false);
        expect(VisSense.Utils.isElement([])).toBe(false);
        expect(VisSense.Utils.isElement(function () {
        })).toBe(false);
        expect(VisSense.Utils.isElement(null)).toBe(false);
        expect(VisSense.Utils.isElement(undefined)).toBe(false);
        expect(VisSense.Utils.isElement(true)).toBe(false);
        expect(VisSense.Utils.isElement(0 / 0)).toBe(false);
        expect(VisSense.Utils.isElement(13)).toBe(false);
        expect(VisSense.Utils.isElement('string')).toBe(false);
      });
    });

    describe('isObject', function () {
      it('should detect {} as object', function () {
        expect(VisSense.Utils.isObject({})).toBe(true);
      });

      it('should detect [] as object', function () {
        expect(VisSense.Utils.isObject([])).toBe(true);
      });

      it('should detect a function as object', function () {
        expect(VisSense.Utils.isObject(VisSense.Utils.isObject)).toBe(true);
      });

      it('should NOT detect null/undefined/number/string/etc. as object', function () {
        expect(VisSense.Utils.isObject(null)).toBe(false);
        expect(VisSense.Utils.isObject(undefined)).toBe(false);
        expect(VisSense.Utils.isObject(true)).toBe(false);
        expect(VisSense.Utils.isObject(0 / 0)).toBe(false);
        expect(VisSense.Utils.isObject(13)).toBe(false);
        expect(VisSense.Utils.isObject('string')).toBe(false);
      });
    });

    describe('extend', function () {
      it('should throw errors on non-objects', function () {
        expect(function () {
          VisSense.Utils.extend(null);
        }).toThrow();
        expect(function () {
          VisSense.Utils.extend(undefined);
        }).toThrow();
        expect(function () {
          VisSense.Utils.extend(0 / 0);
        }).toThrow();
        expect(function () {
          VisSense.Utils.extend(13);
        }).toThrow();
        expect(function () {
          VisSense.Utils.extend('string');
        }).toThrow();
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

        expect(VisSense.Utils.extend(dest, source)).toEqual({
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

        expect(VisSense.Utils.extend(dest, source)).toEqual([
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

        var callback = function (destVal, sourceVal, key) {
          if (sneakIn[key] !== undefined) {
            return sneakIn[key];
          }
          return sourceVal;
        };

        expect(VisSense.Utils.extend(dest, source, callback)).toEqual({
          'aEnabled': 42,
          'bEnabled': {},
          'cEnabled': true
        });
      });
    });

    describe('defaults', function () {

      it('should return a default object when neither source nor destination is given', function () {
        expect(VisSense.Utils.defaults(undefined, undefined)).toEqual(undefined);
      });

      it('should return the destination object when no source is given', function () {
        var destination = {theAnswerToLifeTheUniverseAndEverything: 42};
        expect(VisSense.Utils.defaults(destination, undefined)).toBe(destination);
      });

      it('should return the source object when no destination object is given', function () {
        var defaultAttributes = {foo: 'bar'};
        expect(VisSense.Utils.defaults(undefined, defaultAttributes)).toBe(defaultAttributes);
      });

      it('should immediately return the source object on non-object destination values', function () {
        expect(VisSense.Utils.defaults(true, null)).toEqual(null);
        expect(VisSense.Utils.defaults(null, false)).toEqual(false);
        expect(VisSense.Utils.defaults(undefined, 42)).toEqual(42);
        expect(VisSense.Utils.defaults(42, undefined)).toEqual(undefined);
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

        expect(VisSense.Utils.defaults(dest, defaults)).toEqual({
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

        expect(VisSense.Utils.defaults(dest, defaults)).toEqual([
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

  describe('viewport', function () {

    it('should verify defined values from viewport()', function () {
      var viewport = VisSense.Utils._viewport();

      expect(viewport.height).toBeDefined();
      expect(viewport.width).toBeDefined();
    });

  });

  describe('isPageVisible', function () {

    it('should verify existence of isPageVisible function', function () {
      var pageVisible = VisSense.Utils.isPageVisible();

      expect(pageVisible).toBe(true);
    });

  });

  describe('elements visibility', function () {
    var _findEffectiveStyleProperty = function (element, property) {
      var style = VisSense.Utils._computedStyle(element);
      return VisSense.Utils._styleProperty(style, property);
    };

    describe('effective style', function () {

      it('should get style property of simple element', function () {
        jasmine.getFixtures().set('<div id="element"></div>');

        var border = _findEffectiveStyleProperty($('#element')[0], 'border');
        expect(border).toBeDefined();
      });

      it('should find inherit "visibility" property of simple element', function () {
        jasmine.getFixtures().set('<div id="element" style="visibility: hidden">' +
        '<div></div>' +
        '<div style="visibility: inherit"></div>' +
        '<div style="visibility: visible"></div>' +
        '<div style="visibility: collapse"></div>' +
        '</div>');

        var parentStyle = _findEffectiveStyleProperty($('#element')[0], 'visibility');
        var children = $('#element').children();

        var style0 = _findEffectiveStyleProperty(children[0], 'visibility');
        var style1 = _findEffectiveStyleProperty(children[1], 'visibility');
        var style2 = _findEffectiveStyleProperty(children[2], 'visibility');
        var style3 = _findEffectiveStyleProperty(children[3], 'visibility');

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

        var parentStyle = _findEffectiveStyleProperty($('#element')[0], 'display');

        var children = $('#element').children();
        var style0 = _findEffectiveStyleProperty(children[0], 'display');
        var style1 = _findEffectiveStyleProperty(children[1], 'display');
        var style2 = _findEffectiveStyleProperty(children[2], 'display');

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

        expect(VisSense.Utils._isDisplayed($('#element')[0])).toBe(false);
        expect(VisSense.Utils.isVisibleByStyling($('#element')[0])).toBe(false);

        _.forEach($('#element').children(), function (child) {
          expect(VisSense.Utils._isDisplayed(child)).toBe(false);
          expect(VisSense.Utils.isVisibleByStyling(child)).toBe(false);
        });

      });


      it('should detect children in container with style "display:block" to be visible', function () {
        jasmine.getFixtures().set('<div id="element" style="display: block">' +
        '<div style="display: inherit"></div>' +
        '<div style="display: inline-block"></div>' +
        '<div style="display: none"></div>' +
        '</div>');

        var children = $('#element').children();

        expect(VisSense.Utils._isDisplayed($('#element')[0])).toBe(true);
        expect(VisSense.Utils._isDisplayed(children[0])).toBe(true);
        expect(VisSense.Utils._isDisplayed(children[1])).toBe(true);
        expect(VisSense.Utils._isDisplayed(children[2])).toBe(false);

        expect(VisSense.Utils.isVisibleByStyling($('#element')[0])).toBe(true);
        expect(VisSense.Utils.isVisibleByStyling(children[0])).toBe(true);
        expect(VisSense.Utils.isVisibleByStyling(children[1])).toBe(true);
        expect(VisSense.Utils.isVisibleByStyling(children[2])).toBe(false);
      });

      it('should detect "document" has visible by styling', function () {
        expect(VisSense.Utils.isVisibleByStyling(document)).toBe(true);
      });
      it('should detect "null" has hidden by styling', function () {
        expect(VisSense.Utils.isVisibleByStyling(null)).toBe(false);
      });

    });

    describe('hidden elements', function () {

      describe('by dimension', function () {

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

      describe('by styling', function () {

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

      describe('by position', function () {

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

    describe('visible elements', function () {

      it('should detect element with ´visibility´ "visible" nested in container with "hidden" as visible', function () {
        jasmine.getFixtures().load('visible_styling-visibility-visible_nested_in_hidden.html');
        expect($('#element')[0]).toBeVisSenseVisible();
        expect($('#element')[0]).not.toBeVisSenseHidden();
        expect($('#element')[0]).toHaveVisSensePercentageOf(1);
      });

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
        var percentage = VisSense.Utils.percentage($('#element')[0]);
        expect(percentage).toBeLessThan(1);
        expect(percentage).toBeGreaterThan(0);

      });
    });

    describe('fullyvisible elements', function () {
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

  describe('PubSub', function () {
    it('should not register invalid listeners', function () {
      var pubsub = new VisSense.PubSub();

      var unregister = pubsub.on('some-event', [1, 2, 3]);

      expect(unregister).toBe(VisSense.Utils.noop);

      unregister = pubsub.on('some-event', undefined);

      expect(unregister).toBe(VisSense.Utils.noop);
    });

    it('should be able to register a listener to all events', function () {
      var config = {
        callback: function () {
        }
      };

      spyOn(config, 'callback');

      var anyTopicName = 'mySpecialEvent';
      var pubsub = new VisSense.PubSub({
        anyTopicName: anyTopicName
      });

      var unbind = pubsub.on(anyTopicName, config.callback);

      expect(config.callback.calls.count()).toEqual(0);

      pubsub.publish('foobar42');
      pubsub.publish('foobar42+1');

      expect(config.callback.calls.count()).toEqual(2);

      pubsub.publish('foobar42');

      expect(config.callback.calls.count()).toEqual(3);

      pubsub.publish(anyTopicName);

      expect(config.callback.calls.count()).toEqual(3);

      unbind();

      pubsub.publish('foobar42');
      pubsub.publish('foobar42+1');
      pubsub.publish(anyTopicName);

      expect(config.callback.calls.count()).toEqual(3);
    });

    it('should return an unregister function when registering a listener for a valid event', function () {
      var config = {
        update: function () {
        }
      };

      spyOn(config, 'update');

      var pubsub = new VisSense.PubSub();

      var unbind = pubsub.on('update', config.update);

      expect(config.update.calls.count()).toEqual(0);

      pubsub.publish('update');
      pubsub.publish('foobar42');

      expect(config.update.calls.count()).toEqual(1);

      unbind();

      pubsub.publish('update');

      expect(config.update.calls.count()).toEqual(1);
    });

    it('should be able to distribute events asynchronously', function () {
      var config = {
        update: function () {
        }
      };

      spyOn(config, 'update');

      var pubsub = new VisSense.PubSub({async: true});

      var unbind = pubsub.on('update', config.update);

      expect(config.update.calls.count()).toEqual(0);

      pubsub.publish('update');
      pubsub.publish('foobar42');

      // in sync mode update would have been called once ...
      expect(config.update.calls.count()).toEqual(0);

      jasmine.clock().tick(10);

      // since it is async we had to wait a little
      expect(config.update.calls.count()).toEqual(1);

      unbind();

      jasmine.clock().tick(10);

      pubsub.publish('update');
      pubsub.publish('foobar42');

      jasmine.clock().tick(10);

      expect(config.update.calls.count()).toEqual(1);
    });

    it('should allow to unbind a listener instance exactly once', function () {
      var config = {
        update: function () {
        }
      };

      spyOn(config, 'update');

      var pubsub = new VisSense.PubSub();

      var unbind = pubsub.on('update', config.update);

      pubsub.publish('update');
      pubsub.publish('foobar42');
      expect(config.update.calls.count()).toEqual(1);

      expect(unbind()).toBe(true);

      pubsub.publish('update');
      pubsub.publish('foobar42');
      expect(config.update.calls.count()).toEqual(1);

      expect(unbind()).toBe(false);

      pubsub.on('update', config.update);

      // even if the exact same instance is registered again it
      // should not be possible to unbind it with the same function
      expect(unbind()).toBe(false);

      pubsub.publish('update');

      expect(config.update.calls.count()).toEqual(2);

    });
  });

});
