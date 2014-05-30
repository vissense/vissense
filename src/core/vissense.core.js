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
