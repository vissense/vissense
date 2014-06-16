/*! vissense - v0.0.1 - 2014-06-17
* Copyright (c) 2014 tbk;*/
(function (root, factory) {
	'use strict';

	root.VISSENSE = factory(root, document, root.VISSENSE || {});

} (this, function (window, document, module, undefined) {
	'use strict';

	// http://dustindiaz.com/rock-solid-addevent
	var EventCache = (function () {
		var listEvents = [];
		return {
			listEvents: listEvents,
			add: function (/*node, sEventName, fHandler*/) {
				listEvents.push(arguments);
			},
			flush: function () {
				var i, item;
				for (i = listEvents.length - 1; i >= 0; i = i - 1) {
					item = listEvents[i];
					if (item[0].removeEventListener) {
						item[0].removeEventListener(item[1], item[2], item[3]);
					}
					if (item[1].substring(0, 2) !== 'on') {
						item[1] = 'on' + item[1];
					}
					if (item[0].detachEvent) {
						item[0].detachEvent(item[1], item[2]);
					}
					item[0][item[1]] = null;
				}
			}
		};
	})();

	module.addEvent = function(obj, type, fn) {
		var t = (type === 'DOMContentLoaded') ? 'readystatechange' : type;
		if (obj.addEventListener) {
			obj.addEventListener(type, fn, false);
			EventCache.add(obj, type, fn);
		} else if (obj.attachEvent) {
			obj['e' + t + fn] = fn;
			obj[t + fn] = function () {
				obj['e' + t + fn](window.event);
			};
			obj.attachEvent('on' + t, obj[t + fn]);
			EventCache.add(obj, t, fn);
		} else {
			obj['on' + t] = obj['e' + t + fn];
		}
	};

	module.addEvent(window, 'unload', EventCache.flush);

	return module;

}));

(function (root, factory) {
	'use strict';

	root.VISSENSE = factory(root, document, root.VISSENSE || {});

} (this, function (window, document, module, undefined) {
	'use strict';
	
	module.IE_VERSION = (function() {
		var v = 3, div = document.createElement('div');

		while (
			div.innerHTML = '<!--[if gt IE '+(++v)+']><i></i><![endif]-->',
			div.getElementsByTagName('i')[0]
		){}

		return v > 4 ? v : undefined;
	})();

	return module;

}));

(function (root, factory) {
	'use strict';

	root.VISSENSE = factory(root, document, root.VISSENSE || {});

} (this, function (window, document, module, undefined) {
	'use strict';

	var _window = function(element) {
		var doc = element.ownerDocument;
		return 'defaultView' in doc ? doc.defaultView : doc.parentWindow;
	};

	var _findEffectiveStyle = function(element) {
		var w = _window(element);

		if (element.style === undefined) {
			return undefined; // not a styled element
		}
		if (w.getComputedStyle) {
			// DOM-Level-2-CSS
			return w.getComputedStyle(element, null);
		}
		if (element.currentStyle) {
			// non-standard IE alternative
			return element.currentStyle;
			// TODO: this won't really work in a general sense, as
			//   currentStyle is not identical to getComputedStyle()
			//   ... but it's good enough for "visibility"
		}

		throw new Error('cannot determine effective stylesheet in this browser');
	};

	var findEffectiveStyleProperty = function findEffectiveStyleProperty(element, property) {
		var effectiveStyle = _findEffectiveStyle(element);
		var propertyValue = effectiveStyle[property];
		if (propertyValue === 'inherit' && element.parentNode.style) {
			return findEffectiveStyleProperty(element.parentNode, property);
		}
		return propertyValue;
	};

	var isDisplayed = function isDisplayed(element) {
		var display = findEffectiveStyleProperty(element, 'display');
		if (display === 'none') {
			return false;
		}
		if (element.parentNode.style) {
			return isDisplayed(element.parentNode);
		}
		return true;
	};

	var isHiddenInputElement = function(element) {
		if (element.tagName && String(element.tagName).toLowerCase() === 'input') {
			return element.type && String(element.type).toLowerCase() === 'hidden';
		}
		return false;
	};

	module.findEffectiveStyleProperty = function(element, property) {
		return findEffectiveStyleProperty(element, property);
	};
	
	module.isVisibleByStyling = function(element) {
		if (element === _window(element).document) {
			return true;
		}
		if (!element || !element.parentNode){
			return false;
		}

		if(isHiddenInputElement(element)) {
			return false;
		}
		
		var visibility = findEffectiveStyleProperty(element, 'visibility');
		var displayed = isDisplayed(element);
		return (visibility !== 'hidden' && visibility !== 'collapse' && displayed);
	};

	return module;

}));

