/**
 * @license
 * Vissense <http://vissense.com/>
 * Copyright 2014 tbk <theborakompanioni+vissense@gmail.com>
 * Available under MIT license <http://opensource.org/licenses/MIT>
 */
 ;(function(window, VisSenseUtils, undefined) {
  'use strict';

    /**
     * An object used to flag environments features.
     */
    var support = (function(window, document) {
        /**
        * Detect IE version
        */
        function getIEVersion() {
          var v = 4, div = document.createElement('div');
          while (
            div.innerHTML = '<!--[if gt IE '+v+']><i></i><![endif]-->',
            div.getElementsByTagName('i')[0]
          ){
            v++;
          }
          return v > 4 ? v : undefined;
        }

        /**
         * Detect IE
         
        function isIE() {
          return !!getIEVersion();
        }*/

        /**
         * Detect if the DOM is supported.
         */
        function isDomPresent() {
          try {
           return document.createDocumentFragment().nodeType === 11;
          } catch(e) {}
          return false;
        }

        function canReadStyle() {
          try {
           return !!VisSenseUtils._findEffectiveStyle(document.getElementsByTagName('body')[0]);
          } catch(e) {}
          return false;
        }

        var support = {};
        support.MinIEVersion = 7;
        support.PageVisibilityAPIAvailable = VisSenseUtils.isPageVisibilityAPIAvailable();
        support.IEVersion = getIEVersion();
        support.DOMPresent = isDomPresent();
        support.CanReadStyle = canReadStyle();

        var ieVersion = getIEVersion();
        support.BrowserSupported = ieVersion === undefined || support.IEVersion >= support.MinIEVersion;

        support.compatible = support.DOMPresent && support.CanReadStyle && support.BrowserSupported;

        return support;
    }(window, window.document));

    VisSenseUtils.support = function() {
        return support;
    };

}(window, window.VisSenseUtils));