/*! vissense - v0.0.1 - 2014-06-18
* Copyright (c) 2014 tbk;*/
/*! vissense - v0.0.1 - 2014-06-18
* Copyright (c) 2014 tbk;*/
!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.brwsrfyMetrics=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
var Metrics = _dereq_('./node_modules/metrics/metrics'), 
Report = _dereq_('./node_modules/metrics/reporting/report');

exports.Histogram = Metrics.Histogram;
exports.Meter = Metrics.Meter;
exports.Counter = Metrics.Counter;
exports.Timer = Metrics.Timer;
exports.Report = Report;

},{"./node_modules/metrics/metrics":6,"./node_modules/metrics/reporting/report":9}],2:[function(_dereq_,module,exports){
// From http://eloquentjavascript.net/appendix2.html, 
// licensed under CCv3.0: http://creativecommons.org/licenses/by/3.0/

var utils = _dereq_('./utils')

/* This acts as a ordered binary heap for any serializeable JS object or collection of such objects */
var BinaryHeap = module.exports = function BinaryHeap(scoreFunction){
  this.content = [];
  this.scoreFunction = scoreFunction;
}

BinaryHeap.prototype = {

  clone: function() {
    var heap = new BinaryHeap(this.scoreFunction);
    // A little hacky, but effective.
    heap.content = JSON.parse(JSON.stringify(this.content));
    return heap;
  },

  push: function(element) {
    // Add the new element to the end of the array.
    this.content.push(element);
    // Allow it to bubble up.
    this.bubbleUp(this.content.length - 1);
  },

  peek: function() {
    return this.content[0];
  },

  pop: function() {
    // Store the first element so we can return it later.
    var result = this.content[0];
    // Get the element at the end of the array.
    var end = this.content.pop();
    // If there are any elements left, put the end element at the
    // start, and let it sink down.
    if (this.content.length > 0) {
      this.content[0] = end;
      this.sinkDown(0);
    }
    return result;
  },

  remove: function(node) {
    var len = this.content.length;
    // To remove a value, we must search through the array to find
    // it.
    for (var i = 0; i < len; i++) {
      if (this.content[i] == node) {
        // When it is found, the process seen in 'pop' is repeated
        // to fill up the hole.
        var end = this.content.pop();
        if (i != len - 1) {
          this.content[i] = end;
          if (this.scoreFunction(end) < this.scoreFunction(node))
            this.bubbleUp(i);
          else
            this.sinkDown(i);
        }
        return true;
      }
    }
    throw new Error("Node not found.");
  },

  size: function() {
    return this.content.length;
  },

  bubbleUp: function(n) {
    // Fetch the element that has to be moved.
    var element = this.content[n];
    // When at 0, an element can not go up any further.
    while (n > 0) {
      // Compute the parent element's index, and fetch it.
      var parentN = Math.floor((n + 1) / 2) - 1,
          parent = this.content[parentN];
      // Swap the elements if the parent is greater.
      if (this.scoreFunction(element) < this.scoreFunction(parent)) {
        this.content[parentN] = element;
        this.content[n] = parent;
        // Update 'n' to continue at the new position.
        n = parentN;
      }
      // Found a parent that is less, no need to move it further.
      else {
        break;
      }
    }
  },

  sinkDown: function(n) {
    // Look up the target element and its score.
    var length = this.content.length,
        element = this.content[n],
        elemScore = this.scoreFunction(element);

    while(true) {
      // Compute the indices of the child elements.
      var child2N = (n + 1) * 2, child1N = child2N - 1;
      // This is used to store the new position of the element,
      // if any.
      var swap = null;
      // If the first child exists (is inside the array)...
      if (child1N < length) {
        // Look it up and compute its score.
        var child1 = this.content[child1N],
            child1Score = this.scoreFunction(child1);
        // If the score is less than our element's, we need to swap.
        if (child1Score < elemScore)
          swap = child1N;
      }
      // Do the same checks for the other child.
      if (child2N < length) {
        var child2 = this.content[child2N],
            child2Score = this.scoreFunction(child2);
        if (child2Score < (swap == null ? elemScore : child1Score))
          swap = child2N;
      }

      // If the element needs to be moved, swap it, and continue.
      if (swap != null) {
        this.content[n] = this.content[swap];
        this.content[swap] = element;
        n = swap;
      }
      // Otherwise, we are done.
      else {
        break;
      }
    }
  }
};


},{"./utils":3}],3:[function(_dereq_,module,exports){
/*
/*
 * Mix in the properties on an object to another object
 * utils.mixin(target, source, [source,] [source, etc.] [merge-flag]);
 * 'merge' recurses, to merge object sub-properties together instead
 * of just overwriting with the source object.
 */
exports.mixin = (function () {  
  var _mix = function (targ, src, merge) {
    for (var p in src) {
      // Don't copy stuff from the prototype
      if (src.hasOwnProperty(p)) {
        if (merge &&
            // Assumes the source property is an Object you can
            // actually recurse down into
            (typeof src[p] == 'object') &&
            (src[p] !== null) &&
            !(src[p] instanceof Array)) {
          // Create the source property if it doesn't exist
          // TODO: What if it's something weird like a String or Number?
          if (typeof targ[p] == 'undefined') {
            targ[p] = {};
          }
          _mix(targ[p], src[p], merge); // Recurse
        }
        // If it's not a merge-copy, just set and forget
        else {
          targ[p] = src[p];
        }
      }
    }
  };

  return function () {
    var args = Array.prototype.slice.apply(arguments),
        merge = false,
        targ, sources;
    if (args.length > 2) {
      if (typeof args[args.length - 1] == 'boolean') {
        merge = args.pop();
      }
    }
    targ = args.shift();
    sources = args; 
    for (var i = 0, ii = sources.length; i < ii; i++) {
      _mix(targ, sources[i], merge);
    }
    return targ;
  };
})();


},{}],4:[function(_dereq_,module,exports){
/*
*  A simple counter object
*/

/* JavaScript uses double-precision FP for all numeric types.  
 * Perhaps someday we'll have native 64-bit integers that can safely be
 * transported via JSON without additional code, but not today. */
var MAX_COUNTER_VALUE = Math.pow(2, 32); // 4294967296

var Counter = module.exports = function Counter() {
  this.count = 0;
  this.type = 'counter';
}

Counter.prototype.inc = function(val) {
  if (!val) { val = 1; }
  this.count += val;
  // Wrap counter if necessary.
  if (this.count > MAX_COUNTER_VALUE) {
    this.count -= (MAX_COUNTER_VALUE + 1);
  }
}

Counter.prototype.dec = function(val) {
  if (!val) { val = 1; }
  this.count -= val;
  // Prevent counter from being decremented below zero.
  if (this.count < 0) {
    this.count = 0;
  }
}

Counter.prototype.clear = function() {
  this.count = 0;
}

Counter.prototype.printObj = function() {
  return {type: 'counter', count: this.count};
}

},{}],5:[function(_dereq_,module,exports){
var EDS = _dereq_('../stats/exponentially_decaying_sample')
  , UniformSample = _dereq_('../stats/uniform_sample');

var DEFAULT_PERCENTILES = [0.001, 0.01, 0.05, 0.1, 0.25, 0.5, 0.75, 0.9, 0.95, 0.98, 0.99, 0.999];

/*
* A histogram tracks the distribution of items, given a sample type 
*/
var Histogram = module.exports = function Histogram(sample) {
  this.sample = sample || new EDS(1028, 0.015);
  this.min = null;
  this.max = null;
  this.sum = null;
  // These are for the Welford algorithm for calculating running variance
  // without floating-point doom.
  this.varianceM = null;
  this.varianceS = null;
  this.count = 0;
  this.type = 'histogram';
}

Histogram.prototype.clear = function() {
  this.sample.clear();
  this.min = null;
  this.max = null;
  this.sum = null;
  this.varianceM = null;
  this.varianceS = null;
  this.count = 0;
}

// timestamp param primarily used for testing
Histogram.prototype.update = function(val, timestamp) {
  this.count++;
  this.sample.update(val, timestamp);
  if (this.max === null) {
    this.max = val;
  } else {
    this.max = val > this.max ? val : this.max;
  }
  if (this.min === null) {
    this.min = val;
  } else {
    this.min = val < this.min ? val : this.min;
  }
  this.sum = (this.sum === null) ? val : this.sum + val;
  this.updateVariance(val);
}

Histogram.prototype.updateVariance = function(val) {
  var oldVM = this.varianceM
    , oldVS = this.varianceS;
  if (this.count == 1) {
    this.varianceM = val;
  } else {
    this.varianceM = oldVM + (val - oldVM) / this.count;
    this.varianceS = oldVS + (val - oldVM) * (val - this.varianceM);
  }
}

// Pass an array of percentiles, e.g. [0.5, 0.75, 0.9, 0.99]
Histogram.prototype.percentiles = function(percentiles) {
  if (!percentiles) {
    percentiles = DEFAULT_PERCENTILES;
  }
  var values = this.sample.getValues().map(function(v){ return parseFloat(v);}).sort(function(a,b){ return a-b;})
    , scores = {}
    , percentile
    , pos
    , lower
    , upper;
  for (var i = 0; i < percentiles.length; i++) {
    pos = percentiles[i] * (values.length + 1);
    percentile = percentiles[i];
    if (pos < 1) { scores[percentile] = values[0]; }
    else if (pos >= values.length) { scores[percentile] = values[values.length - 1]; }
    else {
      lower = values[Math.floor(pos) - 1];
      upper = values[Math.ceil(pos) - 1];
      scores[percentile] = lower + (pos - Math.floor(pos)) * (upper - lower);
    }
  }
  return scores;
}

Histogram.prototype.variance = function() {
  return this.count < 1 ? null : this.varianceS / (this.count - 1);
}

Histogram.prototype.mean = function() {
  return this.count == 0 ? null : this.varianceM;
}

Histogram.prototype.stdDev = function() {
  return this.count < 1 ? null : Math.sqrt(this.variance());
}

Histogram.prototype.values = function() {
  return this.sample.getValues();
}

Histogram.prototype.printObj = function() {
  var percentiles = this.percentiles();
  return {
      type: 'histogram'
    , min: this.min
    , max: this.max
    , sum: this.sum
    , variance: this.variance()
    , mean: this.mean()
    , std_dev: this.stdDev()
    , count: this.count
    , median: percentiles[0.5]
    , p75: percentiles[0.75]
    , p95: percentiles[0.95]
    , p99: percentiles[0.99]
    , p999: percentiles[0.999]};
}

module.exports.createExponentialDecayHistogram = function(size, alpha) { return new Histogram(new EDS((size || 1028), (alpha || 0.015))); };
module.exports.createUniformHistogram = function(size) { return new Histogram(new UniformSample((size || 1028))); };
module.exports.DEFAULT_PERCENTILES = DEFAULT_PERCENTILES;

},{"../stats/exponentially_decaying_sample":10,"../stats/uniform_sample":13}],6:[function(_dereq_,module,exports){

exports.Counter = _dereq_('./counter');
exports.Histogram = _dereq_('./histogram');
exports.Meter = _dereq_('./meter');
exports.Timer = _dereq_('./timer');


},{"./counter":4,"./histogram":5,"./meter":7,"./timer":8}],7:[function(_dereq_,module,exports){
var EWMA = _dereq_('../stats/exponentially_weighted_moving_average.js');
/*
*  
*/
var Meter = module.exports = function Meter() {
  this.m1Rate = EWMA.createM1EWMA();
  this.m5Rate = EWMA.createM5EWMA();
  this.m15Rate = EWMA.createM15EWMA();
  this.count = 0;
  this.startTime = (new Date).getTime();
  this.type = 'meter';
}

// Mark the occurence of n events
Meter.prototype.mark = function(n) {
  if (!n) { n = 1; }
  this.count += n;
  this.m1Rate.update(n);
  this.m5Rate.update(n);
  this.m15Rate.update(n);
}

Meter.prototype.rates = function() {
  return {1: this.oneMinuteRate()
      , 5: this.fiveMinuteRate()
      , 15: this.fifteenMinuteRate()
      , mean: this.meanRate()};
}

// Rates are per second
Meter.prototype.fifteenMinuteRate = function() {
  return this.m15Rate.rate();
}

Meter.prototype.fiveMinuteRate = function() {
  return this.m5Rate.rate();
}

Meter.prototype.oneMinuteRate = function() {
  return this.m1Rate.rate();
}

Meter.prototype.meanRate = function() {
  return this.count / ((new Date).getTime() - this.startTime) * 1000;
}

Meter.prototype.printObj = function() {
  return {type: 'meter'
      , count: this.count
      , m1: this.oneMinuteRate()
      , m5: this.fiveMinuteRate()
      , m15: this.fifteenMinuteRate()
      , mean: this.meanRate()
      , unit: 'seconds'};
}

Meter.prototype.tick = function(){
  this.m1Rate.tick();
  this.m5Rate.tick();
  this.m15Rate.tick();
}

},{"../stats/exponentially_weighted_moving_average.js":11}],8:[function(_dereq_,module,exports){
var Meter = _dereq_('./meter');
Histogram = _dereq_('./histogram')
ExponentiallyDecayingSample = _dereq_('../stats/exponentially_decaying_sample');
/*
*  Basically a timer tracks the rate of events and histograms the durations
*/
var Timer = module.exports = function Timer() {
  this.meter = new Meter();
  this.histogram = new Histogram(new ExponentiallyDecayingSample(1028, 0.015));
  this.clear();
  this.type = 'timer';
}

Timer.prototype.update = function(duration) {
  this.histogram.update(duration);
  this.meter.mark();
}

// delegate these to histogram
Timer.prototype.clear = function() { return this.histogram.clear(); }
Timer.prototype.count = function() { return this.histogram.count; }
Timer.prototype.min = function() { return this.histogram.min; }
Timer.prototype.max = function() { return this.histogram.max; }
Timer.prototype.mean = function() { return this.histogram.mean(); }
Timer.prototype.stdDev = function() { return this.histogram.stdDev(); }
Timer.prototype.percentiles = function(percentiles) { return this.histogram.percentiles(percentiles); }
Timer.prototype.values = function() { return this.histogram.values(); }

// delegate these to meter
Timer.prototype.oneMinuteRate = function() { return this.meter.oneMinuteRate(); }
Timer.prototype.fiveMinuteRate = function() { return this.meter.fiveMinuteRate(); }
Timer.prototype.fifteenMinuteRate = function() { return this.meter.fifteenMinuteRate(); }
Timer.prototype.meanRate = function() { return this.meter.meanRate(); }
Timer.prototype.tick = function() { this.meter.tick(); } // primarily for testing

Timer.prototype.printObj = function() {
  return {type: 'timer'
      , duration: this.histogram.printObj()
      , rate: this.meter.printObj()};
}


},{"../stats/exponentially_decaying_sample":10,"./histogram":5,"./meter":7}],9:[function(_dereq_,module,exports){
/**
* trackedMetrics is an object with eventTypes as keys and metrics object as values.
*/

var _evtparse = function (eventName){
  var namespaces = eventName.split('.')
    , name = namespaces.pop()
    , namespace = namespaces.join('.');

  return {
    ns: namespace
  , name: name
  }
}

var Report = module.exports = function (trackedMetrics){
  this.trackedMetrics = trackedMetrics || {};
}

Report.prototype.addMetric = function(eventName, metric) {
  var parts = _evtparse(eventName);

  if (!this.trackedMetrics[parts.ns]) {
    this.trackedMetrics[parts.ns] = {};
  }
  if(!this.trackedMetrics[parts.ns][parts.name]) {
    this.trackedMetrics[parts.ns][parts.name] = metric;
  }
}

Report.prototype.getMetric = function (eventName){
  var parts = _evtparse(eventName);
  if (!this.trackedMetrics[parts.ns]){ return; }
  return this.trackedMetrics[parts.ns][parts.name];
}

Report.prototype.summary = function (){
  var metricsObj = {};
  for (namespace in this.trackedMetrics) {
    metricsObj[namespace] = {};
    for (name in this.trackedMetrics[namespace]) {
      metricsObj[namespace][name] = this.trackedMetrics[namespace][name].printObj();
    }
  }
  return metricsObj;
}

},{}],10:[function(_dereq_,module,exports){
var Sample = _dereq_('./sample')
  , BinaryHeap = _dereq_('../lib/binary_heap');

/*
 *  Take an exponentially decaying sample of size size of all values
 */
var RESCALE_THRESHOLD = 60 * 60 * 1000; // 1 hour in milliseconds

var ExponentiallyDecayingSample = module.exports = function ExponentiallyDecayingSample(size, alpha) {
  this.limit = size;
  this.alpha = alpha;
  this.clear();
}

ExponentiallyDecayingSample.prototype = new Sample();

// This is a relatively expensive operation
ExponentiallyDecayingSample.prototype.getValues = function() {
  var values = []
    , heap = this.values.clone();
  while(elt = heap.pop()) {
    values.push(elt.val);
  }
  return values;
}

ExponentiallyDecayingSample.prototype.size = function() {
  return this.values.size();
}

ExponentiallyDecayingSample.prototype.newHeap = function() {
  return new BinaryHeap(function(obj){return obj.priority;});
}

ExponentiallyDecayingSample.prototype.now = function() {
  return (new Date()).getTime();
}

ExponentiallyDecayingSample.prototype.tick = function() {
  return this.now() / 1000;
}

ExponentiallyDecayingSample.prototype.clear = function() {
  this.values = this.newHeap();
  this.count = 0;
  this.startTime = this.tick();
  this.nextScaleTime = this.now() + RESCALE_THRESHOLD;
}

/*
* timestamp in milliseconds
*/
ExponentiallyDecayingSample.prototype.update = function(val, timestamp) {
  // Convert timestamp to seconds
  if (timestamp == undefined) {
    timestamp = this.tick();
  } else {
    timestamp = timestamp / 1000;
  }
  var priority = this.weight(timestamp - this.startTime) / Math.random()
    , value = {val: val, priority: priority};
  if (this.count < this.limit) {
    this.count += 1;
    this.values.push(value);
  } else {
    var first = this.values.peek();
    if (first.priority < priority) {
      this.values.push(value);
      this.values.pop();
    }
  }

  if (this.now() > this.nextScaleTime) {
    this.rescale(this.now(), this.nextScaleTime);
  }
}

ExponentiallyDecayingSample.prototype.weight = function(time) {
  return Math.exp(this.alpha * time);
}

// now: parameter primarily used for testing rescales
ExponentiallyDecayingSample.prototype.rescale = function(now) {
  this.nextScaleTime = this.now() + RESCALE_THRESHOLD;
  var oldContent = this.values.content
    , newContent = []
    , elt
    , oldStartTime = this.startTime;
  this.startTime = (now && now / 1000) || this.tick();
  // Downscale every priority by the same factor. Order is unaffected, which is why we're avoiding the cost of popping.
  for(var i = 0; i < oldContent.length; i++) {
    newContent.push({val: oldContent[i].val, priority: oldContent[i].priority * Math.exp(-this.alpha * (this.startTime - oldStartTime))});
  }
  this.values.content = newContent;
}

},{"../lib/binary_heap":2,"./sample":12}],11:[function(_dereq_,module,exports){
/*
 *  Exponentially weighted moving average.
 *  Args: 
 *  - alpha:
 *  - interval: time in milliseconds
 */

var M1_ALPHA = 1 - Math.exp(-5/60);
var M5_ALPHA = 1 - Math.exp(-5/60/5);
var M15_ALPHA = 1 - Math.exp(-5/60/15);

var ExponentiallyWeightedMovingAverage = EWMA = module.exports = function ExponentiallyWeightedMovingAverage(alpha, interval) {
  var self = this;
  this.alpha = alpha;
  this.interval = interval || 5000;
  this.initialized = false;
  this.currentRate = 0.0;
  this.uncounted = 0;
  if (interval) {
    this.tickInterval = setInterval(function(){ self.tick(); }, interval);

    // Don't keep the process open if this is the last thing in the event loop.
    if(this.tickInterval.unref && ({}).toString.call(this.tickInterval.unref) === '[object Function]') {
      this.tickInterval.unref();
    }
  }
}

ExponentiallyWeightedMovingAverage.prototype.update = function(n) {
  this.uncounted += (n || 1);
}

/*
 * Update our rate measurements every interval
 */
ExponentiallyWeightedMovingAverage.prototype.tick = function() {
  var  instantRate = this.uncounted / this.interval;
  this.uncounted = 0;
  
  if(this.initialized) {
    this.currentRate += this.alpha * (instantRate - this.currentRate);
  } else {
    this.currentRate = instantRate;
    this.initialized = true;
  }
}

/*
 * Return the rate per second
 */
ExponentiallyWeightedMovingAverage.prototype.rate = function() {
  return this.currentRate * 1000;
}

ExponentiallyWeightedMovingAverage.prototype.stop = function() {
  clearInterval(this.tickInterval);
}

module.exports.createM1EWMA = function(){ return new EWMA(M1_ALPHA, 5000); }
module.exports.createM5EWMA = function(){ return new EWMA(M5_ALPHA, 5000); }
module.exports.createM15EWMA = function(){ return new EWMA(M15_ALPHA, 5000); }

},{}],12:[function(_dereq_,module,exports){
var Sample = module.exports = function Sample() {
  this.values = [];
  this.count = 0;
}
var Sample = module.exports = function Sample() {}
Sample.prototype.init = function(){ this.clear(); }
Sample.prototype.update = function(val){ this.values.push(val); };
Sample.prototype.clear = function(){ this.values = []; this.count = 0; };
Sample.prototype.size = function(){ return this.values.length;};
Sample.prototype.print = function(){console.log(this.values);}
Sample.prototype.getValues = function(){ return this.values; }


},{}],13:[function(_dereq_,module,exports){
var utils = _dereq_('../lib/utils');
var Sample = _dereq_('./sample');

/*
 *  Take a uniform sample of size size for all values
 */
var UniformSample = module.exports = function UniformSample(size) {
  this.limit = size;
  this.count = 0;
  this.init();
}

UniformSample.prototype = new Sample();

UniformSample.prototype.update = function(val) {
  this.count++;
  if (this.size() < this.limit) {
    //console.log("Adding "+val+" to values.");
    this.values.push(val);
  } else {
    var rand = parseInt(Math.random() * this.count);
    if (rand < this.limit) {
      this.values[rand] = val;
    }
  }
}

},{"../lib/utils":3,"./sample":12}]},{},[1])
(1)
});
/*! vissense - v0.0.1 - 2014-06-18
* Copyright (c) 2014 tbk;*/
/*! vissense - v0.0.1 - 2014-06-18
* Copyright (c) 2014 tbk;*/
/*! vissense - v0.0.1 - 2014-06-18
* Copyright (c) 2014 tbk;*/
;(function (global) {
    "use strict";

    var lastId = -1;

    // Visibility.js allow you to know, that your web page is in the background
    // tab and thus not visible to the user. This library is wrap under
    // Page Visibility API. It fix problems with different vendor prefixes and
    // add high-level useful functions.
    var self = {

        // Call callback only when page become to visible for user or
        // call it now if page is visible now or Page Visibility API
        // doesn’t supported.
        //
        // Return false if API isn’t supported, true if page is already visible
        // or listener ID (you can use it in `unbind` method) if page isn’t
        // visible now.
        //
        //   Visibility.onVisible(function () {
        //       startIntroAnimation();
        //   });
        onVisible: function (callback) {
            var support = self.isSupported();
            if ( !support || !self.hidden() ) {
                callback();
                return support;
            }

            var listener = self.change(function (e, state) {
                if ( !self.hidden() ) {
                    self.unbind(listener);
                    callback();
                }
            });
            return listener;
        },

        // Call callback when visibility will be changed. First argument for
        // callback will be original event object, second will be visibility
        // state name.
        //
        // Return listener ID to unbind listener by `unbind` method.
        //
        // If Page Visibility API doesn’t supported method will be return false
        // and callback never will be called.
        //
        //   Visibility.change(function(e, state) {
        //       Statistics.visibilityChange(state);
        //   });
        //
        // It is just proxy to `visibilitychange` event, but use vendor prefix.
        change: function (callback) {
            if ( !self.isSupported() ) {
                return false;
            }
            lastId += 1;
            var number = lastId;
            self._callbacks[number] = callback;
            self._listen();
            return number;
        },

        // Remove `change` listener by it ID.
        //
        //   var id = Visibility.change(function(e, state) {
        //       firstChangeCallback();
        //       Visibility.unbind(id);
        //   });
        unbind: function (id) {
            delete self._callbacks[id];
        },

        // Call `callback` in any state, expect “prerender”. If current state
        // is “prerender” it will wait until state will be changed.
        // If Page Visibility API doesn’t supported, it will call `callback`
        // immediately.
        //
        // Return false if API isn’t supported, true if page is already after
        // prerendering or listener ID (you can use it in `unbind` method)
        // if page is prerended now.
        //
        //   Visibility.afterPrerendering(function () {
        //       Statistics.countVisitor();
        //   });
        afterPrerendering: function (callback) {
            var support   = self.isSupported();
            var prerender = 'prerender';

            if ( !support || prerender != self.state() ) {
                callback();
                return support;
            }

            var listener = self.change(function (e, state) {
                if ( prerender != state ) {
                    self.unbind(listener);
                    callback();
                }
            });
            return listener;
        },

        // Return true if page now isn’t visible to user.
        //
        //   if ( !Visibility.hidden() ) {
        //       VideoPlayer.play();
        //   }
        //
        // It is just proxy to `document.hidden`, but use vendor prefix.
        hidden: function () {
            return !!(self._doc.hidden || self._doc.webkitHidden);
        },

        // Return visibility state: 'visible', 'hidden' or 'prerender'.
        //
        //   if ( 'prerender' == Visibility.state() ) {
        //       Statistics.pageIsPrerendering();
        //   }
        //
        // Don’t use `Visibility.state()` to detect, is page visible, because
        // visibility states can extend in next API versions.
        // Use more simpler and general `Visibility.hidden()` for this cases.
        //
        // It is just proxy to `document.visibilityState`, but use
        // vendor prefix.
        state: function () {
            return self._doc.visibilityState       ||
                   self._doc.webkitVisibilityState ||
                   'visible';
        },

        // Return true if browser support Page Visibility API.
        //
        //   if ( Visibility.isSupported() ) {
        //       Statistics.startTrackingVisibility();
        //       Visibility.change(function(e, state)) {
        //           Statistics.trackVisibility(state);
        //       });
        //   }
        isSupported: function () {
            return !!(self._doc.visibilityState ||
                      self._doc.webkitVisibilityState);
        },

        // Link to document object to change it in tests.
        _doc: document || {},

        // Callbacks from `change` method, that wait visibility changes.
        _callbacks: { },

        // Listener for `visibilitychange` event.
        _change: function(event) {
            var state = self.state();

            for ( var i in self._callbacks ) {
                self._callbacks[i].call(self._doc, event, state);
            }
        },

        // Set listener for `visibilitychange` event.
        _listen: function () {
            if ( self._init ) {
                return;
            }

            var event = 'visibilitychange';
            if ( self._doc.webkitVisibilityState ) {
                event = 'webkit' + event;
            }

            var listener = function () {
                self._change.apply(self, arguments);
            };
            if ( self._doc.addEventListener ) {
                self._doc.addEventListener(event, listener);
            } else {
                self._doc.attachEvent(event, listener);
            }
            self._init = true;
        }

    };

    if ( typeof(module) != 'undefined' && module.exports ) {
        module.exports = self;
    } else {
        global.Visibility = self;
    }

})(this);

