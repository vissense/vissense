/**
 * @license
 * VisSense <http://vissense.com/>
 * Copyright 2014 tbk <theborakompanioni+vissense@gmail.com>
 * Available under MIT license <http://opensource.org/licenses/MIT>
 */

/**
 * Creates a `VisSense` object which wraps the given element to enable
 * visibility operations
 *
 * @example
 *
 * var visElement = VisSense(element);
 *
 * visElement.isVisible();
 * // => true
 *
 * visElement.percentage();
 * // => 0.93
 *
 */
function VisSense(element, config) {
    if (!(this instanceof VisSense)) {
        return new VisSense(element, config);
    }

    if ( !element || 1 !== element.nodeType ) {
        throw new Error('not an element node');
    }

    this._element = element;
    this._config = defaults(config, {
        fullyvisible : 1,
        hidden: 0
    });
}
VisSense.prototype.state = function() {
  var percentage = this.percentage();
  return {
    percentage: percentage,
    hidden: percentage <= this._config.hidden,
    visible: percentage > this._config.hidden,
    fullyvisible: percentage >= this._config.fullyvisible
  };
};

VisSense.prototype.percentage = function() {
  return percentage(this._element);
};

VisSense.prototype.isFullyVisible = function() {
  return this.state().fullyvisible;
};

VisSense.prototype.isVisible = function() {
  return this.state().visible;
};

VisSense.prototype.isHidden = function() {
  return this.state().hidden;
};

/*--------------------------------------------------------------------------*/

/**
* Returns a function that invokes callback only if element is hidden
*/
VisSense.prototype.fireIfFullyVisible = function(callback) {
    var me = this;
    return fireIf(function() {
        return me.isFullyVisible();
    }, callback);
};

/**
* Returns a function that invokes callback only if element is hidden
*/
VisSense.prototype.fireIfVisible = function(callback) {
    var me = this;
    return fireIf(function() {
        return me.isVisible();
    }, callback);
};

/**
* Returns a function that invokes callback only if element is hidden
*/
VisSense.prototype.fireIfHidden = function (callback) {
    var me = this;
    return fireIf(function() {
        return me.isHidden();
    }, callback);
};

VisSense.fn = VisSense.prototype;
VisSense.version = '0.1.0';
VisSense.of = function(element, config) {
    return new VisSense(element, config);
};

// export VisSense
window.VisSense = VisSense;