(function (root, factory) {
	'use strict';

	root.VISSENSE = factory(root, document, root.VISSENSE || {});

} (this, function (window, document, module, undefined) {
	'use strict';

	var _window = function(element) {
		var doc = element.ownerDocument;
		return 'defaultView' in doc ? doc.defaultView : doc.parentWindow;
	};

	var getBoundingClientRect = function(element) {
		var r = element.getBoundingClientRect();	
		// IE<9 wont return height or width
		if(typeof r.height === 'undefined' || typeof r.width === 'undefined') {
			// copying object because attributes cannot be added to 'r'
			return {
				top: r.top,
				bottom: r.bottom,
				left: r.left,
				right: r.right,
				height: element.clientHeight,
				width: element.clientWidth
			};
		}
		return r;
	};
	
	var viewportHeight = function(element) {
		var w = _window(element);
		return w.innerHeight || w.document.documentElement.clientHeight;
	};

	var viewportWidth = function(element) {
		var w = _window(element);
		return w.innerWidth || w.document.documentElement.clientWidth;
	};

	
	module.isFullyInViewport = function(element) {
		var r = getBoundingClientRect(element);
		if(r && (r.width <= 0 || r.height <= 0)) {
			return false;
		}
		return (!!r && 
			r.top >= 0 && 
			r.left >= 0 && 
			r.bottom < viewportHeight(element) && 
			r.right < viewportWidth(element)
		);
	};

	module.isInViewport = function(element) {
		var r = getBoundingClientRect(element);
		if(r && (r.width <= 0 || r.height <= 0)) {
			return false;
		}
		return ( !!r && 
			r.bottom > 0 && 
			r.right > 0 && 
			r.top < viewportHeight(element) && 
			r.left < viewportWidth(element) 
		);
	};

	module.getVisibilityPercentage = function(element) {
		if(!module.isInViewport(element)) {
			return 0;
		}

		var r = getBoundingClientRect(element);
		if(!r || r.height <= 0 || r.width <= 0) {
			return 0;
		}

		var vh = 0; // visible height
		var vw = 0; // visible width
		
		if(r.top >= 0) {
			vh = Math.min(r.height, viewportHeight(element) - r.top);
		} else if(r.top < 0 && r.bottom > 0) {
			vh = Math.min(viewportHeight(element), r.bottom);
		}

		if(r.left >= 0) {
			vw = Math.min(r.width, viewportWidth(element) - r.left);
		} else if(r.left < 0 && r.right > 0) {
			vw = Math.min(viewportWidth(element), r.right);
		}
		
		var area = (vh * vw) / (r.height * r.width);
		return Math.max(area, 0);
	};

	return module;
}));