;(function(/*window*/) {
  'use strict';
    // @href https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/now
    if (!Date.now) {
       Date.now = function now() {
         return new Date().getTime();
       };
    }

    // @href https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
    if (!Object.keys) {
      Object.keys = (function () {
        var hasOwnProperty = Object.prototype.hasOwnProperty,
            hasDontEnumBug = !({toString: null}).propertyIsEnumerable('toString'),
            dontEnums = [
              'toString',
              'toLocaleString',
              'valueOf',
              'hasOwnProperty',
              'isPrototypeOf',
              'propertyIsEnumerable',
              'constructor'
            ],
            dontEnumsLength = dontEnums.length;

        return function (obj) {
          if (typeof obj !== 'object' && (typeof obj !== 'function' || obj === null)) {
            throw new TypeError('Object.keys called on non-object');
          }

          var result = [], prop, i;

          for (prop in obj) {
            if (hasOwnProperty.call(obj, prop)) {
              result.push(prop);
            }
          }

          if (hasDontEnumBug) {
            for (i = 0; i < dontEnumsLength; i++) {
              if (hasOwnProperty.call(obj, dontEnums[i])) {
                result.push(dontEnums[i]);
              }
            }
          }
          return result;
        };
      }());
    }

}.call(this, this));
;(function(window, undefined) {
  'use strict';

    function _window(element) {
		var doc = element.ownerDocument;
		return 'defaultView' in doc ? doc.defaultView : doc.parentWindow;
	}

    function fireIf (when, callback) {
      return function () {
        if (when()) {
          return callback();
        }
      };
    }

    window.VisSenseUtils = {
        _window : _window,
        fireIf: fireIf
    };

}.call(this, this));
/**
 * depends on ['vissense.utils']
 */
 ;(function(window, VisSenseUtils, undefined) {
  'use strict';

  /*--------------------------------------------------------------------------*/

  function extend(object, source, callback) {
    var index = -1,
        props = Object.keys(source),
        length = props.length;

    while (++index < length) {
      var key = props[index];
      object[key] = callback ? callback(object[key], source[key], key, object, source) : source[key];
    }

    return object;
  }

  function noop() {
  }

  function identity(i) {
    return i;
  }

  function now() {
      return new Date().getTime();
  }

  function defer(callback) {
      return window.setTimeout(function() {
          callback();
      }, 1);
  }

  function isObject(obj) {
    return obj === Object(obj);
  }

  function defaults(obj, source) {
    if (!isObject(obj)) {
        return obj;
    }

    for (var prop in Object.keys(source)) {
      if (obj[prop] === void 0) {
        obj[prop] = source[prop];
      }
    }
    return obj;
  }

  VisSenseUtils = extend(VisSenseUtils, {
    noop:noop,
    identity:identity,
    isObject:isObject,
    defaults:defaults,
    extend:extend,
    now:now,
    defer:defer
  });

}.call(this, this, this.VisSenseUtils));
/**
 * depends on ['vissense.utils']
 */
 ;(function(window, VisSenseUtils) {
    'use strict';
    /*--------------------------------------------------------------------------*/
    // http://dustindiaz.com/rock-solid-addevent
    var EventCache = (function () {
        var listEvents = [];
        var remove = function(i) {
            var item = listEvents[i];
            if(!!item[0] && !!item[1] && !!item[2]) {
                if (item[0].removeEventListener) {
                    item[0].removeEventListener(item[1], item[2], item[3]);
                } else if (item[0].detachEvent) {
                    item[0].detachEvent('on' + item[1], item[2]);
                    item[0][item[1]+item[2]] = null;
                    item[0]['e'+item[1]+item[2]] = null;
                }
            }
            return item;
        };
        return {
            listEvents: listEvents,
            add: function(/*node, sEventName, fHandler*/) {
                listEvents.push(arguments);
                return listEvents.length - 1;
            },
            remove: remove,
            flush: function() {
                var i;
                for (i = listEvents.length - 1; i >= 0; i = i - 1) {
                    remove(i);
                }
            }
        };
    })();

    function addEvent(obj, type, fn) {
        var t = (type === 'DOMContentLoaded') ? 'readystatechange' : type;
        if (obj.addEventListener) {
            obj.addEventListener(type, fn, false);
            return EventCache.add(obj, type, fn);
        } else if (obj.attachEvent) {
            obj['e' + t + fn] = fn;
            obj[t + fn] = function () {
                obj['e' + t + fn].call(obj, window.event);
            };
            obj.attachEvent('on' + t, obj[t + fn]);
            return EventCache.add(obj, t, fn);
        }
        return -1;
    }

    // flush all remaining events
    addEvent(window, 'unload', EventCache.flush);

    VisSenseUtils.addEvent = addEvent;

}.call(this, this, this.VisSenseUtils));
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
/**
 * Exports following functions to VisSenseUtils
 *
 * findEffectiveStyle
 * findEffectiveStyleProperty
 * isDisplayed
 * isVisibleByStyling
 * isHiddenInputElement
 */
