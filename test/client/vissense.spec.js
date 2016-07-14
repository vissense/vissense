import VisSense from "../../src/entry.js";

describe('VisSense', () => {
    it('should throw error when not initialized with element node', () => {
        var error = 'not an element node';

        expect(VisSense).to.throw(error);
        expect(() => {
            return new VisSense();
        }).to.throw(error);
    });


    it('should be able to create VisSense objects', () => {
        fixture.load('1x1.html');

        var visobj = new VisSense(fixture.el.firstChild);
        var visobj2 = VisSense.of(fixture.el.firstChild);
        var visobj3 = VisSense(fixture.el.firstChild, {
            fullyvisible: 0.75
        });

        expect(visobj).to.be.ok;
        expect(visobj2).to.be.ok;
        expect(visobj3).to.be.ok;
    });

    describe('VisState', () => {
        it('should create all 3 VisState objects', () => {
            expect(VisSense.VisState.hidden(0)).to.be.ok;
            expect(VisSense.VisState.visible(0.1)).to.be.ok;
            expect(VisSense.VisState.fullyvisible(1)).to.be.ok;
        });
    });

    it('should have reasonable default settings', () => {
        fixture.load('1x1.html');

        var visobj = VisSense.of(fixture.el.firstChild, {});

        expect(visobj._config.fullyvisible).to.be.eql(1);
        expect(visobj._config.hidden).to.be.eql(0);
        expect(visobj._config.percentageHook).to.be.eql(VisSense.Utils.percentage);
        expect(visobj._config.visibilityHooks).to.be.ok;
        expect(visobj._config.visibilityHooks.length).to.be.ok;
    });

    it('should be possible to retrieve the element the instance is bound to', () => {
        fixture.load('1x1.html');

        var element = fixture.el.firstChild;
        var visobj = new VisSense(element);

        expect(visobj.element()).to.be.eql(element);
    });

    it('should detect an element without width or height as hidden', () => {
        fixture.load('1x0.html', '0x1.html');
        var elements = [fixture.el.children[0], fixture.el.children[1]];
        elements.forEach(element => {
            var visobj = new VisSense(element);

            expect(visobj.isHidden()).to.be.eql(true);
            expect(visobj.isVisible()).to.be.eql(false);
            expect(visobj.isFullyVisible()).to.be.eql(false);
            expect(visobj.percentage()).to.be.eql(0);
        });
    });

    describe('tests with hidden parents', () => {
        it('should detect an element with parent with "height := 0" or "width := 0" as hidden', () => {
            fixture.set('<div style="width: 10px; height: 0;"><div id="element"></div></div>');
            var visobj = new VisSense(document.getElementById('element'));

            expect(visobj.isHidden()).to.be.eql(true);
            expect(visobj.isVisible()).to.be.eql(false);
            expect(visobj.isFullyVisible()).to.be.eql(false);
            expect(visobj.percentage()).to.be.eql(0);

            fixture.set('<div style="width: 0; height: 10px;"><div id="element2" ></div></div>');
            var visobj2 = new VisSense(document.getElementById('element2'));

            expect(visobj2.isHidden()).to.be.eql(true);
            expect(visobj2.isVisible()).to.be.eql(false);
            expect(visobj2.isFullyVisible()).to.be.eql(false);
            expect(visobj2.percentage()).to.be.eql(0);
        });

        it('should detect an element with parent with "display := none" as hidden', () => {
            fixture.set('<div style="display: none;"><div id="element"></div></div>');
            var element = document.getElementById('element');
            var visobj = new VisSense(element);

            expect(visobj.isHidden()).to.be.eql(true);
            expect(visobj.isVisible()).to.be.eql(false);
            expect(visobj.isFullyVisible()).to.be.eql(false);
            expect(visobj.percentage()).to.be.eql(0);
            expect(VisSense.Utils._computedStyle(element).display).to.be.eql('block');
        });

        it('should detect an element with parent with "visibility := hidden" as hidden', () => {
            fixture.set('<div style="visibility: hidden;"><div id="element"></div></div>');
            var element = document.getElementById('element');
            var visobj = new VisSense(element);

            expect(visobj.isHidden()).to.be.eql(true);
            expect(visobj.isVisible()).to.be.eql(false);
            expect(visobj.isFullyVisible()).to.be.eql(false);
            expect(visobj.percentage()).to.be.eql(0);
            expect(VisSense.Utils._computedStyle(element).visibility).to.be.eql('hidden');
        });

        it('should detect an element with parent with "visibility := collapse" as hidden', () => {
            fixture.set('<div style="visibility: collapse;"><div id="element"></div></div>');
            var element = document.getElementById('element');
            var visobj = new VisSense(element);

            expect(visobj.isHidden()).to.be.eql(true);
            expect(visobj.isVisible()).to.be.eql(false);
            expect(visobj.isFullyVisible()).to.be.eql(false);
            expect(visobj.percentage()).to.be.eql(0);
            expect(VisSense.Utils._computedStyle(element).visibility).to.be.eql('collapse');
        });
    });

    it('should detect the simplest elements as visible', () => {
        fixture.load('1x1.html');
        var elements = [fixture.el.firstChild];
        elements.forEach(element => {
            var visobj = new VisSense(element);

            expect(visobj.isHidden()).to.be.eql(false);
            expect(visobj.isVisible()).to.be.eql(true);
            expect(visobj.isFullyVisible()).to.be.eql(true);
            expect(visobj.percentage()).to.be.eql(1);
        });
    });

    it('should detect a simple element as visible', () => {
        fixture.set('<div id="element" style="width: 2px; height: 2px; position: fixed; top:-1px; left: -1px;"></div>');
        var element = document.getElementById('element');
        var visobj = new VisSense(element);

        expect(visobj.isHidden()).to.be.eql(false);
        expect(visobj.isVisible()).to.be.eql(true);
        expect(visobj.isFullyVisible()).to.be.eql(false);
        expect(visobj.percentage()).to.be.eql(0.25);
    });

    it('should create and test for a fully visible object', () => {
        fixture.set('<div id="element" style="position:fixed; top:0; right:0; bottom:0; left:0;"></div>');
        var element = document.getElementById('element');
        var visobj = new VisSense(element);

        expect(visobj.isHidden()).to.be.eql(false);
        expect(visobj.isVisible()).to.be.eql(true);
        expect(visobj.isFullyVisible()).to.be.eql(true);
        expect(visobj.percentage()).to.be.eql(1);
    });

    it('should detect an element stretching the whole viewport as fully visible', () => {
        var viewport = VisSense.Utils._viewport();

        fixture.set('<div id="element" style="top:0; left:0; position: fixed; ' +
            'width: ' + viewport.width + 'px; height: ' + viewport.height + 'px"></div>');
        var element = document.getElementById('element');
        var visobj = new VisSense(element);

        expect(visobj.isFullyVisible()).to.be.eql(true);
        expect(visobj.percentage()).to.be.eql(1);
    });

    it('should be able to detect an element with 50% visibility as fully visible', () => {
        fixture.load('visible_50_percent_top.html');
        var element = document.getElementById('element');
        var visobj = new VisSense(element, {
            fullyvisible: 0.4
        });

        expect(visobj.isHidden()).to.be.eql(false);
        expect(visobj.isVisible()).to.be.eql(true);
        expect(visobj.isFullyVisible()).to.be.eql(true);
        expect(visobj.percentage()).to.be.eql(0.5);
    });


    it('should be able to detect an element with 50% visibility as hidden', () => {
        fixture.load('visible_50_percent_top.html');
        var element = document.getElementById('element');
        var visobj = new VisSense(element, {
            hidden: 0.6
        });

        expect(visobj.isHidden()).to.be.eql(true);
        expect(visobj.isVisible()).to.be.eql(false);
        expect(visobj.isFullyVisible()).to.be.eql(false);
        expect(visobj.percentage()).to.be.eql(0.5);
    });


    it('should be able to set the accuracy of the default percentage algorithm', () => {
        fixture.set('<div id="element" ' +
            'style="width: 9px; height: 9px; position: fixed; top:-3px;"></div>');
        var element = document.getElementById('element');

        expect(new VisSense(element, {
            precision: 0
        }).percentage()).to.be.eql(1);

        expect(new VisSense(element, {
            precision: 2
        }).percentage()).to.be.eql(0.67);

        expect(new VisSense(element, {
            precision: 5
        }).percentage()).to.be.eql(0.66667);
    });


    it('should be possible to specify an alternative logic to get the visible percentage', () => {
        fixture.load('visible_50_percent_top.html');
        var element = document.getElementById('element');

        // a function that alternates the percentage on each call
        var alternativeVisiblePercentage = (() => {
            var i = 0;
            return () => i++ % 2 === 0 ? 0 : 1;
        })();

        var visobj = new VisSense(element, {
            percentageHook: alternativeVisiblePercentage
        });

        expect(visobj.isHidden()).to.be.eql(true);
        expect(visobj.isHidden()).to.be.eql(false);
        expect(visobj.isHidden()).to.be.eql(true);
        expect(visobj.isHidden()).to.be.eql(false);
        expect(visobj.isHidden()).to.be.eql(true);
        expect(visobj.isHidden()).to.be.eql(false);
    });


    it('should be possible to specify further requirements for an element to be visible', () => {
        fixture.load('visible_50_percent_top.html');
        var element = document.getElementById('element');

        var alternativeVisibility = (() => {
            var i = 0;
            return () => i++ % 3 === 0;
        })();

        var visobj = new VisSense(element, {
            visibilityHooks: [alternativeVisibility]
        });

        expect(visobj.isVisible()).to.be.eql(true); // i = 0
        expect(visobj.isVisible()).to.be.eql(false);
        expect(visobj.isVisible()).to.be.eql(false);
        expect(visobj.isVisible()).to.be.eql(true);
        expect(visobj.isVisible()).to.be.eql(false);
        expect(visobj.isVisible()).to.be.eql(false);
        expect(visobj.isVisible()).to.be.eql(true);

    });

    describe('hidden input elements', () => {
        it('should detect [input] elements with type "hidden" as hidden', () => {
            fixture.load('hidden_input_element.html');
            var element = document.getElementById('element');

            var visobj = new VisSense(element);
            expect(visobj.isHidden()).to.be.eql(true);
        });
    });
});
