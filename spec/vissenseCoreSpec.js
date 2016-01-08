/*global VisSense,$,jasmine,describe,it,expect*/

describe('VisSense', function () {
  'use strict';

  it('should throw error when not initialized with element node', function () {
    expect(function () {
      return new VisSense();
    }).toThrow(new Error('not an element node'));
  });

  it('should be able to create VisSense objects', function () {
    jasmine.getFixtures().set('<div id="element" style="width: 1px; height: 1px;"></div>');
    var visobj = new VisSense($('#element')[0]);
    var visobj3 = VisSense.of($('#element')[0]);
    /* jshint newcap:false */
    var visobj2 = VisSense($('#element')[0], {
      fullyvisible: 0.75
    });

    expect(visobj).toBeDefined();
    expect(visobj2).toBeDefined();
    expect(visobj3).toBeDefined();
  });

  it('should have reasonable default values', function () {
    jasmine.getFixtures().set('<div id="element" style="width: 1px; height: 1px;"></div>');

    var visobj = VisSense.of($('#element')[0], {});

    expect(visobj._config.fullyvisible).toBe(1);
    expect(visobj._config.hidden).toBe(0);
    expect(visobj._config.percentageHook).toBe(VisSense.Utils.percentage);
    expect(visobj._config.visibilityHooks).toBeDefined();
    expect(visobj._config.visibilityHooks.length).toBeDefined(1);
  });

  it('should have a way to get the element the instance is bound to', function () {
    jasmine.getFixtures().set('<div id="element" style="width: 1px; height: 1px;"></div>');

    var element = $('#element')[0];
    var visobj = VisSense.of(element, {});

    expect(visobj.element()).toBe(element);
  });

  it('should detect an element without width or height as hidden', function () {
    jasmine.getFixtures().set('<div id="element" style="width: 20px; height: 0;"></div>');
    var visobj = new VisSense($('#element')[0]);

    expect(visobj.isHidden()).toBe(true);
    expect(visobj.isVisible()).toBe(false);
    expect(visobj.isFullyVisible()).toBe(false);
    expect(visobj.percentage()).toBe(0);

    jasmine.getFixtures().set('<div id="element2" style="width: 0; height: 20px;"></div>');
    var visobj2 = new VisSense($('#element2')[0]);

    expect(visobj2.isHidden()).toBe(true);
    expect(visobj2.isVisible()).toBe(false);
    expect(visobj2.isFullyVisible()).toBe(false);
    expect(visobj2.percentage()).toBe(0);
  });


  describe('tests with hidden parents', function () {
    it('should detect an element with parent with "height := 0" or "width := 0" as hidden', function () {
      jasmine.getFixtures().set('<div style="width: 10px; height: 0;"><div id="element"></div></div>');
      var visobj = new VisSense($('#element')[0]);

      expect(visobj.isHidden()).toBe(true);
      expect(visobj.isVisible()).toBe(false);
      expect(visobj.isFullyVisible()).toBe(false);
      expect(visobj.percentage()).toBe(0);

      jasmine.getFixtures().set('<div style="width: 0; height: 10px;"><div id="element2"></div></div>');
      var visobj2 = new VisSense($('#element2')[0]);

      expect(visobj2.isHidden()).toBe(true);
      expect(visobj2.isVisible()).toBe(false);
      expect(visobj2.isFullyVisible()).toBe(false);
      expect(visobj2.percentage()).toBe(0);
    });

    it('should detect an element with parent with "display := none" as hidden', function () {
      jasmine.getFixtures().set('<div style="display: none;"><div id="element"></div></div>');
      var visobj = new VisSense($('#element')[0]);

      expect(visobj.isHidden()).toBe(true);
      expect(visobj.isVisible()).toBe(false);
      expect(visobj.isFullyVisible()).toBe(false);
      expect(visobj.percentage()).toBe(0);
      expect(VisSense.Utils._computedStyle($('#element')[0]).display).toBe('block');
    });

    it('should detect an element with parent with "visibility := hidden" as hidden', function () {
      jasmine.getFixtures().set('<div style="visibility: hidden;"><div id="element"></div></div>');
      var visobj = new VisSense($('#element')[0]);

      expect(visobj.isHidden()).toBe(true);
      expect(visobj.isVisible()).toBe(false);
      expect(visobj.isFullyVisible()).toBe(false);
      expect(visobj.percentage()).toBe(0);
      expect(VisSense.Utils._computedStyle($('#element')[0]).visibility).toBe('hidden');
    });

    it('should detect an element with parent with "visibility := collapse" as hidden', function () {
      jasmine.getFixtures().set('<div style="visibility: collapse;"><div id="element"></div></div>');
      var visobj = new VisSense($('#element')[0]);

      expect(visobj.isHidden()).toBe(true);
      expect(visobj.isVisible()).toBe(false);
      expect(visobj.isFullyVisible()).toBe(false);
      expect(visobj.percentage()).toBe(0);
      expect(VisSense.Utils._computedStyle($('#element')[0]).visibility).toBe('collapse');
    });
  });

  it('should detect an simple element as visible', function () {
    jasmine.getFixtures().set('<div id="element" style="width: 2px; height: 2px; position: fixed; top:-1px; left: -1px;"></div>');
    var visobj = new VisSense($('#element')[0]);

    expect(visobj.isHidden()).toBe(false);
    expect(visobj.isVisible()).toBe(true);
    expect(visobj.isFullyVisible()).toBe(false);
    expect(visobj.percentage()).toBe(0.25);
  });

  it('should create and test for a fully visible object', function () {
    jasmine.getFixtures().set('<div id="element" style="position:fixed; top:0; right:0; bottom:0; left:0;"></div>');
    var visobj = new VisSense($('#element')[0]);

    expect(visobj.isHidden()).toBe(false);
    expect(visobj.isVisible()).toBe(true);
    expect(visobj.isFullyVisible()).toBe(true);
    expect(visobj.percentage()).toBe(1);
  });

  it('should detect an element stretching the whole viewport as fully visible', function () {
    var viewport = VisSense.Utils._viewport();

    jasmine.getFixtures().set('<div id="element" style="top:0; left:0; position: fixed; ' +
      'width: ' + viewport.width + 'px; height: ' + viewport.height + 'px"></div>');

    var visobj = new VisSense($('#element')[0]);

    expect(visobj.isFullyVisible()).toBe(true);
    expect(visobj.percentage()).toEqual(1);
  });

  it('should be able to detect an element with 50% visibility as fully visible', function () {
    jasmine.getFixtures().load('visible_50_percent_top.html');

    var visobj = new VisSense($('#element')[0], {
      fullyvisible: 0.4
    });

    expect(visobj.isHidden()).toBe(false);
    expect(visobj.isVisible()).toBe(true);
    expect(visobj.isFullyVisible()).toBe(true);
    expect(visobj.percentage()).toEqual(0.5);
  });

  it('should be able to detect an element with 50% visibility as hidden', function () {
    jasmine.getFixtures().load('visible_50_percent_top.html');

    var visobj = new VisSense($('#element')[0], {
      hidden: 0.6
    });

    expect(visobj.isHidden()).toBe(true);
    expect(visobj.isVisible()).toBe(false);
    expect(visobj.isFullyVisible()).toBe(false);
    expect(visobj.percentage()).toEqual(0.5);
  });

  it('should be able to set the accuracy of the default percentage algorithm', function () {
    jasmine.getFixtures().set('<div id="element" ' +
      'style="width: 9px; height: 9px; position: fixed; top:-3px;"></div>');

    expect(new VisSense($('#element')[0], {
      precision: 0
    }).percentage()).toEqual(1);

    expect(new VisSense($('#element')[0], {
      precision: 2
    }).percentage()).toEqual(0.67);

    expect(new VisSense($('#element')[0], {
      precision: 5
    }).percentage()).toEqual(0.66667);
  });

  it('should be possible to specify an alternative logic to get the visible percentage', function () {
    jasmine.getFixtures().load('visible_50_percent_top.html');

    // a function that alternates the percentage on each call
    var alternativeVisiblePercentage = (function () {
      var i = 0;
      return function (/*jshint unused:false*/element) {
        return i++ % 2 === 0 ? 0 : 1;
      };
    })();

    var visobj = new VisSense($('#element')[0], {
      percentageHook: alternativeVisiblePercentage
    });

    expect(visobj.isHidden()).toBe(true);
    expect(visobj.isHidden()).toBe(false);
    expect(visobj.isHidden()).toBe(true);
    expect(visobj.isHidden()).toBe(false);
    expect(visobj.isHidden()).toBe(true);
    expect(visobj.isHidden()).toBe(false);

  });

  it('should be possible to specify further requirements for an element to be visible', function () {
    jasmine.getFixtures().load('visible_50_percent_top.html');

    var alternativeVisibility = (function () {
      var i = 0;
      return function (/*jshint unused:false*/element) {
        return i++ % 3 === 0 ? true : false;
      };
    })();

    var visobj = new VisSense($('#element')[0], {
      visibilityHooks: [alternativeVisibility]
    });

    expect(visobj.isVisible()).toBe(true); // i = 0
    expect(visobj.isVisible()).toBe(false);
    expect(visobj.isVisible()).toBe(false);
    expect(visobj.isVisible()).toBe(true);
    expect(visobj.isVisible()).toBe(false);
    expect(visobj.isVisible()).toBe(false);
    expect(visobj.isVisible()).toBe(true);

  });

  describe('hidden input elements', function () {
    it('should detect [input] elements with type "hidden" as hidden', function () {
      jasmine.getFixtures().load('hidden_input_element.html');

      var visobj = new VisSense($('#element')[0]);
      expect(visobj.isHidden()).toBe(true);
    });
  });
});
