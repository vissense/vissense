
var defaults = require('./util/defaults');
var forEach = require('./util/forEach');
var isElement = require('./util/isElement');
var percentage = require('./util/_element').percentage;
var createVisibilityApi = require('./util/_element').createVisibilityApi;

var VisState = require('./helper/VisState');

/**
 * @typedef VisSense~VisSenseConfig
 * @type {Object}
 * @property {number} [fullyvisible=1] The percentage limit an element is
 * considered fully visible.
 * @property {number} [hidden=0] The percentage an element limit is considered
 * hidden.
 * @property {number} [precision=3] The precision of the default percentage algorithm.
 * Must be not be negative.
 * @property {VisSense~PercentageHook} [percentageHook=VisSense.Utils.percentage]
 * A callback function to determine the visible percentage of the element.
 * If not provided it will fallback to VisSense.Utils.percentage.
 * @property {VisSense~VisibilityHook[]} [percentageHooks=[]]
 * An array of callback functions to intercept the visibility procedure.
 * By default a visibility hook using the VisibilityAPI will be registered.
 *
 * @description A configuration object to configure a VisSense instance.
 */

/**
 * @callback VisSense~PercentageHook
 *
 * @param {DOMElement} element The element to get the visible percentage of.
 * @returns {number} The visible percentage of the element (between 0 and 1).
 *
 * @description This callback function that will be called to determine
 * the visible area of the element.
 */
/**
 * @callback VisSense~VisibilityHook
 *
 * @param {DOMElement} element The target element.
 * @returns {boolean} `false` if the element is hidden, `true` otherwise.
 *
 * @description This callback function that will be called to intercept
 * the default visibility process.
 */

/**
 * @class
 * @name VisSense
 * @throws {Error} Will throw an error if the first argument is not a DOM
 * Element.
 *
 * @param {DOMElement} element A DOM element.
 * @param {VisSense~VisSenseConfig} [config={fullyvisible: 1, hidden: 0}] A
 * configuration object.
 *
 * @description Creates a `VisSense` object which wraps the given element
 * to enable visibility operations.
 *
 * @example
 *
 * var element = document.getElementById('myElement');
 * var vis = VisSense(element); // or new VisSense(element)
 *
 * vis.isVisible();
 * // => true
 *
 * vis.percentage();
 * // => 0.93
 *
 */
class VisSense {
    constructor(element, config) {
        if (!(this instanceof VisSense)) {
            return new VisSense(element, config);
        }

        if (!isElement(element)) {
            throw new Error('not an element node');
        }

        this._element = element;
        this._config = defaults(config, {
            fullyvisible: 1,
            hidden: 0,
            referenceWindow: window,
            percentageHook: percentage,
            precision: 3,
            visibilityHooks: []
        });

        var roundFactor = this._config.precision <= 0 ? 1 : Math.pow(10, this._config.precision || 3);
        this._round = function (val) {
            return Math.round(val * roundFactor) / roundFactor;
        };

        // page must be visible in order for the element to be visible
        var visibilityApi = createVisibilityApi(this._config.referenceWindow);
        this._config.visibilityHooks.push(function () {
            return !visibilityApi.isHidden();
        });
    }


    /**
     * @method
     * @name element
     * @memberof VisSense#
     *
     * @returns {DOMElement} The element
     *
     * @description Returns the element this instance is bound to
     *
     * @example
     *
     * var visElement = VisSense(element);
     *
     * element === visElement.element();
     * // => true
     *
     */
    element() {
        return this._element;
    }

    referenceWindow() {
        return this._config.referenceWindow;
    }

    /**
     * @method
     * @name isFullyVisible
     * @memberof VisSense#
     *
     * @returns {boolean} `true` if the element is fully visible, otherwise `false`.
     *
     * @description Checks if the element is currently fully visible.
     *
     * @example
     *
     * var visElement = VisSense(element);
     * visElement.isFullyVisible();
     * // => true
     *
     */
    isFullyVisible() {
        return this.state().fullyvisible;
    }

    /**
     * @method
     * @name isVisible
     * @memberof VisSense#
     *
     * @returns {boolean} `true` if the element is visible, otherwise `false`.
     *
     * @description Checks if the element is currently visible.
     *
     * @example
     *
     * var visElement = VisSense(element);
     * visElement.isVisible();
     * // => true
     *
     */
    isVisible() {
        return this.state().visible;
    }

    /**
     * @method
     * @name isHidden
     * @memberof VisSense#
     *
     * @returns {boolean} `true` if the element is hidden, otherwise `false`.
     *
     * @description Checks if the element is currently hidden.
     *
     * @example
     *
     * var visElement = VisSense(element);
     * visElement.isHidden();
     * // => false
     *
     */
    isHidden() {
        return this.state().hidden;
    }


    /**
     * @method
     * @name percentage
     * @memberof VisSense#
     *
     * @returns {number} The currently visible area of the element.
     *
     * @description Returns the currently visible area of the element in percent (0..1)
     *
     * @example
     *
     * var visElement = VisSense(element);
     *
     * visElement.precentage();
     * // => 0.33
     *
     */
    percentage() {
        return this.state().percentage;
    }

    /**
     * @method
     * @name state
     * @memberof VisSense#
     *
     * @returns {VisSense~VisState} A state object.
     *
     * @description Returns an object representing the current state.
     * This function always invokes the full visibility scan and
     * therefore produces a new object everytime.
     *
     * @example
     *
     * var visElement = VisSense(element);
     * visElement.state();
     * // => {
     *    code: 1,
     *    state: 'visible',
     *    percentage: 0.33,
     *    fullyvisible: false,
     *    visible: true,
     *    hidden: false,
     *    previous: {}
     *  }
     *
     */
    state() {
        var hiddenByHook = forEach(this._config.visibilityHooks, hook => {
            if (!hook(this._element)) {
                console.debug('visibilityHook returned false -> element is not visible.');
                return VisState.hidden(0);
            }
        }, this);

        return hiddenByHook || (function (visobj, element, config) {
                var perc = visobj._round(config.percentageHook(element, config.referenceWindow));

                if (perc <= config.hidden) {
                    return VisState.hidden(perc);
                }
                else if (perc >= config.fullyvisible) {
                    return VisState.fullyvisible(perc);
                }

                return VisState.visible(perc);
            })(this, this._element, this._config);
    }
}

export default VisSense;
