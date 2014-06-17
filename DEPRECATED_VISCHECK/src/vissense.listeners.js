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