(function (root, factory) {
	'use strict';

	root.VISSENSE = factory(root, document, root.VISSENSE || {});

} (this, function (w, d, module, undefined) {
	'use strict';
	
	function _now() {
		return new Date().getTime();
	}

	module.iSupported = function() {
		if(!!module.IE_VERSION && module.IE_VERSION < 7) {
			return false;
		}
		return true;
	};

	var lastId = -1;
	function Vissense(element, config) {

		var self = this;
		if(!module.iSupported()) {
			//throw new Error('Browser not supported'); 
		}

		if ( !element || 1 !== element.nodeType ) { 
			throw new Error('InvalidArgument: no dom element'); 
		}

		var status = null;
		var listeners = [];
        var _flags = {
            visGte50: false
        };
        var check50percentVisibleFor1SecondTimeout = null;

		var initConfig = function(config) {
			self.config = {
				fullyVisibleThreshold: 1.0,
				visibleUpdateInterval: 100,
				hiddenUpdateInterval: 1000
			};

			if(config.fullyVisibleThreshold > 0.1) {
				self.config.fullyVisibleThreshold = config.fullyVisibleThreshold;
			}
			if(config.visibleUpdateInterval > 0) {
				self.config.visibleUpdateInterval = config.visibleUpdateInterval;
			}
			if(config.hiddenUpdateInterval > 0) {
				self.config.hiddenUpdateInterval = config.hiddenUpdateInterval;
			}
		};

		var init = function(element, config) {
			self.element = element;
			self.d = element.ownerDocument;
			self.w = 'defaultView' in self.d ? self.d.defaultView : self.d.parentWindow;

			initConfig(config);

			// attach events
			var events = ['DOMContentLoaded', 'load', 'scroll', 'resize'];
			for(var i in events) {
				module.addEvent(w, events[i], self._update);
			}

			self.every(self.config.visibleUpdateInterval, self.config.hiddenUpdateInterval, function() {
				self._update();
			});

            /**
             * 50/1 rule
             *
             * 1. check if element is visible for at least 50%
             * 2a. if check was successful and
             *    the element has not yet been visible for 1 sec for at least 50%,
             *    invoke a timeout that starts in 1 second
             *    and sets a flag if element is still visible for at least 50%
             * 2b. if check was not successful,
             *    clear any eventual timeouts (banner was less than a second visible >= 50%)
             */
            self.onVisibilityPercentageChange(function() {
                // return immediately if conditions is already fulfilled
                if(status.vs50 === 1) {
                    return;
                }
                _flags.visGte50 = self._status('visibilityPercentage') >= 0.5;
                if(_flags.visGte50) {
                    check50percentVisibleFor1SecondTimeout = setTimeout(function() {
                        if(_flags.visGte50) {
                            status.vs50 = 1;
                            fireListeners();
                        }
                    }, 950);
                } else {
                    clearTimeout(check50percentVisibleFor1SecondTimeout);
                }
            });

			self._update();
		};

		var fireListeners = function() {
			for(var i in listeners) {
				listeners[i].call(self);
			}
		};
		var state = function() {
			if(self.isHidden()) {
				return Vissense.STATES.HIDDEN;
			} else if (self.isFullyVisible()) {
				return Vissense.STATES.FULLY_VISIBLE;
			}

			return Vissense.STATES.VISIBLE;
		};

		var updateStatus = function() {
			var _prev = !status ? null : {
				ts: status.ts,
				state:status.state,
				visibilityPercentage: status.visibilityPercentage
			};

			status = status || {};
			status.prev = _prev;

			var now = _now();

			status.ts = now;
			status.state = state();
			status.visibilityPercentage = self.getCurrentVisibilityPercentage();
			
			if(!!status.prev) {
				var t = now - status.prev.ts;

				status.time += t;
				status.timeVisibleRelative += t * status.visibilityPercentage;

				if(status.prev.state !== Vissense.STATES.HIDDEN) {
					status.timeVisible += t;
				}
				if(status.prev.state === Vissense.STATES.FULLY_VISIBLE) {
					status.timeFullyVisible += t;
				}
			} else {
				status.time = 0;
				status.timeVisible = 0;
				status.timeFullyVisible = 0;
				status.timeVisibleRelative = 0;
                status.vs50 = 0;
			}

			return status;
		};

		// Adds a listener.
		//
		// var id = Vissense.register(function() {
		//   doSomething();
		// });
		this.register = function(callback) {
			lastId += 1;
			var number = lastId;
			listeners[number] = callback;
			return number;
		};

		// Remove listener by it ID.
		//
		// var id = Vissense.register(function() {
		//   doSomething();
		//   Vissense.unbind(id);
		// });
		this.unbind = function(id) {
			delete listeners[id];   
		};

		this._update = function() {
			updateStatus();
			fireListeners();
		};

		this._status = function(prop) {
			return status[prop];
		};

		init(element, config || {});
	}

	Vissense.STATES = {
		HIDDEN: 0,
		VISIBLE: 1,
		FULLY_VISIBLE: 2
	};

	Vissense.prototype.destroy = function () {

	};

	Vissense.prototype.clientHeight = function() {
		return this.w.innerHeight || this.d.documentElement.clientHeight;
	};

	Vissense.prototype.clientWidth = function() {
		return this.w.innerWidth || this.d.documentElement.clientWidth;
	};

	Vissense.prototype.getTimeVisible = function() {
		return this._status('timeVisible');
	};
	Vissense.prototype.getTimeFullyVisible = function() {
		return this._status('timeFullyVisible');
	};
	Vissense.prototype.getTimeVisibleRelative = function() {
		return this._status('timeVisibleRelative');
	};

	Vissense.prototype.getVisibleRate = function() {
		return this.getTimeVisible() / this.getDuration();
	};

	Vissense.prototype.getFullyVisibleRate = function() {
		return this.getTimeFullyVisible() / this.getDuration();
	};

	Vissense.prototype.getDuration = function() {
		return this._status('time');
	};

	Vissense.prototype.getFullyVisibleThreshold = function() {
		return Math.max(Math.min(this.config.fullyVisibleThreshold, 1.0), 0.1);
	};

	Vissense.prototype.hasVisibilityChanged = function() {
		var prev = this._status('prev');
		return !!prev && (prev.state !== this._status('state'));
	};
	Vissense.prototype.hasVisibilityPercentageChanged = function() {
		var prev = this._status('prev');
		var vp = this._status('visibilityPercentage');
        /* true if there is no previous state or if visibility changed */
		return !prev || (prev.visibilityPercentage !== vp);
	};
	Vissense.prototype.isFullyVisible = function() {
		return this.isFullyInViewport() && this.isVisibleByStyling();
	};

    Vissense.prototype.isVisible = function () {
        return this.isInViewport() && this.isVisibleByStyling();
    };
    Vissense.prototype.wasAtLeast50PercentVisibleFor1Second = function () {
        return this._status('vs50') === 1;
    };

	Vissense.prototype.isHidden = function () {
		return !this.isVisible();
	};

	Vissense.prototype.isVisibleByStyling = function() {
		return module.isVisibleByStyling(this.element);
	};

	Vissense.prototype.isFullyInViewport = function() {
		var threshold = this.getFullyVisibleThreshold();
		if(threshold < 1) {
			return this.getCurrentVisibilityPercentage() >= threshold;
		}
		return module.isFullyInViewport(this.element);
	};

	Vissense.prototype.isInViewport = function() {
		return module.isInViewport(this.element);
	};

	Vissense.prototype.getCurrentVisibilityPercentage = function() {
		if(this.isHidden()) {
			return 0;
		}
		return module.getVisibilityPercentage(this.element);
	};

	module.Vissense = Vissense;

	return module;

}));

