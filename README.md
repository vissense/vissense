[![Build Status](https://api.travis-ci.org/vissense/vissense.png?branch=master)](https://travis-ci.org/vissense/vissense)
[![Coverage Status](https://coveralls.io/repos/vissense/vissense/badge.png)](https://coveralls.io/r/vissense/vissense)
[![Dependency Status](https://david-dm.org/vissense/vissense.svg)](https://david-dm.org/vissense/vissense)
[![devDependency Status](https://david-dm.org/vissense/vissense/dev-status.svg)](https://david-dm.org/vissense/vissense#info=devDependencies)
[![Inline docs](http://inch-ci.org/github/vissense/vissense.svg?branch=master)](http://inch-ci.org/github/vissense/vissense)
![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)

[![Sauce Test Status](https://saucelabs.com/browser-matrix/vissense.svg)](https://saucelabs.com/u/vissense)

VisSense.js
====

A utility library for observing visibility changes of DOM elements.
Immediately know when an element becomes hidden, partly visible or fully visible.

VisSense.js is **lightweight** (<4KB minified and gzipped) and **highly extensible**.
It has **sane default values**, is **tested**, **documented** and **production-ready**. Best of all: **No dependencies**.

#### What it does
 * provides methods for detecting visibility of DOM elements
 * provides a convenience class with straightforward methods like `isHidden`, `isVisible`, `isFullyVisible`, `percentage`
 * provides a convenience class for detecting changes in visibility

#### What it does *not* do (by default)
 * detect if an element is overlapped by others
 * detect if an element is a hidden input element
 * take elements opacity into account
 * take scrollbars into account - elements "hidden" behind scrollbars are considered visible


[Demos](https://vissense.github.io/vissense-demo/) and Examples
------------
See more examples on the [demo page](https://vissense.github.io/vissense-demo/).

In this simple example a video will only be started if at least 75% of its area is in the users viewport:
```javascript
var video = $('#video'); 
var videoVisibility = VisSense(video[0]);

if(videoVisibility.percentage() > 0.75) { 
  video.play();
}
```

In the following example the video will be started if it's at least 75% visible and stopped as soon as it is not visible anymore:
```javascript
var video = $('#video'); 
var visibility = VisSense(video[0], { fullyvisible: 0.75 });

var visibility_monitor = visibility.monitor({
  fullyvisible: function() { 
    video.play();
  }, 
  hidden: function() { 
    video.stop(); 
  }
}).start();
```

[Documentation](https://vissense.github.io/vissense/)
------------
See [vissense.github.io/vissense](https://vissense.github.io/vissense/) or generate the documentation locally.

#### Generate documentation
Clone the repository and run `grunt docs`

Download
------------

### Bower
Install with bower
```
bower install vissense/vissense --save-dev
```

### Github
[Download from Github](https://github.com/vissense/vissense/releases)

Add this `<script>` tag somewhere
```
<script src="/path/to/components/vissense/dist/vissense.min.js"></script>
```


Contribute
------------

- Issue Tracker: https://github.com/vissense/vissense/issues
- Source Code: https://github.com/vissense/vissense

### Clone Repository
`git clone https://github.com/vissense/vissense.git`

#### Install dependencies

`npm install && bower install`

#### Build project

`grunt`

#### Run tests

`grunt test`

or

`grunt serve`

and it automatically opens `http://localhost:3000/SpecRunner.html` in your browser.


API
------------

### VisSense([options])

Object constructor. Options:

- `hidden` (_default: 0_) - if percentage is equal or below this limit the element is considered hidden
- `fullyvisible` (_default: 1_) -  if percentage is equal or above this limit the element is considered fully visible

Note: you can omit `new` keyword when calling `VisSense()`

#### .percentage()

gets the current visible percentage (0..1)


#### .isHidden()

`true` if element is hidden

#### .isVisible()

`true` if element is visible

#### .isFullyVisible()

`true` if element is fully visible

#### .state()

returns an object representing the current state

```javascript
{ 
  "code": 0, 
  "state": "hidden", 
  "percentage": 0, 
  "visible": false, 
  "fullyvisible": false, 
  "hidden": true,
  "previous": {}
}
```

#### .monitor([config])

This is an alias for getting a VisSense.VisMon object observing the current element. 
See the options below for more details.

```javascript
var element = document.getElementById('video');

var visibility_monitor = VisSense(element).monitor({
  visible: function() { 
    console.log('visible');
  }, 
  hidden: function() { 
    console.log('hidden');
  }
}).start();
```

### VisSense.VisMon(visobj, [, options])

Object constructor. Options:

- `strategy` a strategy (or array of strategies) for observing the element. VisSense comes with two predefined strategies. See below.
- `start` function to run when monitoring the element starts
- `stop` function to run when monitoring the element stops
- `update` function to run when elements update function is called
- `hidden` function to run when element becomes hidden
- `visible` function to run when element becomes visible
- `fullyvisible` function to run when element becomes fully visible
- `visibilitychange` function to run when the visibility of the element changes
- `percentagechange` function to run when the percentage of the element changes

```javascript
var visobj = VisSense(document.getElementById('video'));

var visibilityMonitor = VisSense.VisMon(visobj, { 
  strategy: [
    new VisSense.VisMon.Strategy.EventStrategy({ debounce: 42 })
  ],
  visibilitychange: function() { 
    console.log('visibilitychange');
  }, 
  visible: function() { 
    console.log('element became visible');
  }
}).start();
```

##### Strategies
Strategies are hooks which let you intercept the monitoring process.
e.g. updating the monitor, sending custom events, etc.

VisSense comes with two predefined strategies:
  - `PollingStrategy` a simple strategy which invokes `update()` periodically.
  - `EventStrategy` this strategy registers event handlers for `visibilitychange`, `scroll` and `resize` events and calls `update()` accordingly.

A monitor can use any number of strategies. The default monitor uses a combination of `EventStrategy` and `PollingStrategy`. Feel free to write your own strategy to cover your specific requirements (it's super easy).
You can also pass an empty array if you don't want to use any strategy.

#### .start() 
starts observing the element returns `this`

#### .stop() 
stops observing the element

#### .update() 
manually run the update procedure. this will fire all registered hooks accordingly e.g. when a percentage change happened.

#### .state() 
returns a state object

```javascript
{ 
  "code": 1, 
  "state": "visible", 
  "percentage": 0.55, 
  "visible": true, 
  "fullyvisible": false, 
  "hidden": false 
  "previous" : { 
    "code": 2, 
    "state": "fullyvisible", 
    "percentage": 1, 
    "visible": true, 
    "fullyvisible": true, 
    "hidden": false 
  }
} 
```

#### .on(event, hook) 
registers an event hook

```javascript
visibility_monitor.on('percentagechange', function() { ... });
```


##### Builder
There is a builder available if you want to build more complex monitor objects.

```javascript
var visobj = VisSense(document.getElementById('video'));

var visibilityMonitor = VisSense.VisMon.Builder(visobj)
  .strategy(new VisSense.VisMon.Strategy.ConfigurablePollingStrategy({
    hidden: 1000,
    visible: 2000,
    fullyvisible: 5000
  }))
  .strategy(new VisSense.VisMon.Strategy.EventStrategy({ throttle: 200 }))
  .strategy(new VisSense.VisMon.Strategy.UserActivityStrategy({ inactiveAfter: 60000 }))
  .strategy(new VisSense.VisMon.Strategy.PercentageTimeTestEventStrategy('50%/10s', { 
    percentageLimit: 0.5,
    timeLimit: 10000,
    interval: 100
  }))
  .strategy({
    start: function(monitor) {
      setTimeout(function() {
        monitor.publish('mySpecialEvent');
      }, 10000);
    }
  })
  .on('start', function (monitor) {
      console.log('[Visibility Monitor] Started!');
  })
  .on('stop', function (monitor) {
    console.log('[Visibility Monitor] Stopped!');
  })
  .on('visible', function (monitor) {
    console.log('[Visibility Monitor] Element became visible!');
  })
  .on('50%/10s', function (monitor) {
    console.log('[Visibility Monitor] Element was >50% visible for 10 second!');
  })
  .on('mySpecialEvent', function (monitor) {
    console.log('[Visibility Monitor] MySpecialEvent received!');
  })
  .build()
  .startAsync();
```
This example uses external strategies. See [UserActivityStrategy](https://github.com/vissense/vissense-user-activity), [PercentageTimeTestEventStrategy](https://github.com/vissense/vissense-percentage-time-test) and [ConfigurablePollingStrategy](https://github.com/vissense/vissense-configurable-polling-strategy) for more information.


License
-------

The project is licensed under the MIT license. See
[LICENSE](https://github.com/vissense/vissense/blob/master/LICENSE) for details.