;(function(window, VisSenseUtils, undefined) {
  'use strict';
    function _isVisibleByOffsetParentCheck(element) {
        // https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement.offsetParent
        if(!element.offsetParent) {
            var position = findEffectiveStyleProperty(element, 'position');
            if(position !== 'fixed') {
                return false;
            }
        }
        return true;
    }

    function isHiddenInputElement(element) {
        if (element.tagName && String(element.tagName).toLowerCase() === 'input') {
            return element.type && String(element.type).toLowerCase() === 'hidden';
        }
        return false;
    }

	function findEffectiveStyle(element) {
		var w = VisSenseUtils._window(element);

		if (typeof element.style === 'undefined') {
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
	}

	function findEffectiveStyleProperty(element, property) {
		var effectiveStyle = findEffectiveStyle(element);
		if(!effectiveStyle) {
		    return undefined;
		}
		var propertyValue = effectiveStyle[property];
		if (propertyValue === 'inherit' && element.parentNode.style) {
			return findEffectiveStyleProperty(element.parentNode, property);
		}
		return propertyValue;
	}

	function isDisplayed(element) {
		var display = findEffectiveStyleProperty(element, 'display');
		if (display === 'none') {
			return false;
		}
		if (element.parentNode.style) {
			return isDisplayed(element.parentNode);
		}
		return true;
	}

    function isVisibleByStyling(element) {
        if (element === VisSenseUtils._window(element).document) {
            return true;
        }

        if (!element || !element.parentNode){
            return false;
        }

        if(!_isVisibleByOffsetParentCheck(element)) {
            return false;
        }

        var displayed = isDisplayed(element);
        if(displayed !== true) {
            return false;
        }

        var opacity = findEffectiveStyleProperty(element, 'opacity');
        if(+opacity < 0.01) {
            return false;
        }

        var visibility = findEffectiveStyleProperty(element, 'visibility');
        if(visibility === 'hidden' || visibility === 'collapse') {
            return false;
        }

        if(isHiddenInputElement(element)) {
            return false;
        }

        return true;
    }

    (function(target) {
        target.isHiddenInputElement = isHiddenInputElement;
        target.findEffectiveStyle = findEffectiveStyle;
        target.findEffectiveStyleProperty = findEffectiveStyleProperty;
        target.isDisplayed = isDisplayed;
        target.isVisibleByStyling = isVisibleByStyling;
    }(VisSenseUtils));
}.call(this, this, this.VisSenseUtils));
/**
 * Exports following functions to VisSenseUtils
 *
 * viewportHeight
 * viewportWidth
 * isFullyInViewport
 * isInViewport
 * _getBoundingClientRect
 */
;(function(window, VisSenseUtils) {
  'use strict';

	function _getBoundingClientRect(element) {
		var r = element.getBoundingClientRect();
		// height and width are not standard elements - so lets add them
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
	}

    function viewport(element) {
		var w = VisSenseUtils._window(element);
		return {
		    height: w.innerHeight || w.document.documentElement.clientHeight,
		    width: w.innerWidth || w.document.documentElement.clientWidth
		};
	}

	function isFullyInViewport(element) {
		var r = _getBoundingClientRect(element);
		if(r && (r.width <= 0 || r.height <= 0)) {
			return false;
		}
		var view = viewport(element);

		return (!!r &&
			r.top >= 0 &&
			r.left >= 0 &&
			r.bottom < view.height &&
			r.right < view.width
		);
	}

	function isInViewport(element) {
		var r = _getBoundingClientRect(element);
		if(r && (r.width <= 0 || r.height <= 0)) {
			return false;
		}
		var view = viewport(element);
		return ( !!r &&
			r.bottom > 0 &&
			r.right > 0 &&
			r.top < view.height &&
			r.left < view.width
		);
	}

    VisSenseUtils.viewport = viewport;
    VisSenseUtils.isFullyInViewport = isFullyInViewport;
    VisSenseUtils.isInViewport = isInViewport;
    VisSenseUtils._getBoundingClientRect = _getBoundingClientRect;

}.call(this, this, this.VisSenseUtils));
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
           return !!VisSenseUtils.findEffectiveStyle(document.getElementsByTagName('body')[0]);
          } catch(e) {}
          return false;
        }

        var support = {};
        support.MinIEVersion = 7;
        support.PageVisibilityAPIAvailable = VisSenseUtils.isPageVisibilityAPIAvailable();
        support.IEVersion = getIEVersion();
        support.DOMPresent = isDomPresent();
        support.CanReadStyle = canReadStyle();
        support.BrowserSupported = support.IEVersion >= support.MinIEVersion;

        support.compatible = support.DOMPresent && support.CanReadStyle && support.BrowserSupported;

        return support;
    }(window, window.document));

    VisSenseUtils.support = function() {
        return support;
    };

}.call(this, this, this.VisSenseUtils));
;(function(window, Math, VisSenseUtils, undefined) {
  'use strict';

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
     * visElement.getVisibilityPercentage();
     * // => 0.93
     *
     */
    function VisSense(element, config) {
        if (!(this instanceof VisSense)) {
            return new VisSense(element, config);
        }

        // currently only ELEMENT_NODEs are supported
        // see https://developer.mozilla.org/en-US/docs/Web/API/Node.nodeType
        if ( !element || 1 !== element.nodeType ) {
            throw new Error('InvalidArgument: not an element node');
        }

        this._element = element;
        this._config = config || {};
    }

    /* @category Position -------------------------------------------------------*/

    VisSense.prototype.isInViewport = function() {
      return VisSenseUtils.isInViewport(this._element);
    };

    VisSense.prototype.isFullyInViewport = function() {
      return VisSenseUtils.isFullyInViewport(this._element);
    };

    VisSense.prototype.getVisibilityPercentage = function() {
      return VisSenseUtils.getVisibilityPercentage(this._element);
    };

    VisSense.prototype.viewport = function() {
      return VisSenseUtils.viewport(this._element);
    };

    /*--------------------------------------------------------------------------*/

    VisSense.prototype.isDisplayed = function() {
      return VisSenseUtils.isDisplayed(this._element);
    };

    VisSense.prototype.isVisibleByStyling = function() {
      return VisSenseUtils.isVisibleByStyling(this._element);
    };

    /*--------------------------------------------------------------------------*/

    VisSense.prototype.isFullyVisible = function() {
      return VisSenseUtils.isFullyVisible(this._element);
    };

    VisSense.prototype.isVisible = function() {
      return VisSenseUtils.isVisible(this._element);
    };

    VisSense.prototype.isHidden = function() {
      return VisSenseUtils.isHidden(this._element);
    };

    /*--------------------------------------------------------------------------*/

    VisSense.prototype.fireIfFullyVisible = function(callback) {
      return VisSenseUtils.fireIfElementFullyVisible(this._element, callback);
    };

    VisSense.prototype.fireIfVisible = function(callback) {
      return VisSenseUtils.fireIfVisible(this._element, callback);
    };

    VisSense.prototype.fireIfHidden = function (callback) {
        return VisSenseUtils.fireIfHidden(this._element, callback);
    };

    /*--------------------------------------------------------------------------*/

	VisSense.prototype.getFullyVisibleThreshold = VisSenseUtils.noop;

  /*--------------------------------------------------------------------------*/

  // export VisSense
  window.VisSense = VisSense;

}.call(this, this, this.Math, this.VisSenseUtils));
/**
 * detects visibility changes of an element.
 *
 * example:
 * var elem = document.getElementById('myElement');
 * var visobj = VisSense(eleme):
 * var vismon = visobj.monitor();
 *
 * vismon.onVisibilityChange(function() { ... });
 * vismon.onVisibilityPercentageChange(function() { ... });
 * vismon.onVisible(function() { ... });
 * vismon.onFullyVisible(function() { ... });
 * vismon.onHidden(function() { ... });
 *
 *
 * hasVisibilityChanged() // => true
 * hasVisibilityPercentageChanged // => true
 *
 * fireIfVisibilityChanged(function() { ... });
 * fireIfVisibilityPercentageChanged(function() { ... });
 *
 */