(function (window) {
	'use strict';

	var install = function (Vissense) {
	
		function _fireIf (when, callback) {
			return function () {
				if (when()) {
					callback();
				}
			};
		}
        /**
         *
         */
        var fireIf50PercentRulePassedExecuted = false;
        Vissense.prototype.fireIf50PercentRulePassed = function(callback) {
            var self = this;
            return _fireIf(function() {
                return !fireIf50PercentRulePassedExecuted && self.wasAtLeast50PercentVisibleFor1Second();
            }, function() {
                callback();
                fireIf50PercentRulePassedExecuted = true;
            });
        };
		/**
		* Returns a function that invokes callback only 
		* if the visibility state changes.
		*/		
		Vissense.prototype.fireIfVisibilityChanged = function(callback) {
			var self = this;
			return _fireIf(function() {
				return self.hasVisibilityChanged();
			}, callback);
		};

		/**
		* Returns a function that invokes callback only 
		* if visibility rate changes.
		* This does not occur when element is hidden but may
		* be called multiple times if element is in state
		* `VISIBLE` and (depending on the config) `FULLY_VISIBLE`
		*/
		Vissense.prototype.fireIfVisibilityPercentageChanged = function(callback) {
			var self = this;
			return _fireIf(function() {
				return self.hasVisibilityPercentageChanged();
			}, callback);
		};
		
		/**
		* Returns a function that invokes callback only if element is fully visible
		*/
		Vissense.prototype.fireIfFullyVisible = function fireIfElementFullyVisible (callback) {
			var self = this;
			return _fireIf(function() {
				return self.isFullyVisible();
			}, callback);
		};

		/**
		* Returns a function that invokes callback only if element is visible
		*/
		Vissense.prototype.fireIfVisible = function (callback) {
			var self = this;
			return _fireIf(function() {
				return self.isVisible();
			}, callback);
		};

		/**
		* Returns a function that invokes callback only if element is hidden
		*/
		Vissense.prototype.fireIfHidden = function (callback) {
			var self = this;
			return _fireIf(function() {
				return self.isHidden();
			}, callback);
		};

		/**
		* Fires when visibility state changes
		*/
		Vissense.prototype.onVisibilityChange = function (callback) {
			var handler = this.fireIfVisibilityChanged(callback);
			return this.register(handler);
		};
        /**
         * Fires when 50/1 rule passed
         * fires only once!
         */
        Vissense.prototype.on50PercentRulePassed = function (callback) {
            var handler = this.fireIf50PercentRulePassed(callback);
            return this.register(handler);
        };

		/**
		* Fires when visibility percentage changes
		*/
		Vissense.prototype.onVisibilityPercentageChange = function (callback) {
			var handler = this.fireIfVisibilityPercentageChanged(callback);
			return this.register(handler);
		};

		/**
		* Fires when visibility changes and and state transits from:
		* HIDDEN => VISIBLE
		* HIDDEN => FULLY_VISIBLE
		* Fires NOT when state transits from:
		* VISIBLE => FULLY_VISIBLE or
		* FULLY_VISIBLE => VISIBLE
		*/
		Vissense.prototype.onVisible = function (callback) {
			var self = this;		
			var handler = this.fireIfVisibilityChanged(_fireIf(function() {
				var prev = self._status('prev');
				return !prev || prev.state === Vissense.STATES.HIDDEN;
			}, this.fireIfVisible(callback)));
			return this.register(handler);
		};
		
		/**
		* Fires when visibility changes and element becomes fully visible
		*/
		Vissense.prototype.onFullyVisible = function (callback) {
			var handler = this.fireIfVisibilityChanged(this.fireIfFullyVisible(callback));
			return this.register(handler);
		};
		
		/**
		* Fires when visibility changes and element becomes hidden
		*/
		Vissense.prototype.onHidden = function (callback) {
			var handler = this.fireIfVisibilityChanged(this.fireIfHidden(callback));
			return this.register(handler);
		};
	};

	install(window.VISSENSE.Vissense);
})(window);
(function (window) {
    'use strict';
    
    var lastTimer = -1;

    var install = function (Vissense) {

        // Run callback every `interval` milliseconds if page is visible and
        // every `hiddenInterval` milliseconds if page is hidden.
        //
        //   Vissense.every(60 * 1000, 5 * 60 * 1000, function () {
        //       doSomeStuff();
        //   });
        //
        // You can skip `hiddenInterval` and callback will be called only if
        // page is visible.
        //
        //   Vissense.every(1000, function () {
        //       doSomethingKewl();
        //   });
        //
        // It is analog of `setInterval(callback, interval)` but use visibility
        // state.
        //
        // It return timer ID, that you can use in `Vissense._cancel(id)` to stop
        // timer (`clearInterval` analog).
        // Warning: timer ID is different from interval ID from `setInterval`,
        // so don’t use it in `clearInterval`.
        //
        // On change state from hidden to visible timers will be execute.
        Vissense.prototype.every = function (interval, hiddenInterval, callback, runNow) {
            this._time();

            if ( !callback ) {
                callback = hiddenInterval;
                hiddenInterval = null;
            }

            lastTimer += 1;
            var number = lastTimer;

            this._timers[number] = {
                visible:  interval,
                hidden:   hiddenInterval,
                callback: callback
            };
            this._run(number, !!runNow);

            return number;
        };

        // Stop timer from `every` method by ID.
        //
        //   slideshow = Vissense.every(5 * 1000, function () {
        //       changeSlide();
        //   });
        //   $('.stopSlideshow').click(function () {
        //       Vissense.stop(slideshow);
        //   });
        Vissense.prototype.stop = function(id) {
            if ( !this._timers[id] ) {
                return false;
            }
            this._cancel(id);
            delete this._timers[id];
            return true;
        };

        Vissense.prototype._time = function() {
			if (!!this._timed) {
                return;
            }
            if(!this._timers) {
                this._timers = {};
            }

            this._timed = true;

            var self = this;
			this.onVisible(function() {
				self._cancelAndReinitialize();
			});
			this.onHidden(function() {
				self._cancelAndReinitialize();
			});
        };

        // Try to run timer from every method by it’s ID. It will be use
        // `interval` or `hiddenInterval` depending on visibility state.
        // If page is hidden and `hiddenInterval` is null,
        // it will not run timer.
        //
        // Argument `runNow` say, that timers must be execute now too.
        Vissense.prototype._run = function (id, runNow) {
            var interval,
                timer = this._timers[id];

            if ( this.isHidden() ) {
                if ( null === timer.hidden ) {
                    return;
                }
                interval = timer.hidden;
            } else {
                interval = timer.visible;
            }

            var runner = function () {
                timer.last = new Date();
                timer.callback.call(window);
            };

            if ( runNow ) {
                var now  = new Date();
                var last = now - timer.last;

                if ( interval > last ) {
                    timer.delay = setTimeout(function () {
                        runner();
                        timer.id = setInterval(runner, interval);
                    }, interval - last);
                } else {
                    runner();
                    timer.id = setInterval(runner, interval);
                }

            } else {
              timer.id = setInterval(runner, interval);
            }
        };

        // Stop timer from `every` method by it’s ID.
        Vissense.prototype._cancel = function (id) {
            var timer = this._timers[id];
            clearInterval(timer.id);
            clearTimeout(timer.delay);
            delete timer.id;
            delete timer.delay;
        };

		Vissense.prototype._cancelAndReinitialize = function () {
            var prev = this._status('prev');
            var state = this._status('state');
            var isHidden  = state === Vissense.STATES.HIDDEN;
            var wasHidden = !!prev && prev.state === Vissense.STATES.HIDDEN;

            if ( (isHidden && !wasHidden) || (!isHidden && wasHidden) ) {
                for ( var i in this._timers ) {
                    this._cancel(i);
                    this._run(i, !isHidden);
                }
            }
        };
    };

    install(window.VISSENSE.Vissense);

})(window);