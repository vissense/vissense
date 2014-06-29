/**
 * @license
 * Vissense <http://vissense.com/>
 * Copyright 2014 tbk <theborakompanioni+vissense@gmail.com>
 * Available under MIT license <http://opensource.org/licenses/MIT>
 */
;(function(window, VisSense, VisSenseUtils, undefined) {
  'use strict';

  VisSense.newNetwork = function(config) {
    var postUrl = config.url + '?cacheBuster='+VisSenseUtils.now();
    var Network = {
      send: function(data, method) {
        // Send the data over to Vissense
        var net = new XMLHttpRequest();
        net.open(method || 'POST', postUrl, true );
        net.setRequestHeader('X-VisSense-Api-Key', config.apiKey);
        net.setRequestHeader('Content-Type', 'application/json');

        //var me = this;

        net.onerror = function () {
          /* cache the report */
          //that.cacheReport(data);
        };

        function successHandler() {
          if (net.readyState !== 4) { return; }
          if (net.status !== 200) {
            return false;
          }

          console.log('vissense report sent: ' + net.responseText);
        }

        net.onreadystatechange = successHandler;
        net.send(JSON.stringify(data));
      }
    };
    return Network;
  };

  /*jshint unused:false*/
  function VisClient(visobj, config) {

    var network = VisSense.newNetwork({
        url: 'http://localhost:9000/vissense'
    });


    VisSenseUtils.addEvent(window, 'load', function(e/*jshint unused:false*/) {
        var ua = window.navigator.userAgent;
        var environment = {
            osver : ( typeof window.device !== 'undefined' ) ? window.device.version
                    : ua.substr(ua.indexOf('; ')+2,ua.length).replace(')',';').split(';')[0] || 'unknown'
        };

        //console.log(ua);
        //console.log(environment.osver);
        //console.log(environment.platform);

        network.send('load', 'POST');
    });

    VisSenseUtils.addEvent(window, 'beforeunload', function(e/*jshint unused:false*/) {
        //console.log('VisClient: ' + e);

        network.send('beforeunload', 'POST');
    });

  }

    function newVisClient(visobj, config) {
        return new VisClient(/*visobj.monitor()*/ null, config || {});
    }

    VisSense.fn.client = function(config) {
        if(this._$$client) {
            return this._$$client;
        }
        this._$$client = newVisClient(this, config);
        return this._$$client;
    };

    VisSense.client = newVisClient;
    VisSense.client(null); // temporary call to client for demo purposes only TODO: remove afterwards

}(window, window.VisSense, window.VisSenseUtils));