;(function(window, Math, VisSense, VisSenseUtils, undefined) {
  'use strict';
    /*--------------------------------------------------------------------------*/

    var VisState = (function() {
        var STATES = {
            HIDDEN: 0,
            VISIBLE: 1,
            FULLY_VISIBLE: 2
        };

        function VisState(state) {
            this.isVisible = function() {
                return state ===  STATES.VISIBLE || this.isFullyVisible();
            };
            this.isFullyVisible = function() {
                return state ===  STATES.FULLY_VISIBLE;
            };
            this.isHidden = function() {
                return state ===  STATES.HIDDEN;
            };
            this.state = function() {
                return state;
            };
        }

        function withPrevious(visstate, prev) {
            if(!!prev) {
                // disable getting previous state from prev
                prev.prev = VisSenseUtils.noop;
            }

            visstate.wasVisible = function() {
                return !!prev && prev.isVisible();
            };

            visstate.wasFullyVisible = function() {
                return !!prev && prev.isFullyVisible();
            };

            visstate.wasHidden = function() {
                return !!prev && prev.isHidden();
            };

            visstate.hasVisibilityChanged = function() {
                return !prev || visstate.state() !== prev.state();
            };

            visstate.prev = function() {
                return prev;
            };

            return visstate;
        }

        function withPercentage(visstate, percentage) {
            visstate.hasVisibilityPercentageChanged = function() {
                return !this.prev() || percentage !== this.prev().percentage();
            };
            visstate.percentage = function() {
                return percentage;
            };
            return visstate;
        }

        function state(status, percentage, prev) {
            return withPrevious(withPercentage(new VisState(status), percentage), prev);
        }

        var exports = {};

        exports.hidden = function(percentage, prev) {
            return state(STATES.HIDDEN, percentage, prev || null);
        };

        exports.visible = function(percentage, prev) {
            return state(STATES.VISIBLE, percentage, prev || null);
        };
        exports.fullyvisible = function(percentage, prev) {
            return state(STATES.FULLY_VISIBLE, percentage, prev || null);
        };

        return exports;
    }());

    function nextState(visobj, visstate) {
        var percentage = visobj.getVisibilityPercentage();

        if(visobj.isHidden()) {
            return VisState.hidden(percentage, visstate);
        }
        else if (visobj.isFullyVisible()) {
             return VisState.fullyvisible(percentage, visstate);
        }
        else if (visobj.isVisible()) {
          return VisState.visible(percentage, visstate);
        }

        throw new Error('IllegalState');
    }

    /*--------------------------------------------------------------------------*/

    function fireListeners(listeners, context) {
        for(var i in listeners) {
            if(listeners.hasOwnProperty(i)) {
                listeners[i].call(context || window);
            }
        }
    }
    /*--------------------------------------------------------------------------*/


    function VisMon(visobj) {
        var me = this;

        var lastListenerId = -1;
        var _private = {
          status: null,
          listeners: []
        };

        // read-only access to VisSense instance
        me.visobj = function() {
            return visobj;
        };

        /**
        * read-only access to status
        */
        me.status = function() {
            return _private.status;
        };

        me.getVisibilityPercentage = function() {
            return me.status().percentage();
        };
        /**
        * read-only access to status
        */
        me.prev = function() {
            return me.status().prev();
        };

        // Adds a listener.
        //
        // var id = visobj.monitor().register(function() {
        //   doSomething();
        // });
        me.register = function(callback) {
            //var lastListenerId = lastListenerId + 1;
            //_private.listeners[lastListenerId] = callback;
            _private.listeners[++lastListenerId] = callback;
            return lastListenerId;
        };

        /**
        * expose update method
        */
        me.update = function() {
            _private.status = nextState(visobj, _private.status);

            // notify listeners
            fireListeners(_private.listeners, me);
        };
    }

    VisSense.monitor = function monitor(visobj, config) {
        return new VisMon(visobj, config || {});
    };

    VisSense.prototype.monitor = function(config) {
        return VisSense.monitor(this, config);
    };


    /**
    * Returns a function that invokes callback only
    * if the visibility state changes.
    *
    * shorthand for
    * if(visobj.hasVisibilityChanged()) {
    *   callback();
    * }
    * visobj.fireIfVisibilityChanged(callback)
    */
    VisMon.prototype.fireIfVisibilityChanged = function(callback) {
        var me = this;
        return VisSenseUtils.fireIf(function() {
            return me.status().hasVisibilityChanged();
        }, callback);
    };

    /**
    * Returns a function that invokes callback only
    * if visibility rate changes.
    * This does not occur when element is hidden but may
    * be called multiple times if element is in state
    * `VISIBLE` and (depending on the config) `FULLY_VISIBLE`
    */
    VisMon.prototype.fireIfVisibilityPercentageChanged = function(callback) {
        var me = this;
        return VisSenseUtils.fireIf(function() {
            return me.status().hasVisibilityPercentageChanged();
        }, callback);
    };

    /**
    * Fires when visibility state changes
    */
    VisMon.prototype.onVisibilityChange = function (callback) {
        return this.register(this.fireIfVisibilityChanged(callback));
    };

    /**
    * Fires when visibility percentage changes
    */
    VisMon.prototype.onVisibilityPercentageChange = function (callback) {
        return this.register(this.fireIfVisibilityPercentageChanged(callback));
    };

    /**
    * Fires when visibility changes and and state transits from:
    * HIDDEN => VISIBLE
    * HIDDEN => FULLY_VISIBLE
    * Fires NOT when state transits from:
    * VISIBLE => FULLY_VISIBLE or
    * FULLY_VISIBLE => VISIBLE
    *
    * VisSense(document.getElementById('example1')).monitor().onVisible(function() {
    *   Animations.startAnimation();
    * });
    */
    VisMon.prototype.onVisible = function (callback) {
        var me = this;

        var fireIfVisible =  VisSenseUtils.fireIf(function() {
            return me.status().isVisible();
        }, callback);

        // only fire when coming from state hidden or no previous state is present
        var handler = this.fireIfVisibilityChanged(VisSenseUtils.fireIf(function() {
            return !me.status().prev() || me.status().wasHidden();
        }, fireIfVisible));
        return this.register(handler);
    };

    /**
    * Fires when visibility changes and element becomes fully visible
    */
    VisMon.prototype.onFullyVisible = function (callback) {
        var me = this;
        var fireIfFullyVisible =  VisSenseUtils.fireIf(function() {
            return me.status().isFullyVisible();
        }, callback);

        var handler = this.fireIfVisibilityChanged(fireIfFullyVisible);
        return this.register(handler);
    };

    /**
    * Fires when visibility changes and element becomes hidden
    */
    VisMon.prototype.onHidden = function (callback) {
        var me = this;

        var fireIfHidden =  VisSenseUtils.fireIf(function() {
            return me.status().isHidden();
        }, callback);

        var handler = this.fireIfVisibilityChanged(fireIfHidden);
        return this.register(handler);
    };

    VisMon.prototype.on = function(eventName, handler) {
        var emitEvents = {
            'hidden' : this.onHidden,
            'visible' : this.onVisible,
            'fullyvisible' : this.onFullyVisible,
            'percentagechange' : this.onVisibilityPercentageChange,
            'visibilitychange' : this.onVisibilityChange
        };

        if(!emitEvents[eventName]) {
            throw new Error('VisMon: Event "'+ eventName +'" is not supported');
        }

        return emitEvents[eventName](handler);
    };

}.call(this, this, this.Math, this.VisSense, this.VisSenseUtils));
/*
 * depends on ['vissense.core', 'vissense.monitor']
 */
