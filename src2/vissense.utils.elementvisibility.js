/**
 * @license
 * Vissense <http://vissense.com/>
 * Copyright 2014 tbk <theborakompanioni+vissense@gmail.com>
 * Available under MIT license <http://opensource.org/licenses/MIT>
 */
 /*
 *
 * getVisibilityPercentage
 * isVisible
 * isFullyVisible
 * isHidden
 * fireIfHidden
 * fireIfFullyVisible
 * fireIfVisible
 */
;(function(window, Math, VisSenseUtils, undefined) {
  'use strict';

	function getVisibilityPercentage(element) {
		if(!VisSenseUtils.isInViewport(element) || !VisSenseUtils.isVisibleByStyling(element) || !VisSenseUtils.isPageVisible()) {
			return 0;
		}

		var r = VisSenseUtils._getBoundingClientRect(element);
		if(!r || r.height <= 0 || r.width <= 0) {
			return 0;
		}

		var vh = 0; // visible height
		var vw = 0; // visible width
		var viewport = VisSenseUtils.viewport(element);

		if(r.top >= 0) {
			vh = Math.min(r.height, viewport.height - r.top);
		} else if(r.top < 0 && r.bottom > 0) {
			vh = Math.min(viewport.height, r.bottom);
		}

		if(r.left >= 0) {
			vw = Math.min(r.width, viewport.width - r.left);
		} else if(r.left < 0 && r.right > 0) {
			vw = Math.min(viewport.width, r.right);
		}

		var area = (vh * vw) / (r.height * r.width);

		return Math.max(area, 0);
	}

	function isFullyVisible(element) {
		return VisSenseUtils.isPageVisible() &&
		VisSenseUtils.isFullyInViewport(element) &&
		VisSenseUtils.isVisibleByStyling(element);
	}

    function isVisible(element) {
        return VisSenseUtils.isPageVisible() &&
        VisSenseUtils.isInViewport(element) &&
        VisSenseUtils.isVisibleByStyling(element);
    }

    function isHidden(element) {
        return !isVisible(element);
    }

    /**
    * Returns a function that invokes callback only if element is fully visible
    */
    function fireIfFullyVisible(element, callback) {
        return VisSenseUtils.fireIf(function() {
            return isFullyVisible(element);
        }, callback);
    }

    /**
    * Returns a function that invokes callback only if element is visible
    */
    function fireIfVisible(element, callback) {
        return VisSenseUtils.fireIf(function() {
            return isVisible(element);
        }, callback);
    }

    /**
    * Returns a function that invokes callback only if element is hidden
    */
    function fireIfHidden(element, callback) {
        return VisSenseUtils.fireIf(function() {
            return isHidden(element);
        }, callback);
    }

    (function(target) {
        target.getVisibilityPercentage = getVisibilityPercentage;
        target.isFullyVisible = isFullyVisible;
        target.isVisible = isVisible;
        target.isHidden = isHidden;
        target.fireIfFullyVisible = fireIfFullyVisible;
        target.fireIfVisible = fireIfVisible;
        target.fireIfHidden = fireIfHidden;
    }(VisSenseUtils));

}.call(this, this, this.Math, this.VisSenseUtils));