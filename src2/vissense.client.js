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

      var that = this;

      net.onerror = function (a) {
        /* cache the report */
        //that.cacheReport(data);
      };

      function successHandler() {
        if (net && net.readyState != 4) { return; }
        if (net && net.status != 200) {
          return false;
        }
        // some console.log implementations don't support multiple parameters, guess it's okay in this case to concatenate
        if ('console' in window) {
          console.log('vissense report sent: ' + net.responseText);
        }
      };

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
;(function(window, Math, VisSense, VisSenseUtils) {
    /** Used as a safe reference for `undefined` in pre ES5 environments */
    var undefined;

    /** Used as a reference to the global object */
    var root = (typeof window === 'object' && window) || this;


    var network = new VisSense.Network({
        url: 'http://localhost:9000/vissense'
    });


    VisSenseUtils.addEvent(root, 'load', function(e) {
        console.log('VisClient: load');

        var ua = root.navigator.userAgent;
        var environment = {
            'osver' : ( typeof root.device !== 'undefined' )
                    ? root.device.version
                    : ua.substr(ua.indexOf('; ')+2,ua.length).replace(')',';').split(';')[0] || 'unknown'
        };

        console.log(environment);

        network.send({ hello : "hello"}, 'GET');
    });
    VisSenseUtils.addEvent(root, 'unload', function(e) {
        console.log('VisClient: unload');

    });

}.call(this, this, this.Math, this.VisSense, this.VisSenseUtils));