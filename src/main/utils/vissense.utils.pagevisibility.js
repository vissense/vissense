/**
 * @license
 * Vissense <http://vissense.com/>
 * Copyright 2014 tbk <theborakompanioni+vissense@gmail.com>
 * Available under MIT license <http://opensource.org/licenses/MIT>
 */
 ;(function(window, VisSenseUtils, Visibility) {
  'use strict';

    /*--------------------------------------------------------------------------*/
    var PageVisibilityAPIAvailable = !!Visibility && !!Visibility.change && !!Visibility.isSupported && Visibility.isSupported();

    function isPageVisibilityAPIAvailable() {
      return !!PageVisibilityAPIAvailable;
    }

    function isPageVisible() {
      return PageVisibilityAPIAvailable ? !Visibility.hidden() : true;
    }

    function onPageVisibilityChange(callback) {
        if(PageVisibilityAPIAvailable) {
            Visibility.change(callback);
        }
    }

    VisSenseUtils.isPageVisibilityAPIAvailable = isPageVisibilityAPIAvailable;
    VisSenseUtils.isPageVisible = isPageVisible;
    VisSenseUtils.onPageVisibilityChange = onPageVisibilityChange;

}.call(this, this, this.VisSenseUtils, this.Visibility));