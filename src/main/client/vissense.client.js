/**
 * @license
 * Vissense <http://vissense.com/>
 * Copyright 2014 tbk <theborakompanioni+vissense@gmail.com>
 * Available under MIT license <http://opensource.org/licenses/MIT>
 */
;(function(window, VisSense, VisSenseUtils) {

VisSense.Network = function(config) {
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
        if (net && net.readyState !== 4) { return; }
        if (net && net.status !== 200) {
          return false;
        }
        // some console.log implementations don't support multiple parameters, guess it's okay in this case to concatenate
        if ('console' in window) {
          console.log('vissense report sent: ' + net.responseText);
        }
      }

      net.onreadystatechange = successHandler;
      net.send({ data: JSON.stringify(data) });
    }
  };
  return Network;
};

}.call(this, this, this.VisSense, this.VisSenseUtils));

/**
 * @license
 * Vissense <http://vissense.com/>
 * Copyright 2014 tbk <theborakompanioni+vissense@gmail.com>
 * Available under MIT license <http://opensource.org/licenses/MIT>
 */
;(function(window, Math, VisSense, VisSenseUtils, undefined) {

    var network = new VisSense.Network({
        url: 'http://localhost:9000/vissense'
    });


    VisSenseUtils.addEvent(window, 'load', function(e) {
        console.log('VisClient: ' + e);

        var ua = window.navigator.userAgent;
        var environment = {
            'osver' : ( typeof window.device !== 'undefined' ) ? window.device.version
                    : ua.substr(ua.indexOf('; ')+2,ua.length).replace(')',';').split(';')[0] || 'unknown'
        };

        console.log(environment);

        network.send({ hello : 'hello'}, 'GET');
    });

    VisSenseUtils.addEvent(window, 'beforeunload', function(e) {
        console.log('VisClient: ' + e);

    });

}.call(this, this, this.Math, this.VisSense, this.VisSenseUtils));