;(function(window, VisSense, VisSenseUtils, undefined) {
    'use strict';

    // Stop timer from `every` method by it’s ID.
    function cancel(timer) {
        clearInterval(timer.id);
        clearTimeout(timer.delay);
        delete timer.id;
        delete timer.delay;
    }

    function run(timer, interval, runNow) {
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
    }
    /*--------------------------------------------------------------------------*/

    function VisTimer(vismon) {
        var me = this;

        var lastTimerId = -1;
        var _private = {
            timers: {},
            initialized: false
        };

        me.vismon = function() {
            return vismon;
        };

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
        VisTimer.prototype.every = function (interval, hiddenInterval, callback, runNow) {
            if (!callback) {
                callback = hiddenInterval;
                hiddenInterval = null;
            }

            lastTimerId += 1;
            var number = lastTimerId;

            _private.timers[number] = {
                visible:  interval,
                hidden:   hiddenInterval,
                callback: callback
            };
            _run(number, !runNow);

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
        VisTimer.prototype.stop = function(id) {
            if ( !_private.timers[id] ) {
                return false;
            }
            _cancel(id);
            delete _private.timers[id];
            return true;
        };

        VisTimer.prototype.stopAll = function() {
            for (var id in _private.timers) {
                if(_private.timers.hasOwnProperty(id)) {
                    _cancel(id);
                }
            }
            _private.timers = [];
        };

        // Try to run timer from every method by it’s ID. It will be use
        // `interval` or `hiddenInterval` depending on visibility state.
        // If page is hidden and `hiddenInterval` is null,
        // it will not run timer.
        //
        // Argument `runNow` say, that timers must be execute now too.
        function _run(id, runNow) {
            var interval, timer = _private.timers[id];

            if (vismon.status().isHidden()) {
                if ( null === timer.hidden ) {
                    return;
                }
                interval = timer.hidden;
            } else {
                interval = timer.visible;
            }

            run(timer, interval, runNow);
        }


        function _cancel(id) {
            cancel(_private.timers[id]);
        }


        function cancelAndReinitialize() {
            var isHidden = vismon.status().isHidden();
            var wasHidden = vismon.status().wasHidden();

            if ( (isHidden && !wasHidden) || (!isHidden && wasHidden) ) {
                for (var id in _private.timers) {
                    if(_private.timers.hasOwnProperty(id)) {
                        _cancel(id);

                        var reinitializeImmediatelyOnHidden = true;
                        _run(id, !isHidden ? true : reinitializeImmediatelyOnHidden);
                    }
                }
            }
        }

        (function init() {
            var triggerVisMonUpdate = function() {
                vismon.update();
            };

            (function initVisMonUpdateStrategy() {
                var updateTriggerEvents = ['readystatechange', 'scroll', 'resize'];

                // react on tab changes
                VisSenseUtils.onPageVisibilityChange(triggerVisMonUpdate);

                for(var i in updateTriggerEvents) {
                    if(updateTriggerEvents.hasOwnProperty(i)) {
                        VisSenseUtils.addEvent(window, updateTriggerEvents[i], triggerVisMonUpdate);
                    }
                }

                // triggers update if mouse moves over element
                // this is important if the element is draggable
                VisSenseUtils.addEvent(vismon.visobj()._element, 'mousemove', triggerVisMonUpdate);
            }());

            vismon.onVisible(function() {
              cancelAndReinitialize();
            });

            vismon.onHidden(function() {
              cancelAndReinitialize();
            });

            vismon.update();

            VisSenseUtils.defer(function() {
                cancelAndReinitialize();
                // reschedule update immediately
                VisSenseUtils.defer(triggerVisMonUpdate);
            });

            // check for other changes periodically
            // e.g. if accordion expands on page
            // or if dynamic content is added
            me.every(100, 100, triggerVisMonUpdate);
        }());
    }

    function newVisTimer(vissense, config) {
        return new VisTimer(vissense.monitor(), config || {});
    }

    VisSense.timer = newVisTimer;

    VisSense.prototype.timer = function(config) {
        return newVisTimer(this, config);
    };

}.call(this, this, this.VisSense, this.VisSenseUtils));
/**
 * depends on ['vissense.utils']
 */
 ;(function(window, VisSenseUtils) {
  'use strict';

    // Date.now polyfill
    if (!Date.now) {
       Date.now = function now() {
         return new Date().getTime();
       };
    }

    // performance.now polyfill
    (function (window) {
      window.performance = window.performance || {};
      // handle vendor prefixing
      window.performance.now = window.performance.now ||
      window.performance.mozNow ||
      window.performance.msNow ||
      window.performance.oNow ||
      window.performance.webkitNow ||
      Date.now;  // fallback to Date
    })(window);

    var StopWatch = (function(window) {
        var getNow = (function(window) {
            return function(performance) {
                  return performance ? window.performance.now : Date.now;
             };
        } (window));

        function StopWatch(performance) {
            var me = this;

            var $ = {
                ts : 0, // time start
                te : 0, // time end
                r : false // currently running
            };

            var now = me.now = getNow(performance);

            me.start = function(optNow) {
                $.r = true;
                $.ts = +optNow || now();
                return 0;
            };
            me.restart = function(optNow) {
                return me.stopAndRestartIf(true, optNow);
            };

            me.stop = function (optNow) {
                return me.stopIf($.r, optNow);
            };
            me.running = function () {
                return $.r;
            };

            me.stopIf = function (condition, optNow) {
                var t = me.time(optNow);
                if(condition) {
                    $.r = false;
                }
                return t;
            };

            me.time = function (optNow) {
                if (!$.r) {
                    return 0;
                } else {
                    $.te = +optNow || now();
                }

                return $.te - $.ts;
            };

            /**
            * Does neither stop nor restart if condition is false
            */
            me.stopAndRestartIf = function(condition, optNow) {
                return !condition ? 0 : me.stopAndThenRestartIf(true, optNow);
            };

            /**
            * Definitely stops, but restart only if condition is true
            */
            me.stopAndThenRestartIf = function(condition, optNow) {
                var r = me.stop(optNow);
                if(condition) {
                    me.start(optNow);
                }
                return r;
            };
        }

        StopWatch.now = function(performance) {
            return getNow(performance)();
        };

        return StopWatch;
    }(window));

    VisSenseUtils.newStopWatch = function() {
        return new StopWatch();
    };

}.call(this, this, this.VisSenseUtils));
/**
 * depends on ['vissense.core', 'vissense.utils', 'vissense.monitor', 'vissense.timer', 'vissense.stopwatch']
 */
 ;(function(window, VisSense, VisSenseUtils, brwsrfyMetrics, undefined) {
  'use strict';

    var DEFAULT_CONFIG = {
        visibleUpdateInterval: 200,
        hiddenUpdateInterval: 200,
        updatePercentageOnPageHidden:false
    };

    var parseConfig = function(config) {
        if(!!config) {
            if(config.visibleUpdateInterval < 1 || config.hiddenUpdateInterval < 1) {
                throw new Error('InvalidArgument: update interval needs to be positive.');
            }
        }

        return VisSenseUtils.defaults(config, DEFAULT_CONFIG);
    };

    function fireIfPositive(value, callback) {
        if(value > 0) {
            callback(value);
        }
    }

    /*--------------------------------------------------------------------------*/


    function VisMetrics(vistimer, inConfig) {
        var me = this;
        var stopped = false;
        var config = parseConfig(inConfig);
        var report = new brwsrfyMetrics.Report();

        var watchVisible = VisSenseUtils.newStopWatch();
        var watchFullyVisible = VisSenseUtils.newStopWatch();
        var watchHidden = VisSenseUtils.newStopWatch();
        var watchDuration = VisSenseUtils.newStopWatch();

        /* Counter */
        report.addMetric('time.visible', new brwsrfyMetrics.Counter());
        report.addMetric('time.fullyvisible', new brwsrfyMetrics.Counter());
        report.addMetric('time.hidden', new brwsrfyMetrics.Counter());
        report.addMetric('time.relativeVisible', new brwsrfyMetrics.Counter());
        report.addMetric('time.duration', new brwsrfyMetrics.Counter());

        /* Timer */
        report.addMetric('visibility.changes', new brwsrfyMetrics.Timer());
        // percentage histogram (only updates if page is visible)
        report.addMetric('percentage', new brwsrfyMetrics.Timer());
        
        updatePercentage();

        updateVisibilityChanges();

        vistimer.vismon().onVisibilityPercentageChange(function() {
            if(stopped) {
                return;
            }

            updatePercentage();
            stopAndUpdateTimers(vistimer.vismon());
        });

        vistimer.vismon().onVisibilityChange(function() {
            if(stopped || !VisSenseUtils.isPageVisible()) {
                return;
            }

            updateVisibilityChanges();
        });

        vistimer.every(config.visibleUpdateInterval, config.hiddenUpdateInterval, function() {
            if(stopped || !VisSenseUtils.isPageVisible()) {
                return;
            }

            updatePercentage();
            stopAndUpdateTimers(vistimer.vismon());
        });

        me.getMetric = function(name) {
            return report.getMetric(name);
        };

        me.summary = function() {
            return report.summary();
        };

        me.stopped = function() {
            return stopped;
        };

        me.stop = function() {
            updatePercentage();
            stopAndUpdateTimers(vistimer.vismon());

            vistimer.stopAll();
            return stopped = true;
        };

        /**
        * Updates the percentage metrics (e.g. the ´mean´ visibility percentage)
        *
        * Does not update if the page is currently not visible!
        * This would impact the validity of the result because some
        * browsers only allow a maximum interval time of 1 second
        * when the target tab is hidden.
        */
        function updatePercentage() {
            if(!config.updatePercentageOnPageHidden && !VisSenseUtils.isPageVisible()) {
                return;
            }

            var percentage = vistimer.vismon().status().percentage();
            report.getMetric('percentage').update(percentage);
        }

        function updateVisibilityChanges() {
            var state = vistimer.vismon().status().state();

            report.getMetric('visibility.changes').update(state);
        }

        function stopAndUpdateTimers(vismon) {
            var status = vismon.status();
            var timeVisible = watchVisible.stopAndThenRestartIf(status.isVisible());

            fireIfPositive(timeVisible, function(value) {
                report.getMetric('time.visible').inc(value);
                report.getMetric('time.relativeVisible').inc(value * status.percentage());
            });

            fireIfPositive(watchFullyVisible.stopAndThenRestartIf(status.isFullyVisible()), function(value) {
                report.getMetric('time.fullyvisible').inc(value);
            });
            fireIfPositive(watchHidden.stopAndThenRestartIf(status.isHidden()), function(value) {
                report.getMetric('time.hidden').inc(value);
            });
            fireIfPositive(watchDuration.restart(), function(value) {
                report.getMetric('time.duration').inc(value);
            });
        }
    }

    function newVisMetrics(vissense, config) {
        return new VisMetrics(vissense.timer(), config);
    }

    VisSense.metrics = newVisMetrics;
    VisSense.prototype.metrics = function(config) {
        return newVisMetrics(this, config);
    };


}.call(this, this, this.VisSense, this.VisSenseUtils, this.brwsrfyMetrics));
;(function(window, VisSense, VisSenseUtils, undefined) {
  'use strict';

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

  (function() {

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

  } ());

}.call(this, this, this.VisSense, this.VisSenseUtils));