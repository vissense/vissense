[![Build Status](https://api.travis-ci.org/theborakompanioni/vissense.png?branch=master)](https://api.travis-ci.org/theborakompanioni/vissense)

# VisSense.js

A utility library for detecting visibility of DOM element

## Get Started

Install dependencies

`npm install && bower install`

Build Project

`grunt`

Run Tests

Open `SpecRunner.html` in your browser and test with jasmine.
(Run chrome with --disable-web-security to allow local file access)

## utils
### What it does
 * provides methods for detecting visibility of DOM elements

### What it does *not*
 * detect if an element is overlapped by others
 * take scrollbars into account - elements "hidden" behind scrollbars are considered visible
 * detect if the active browser window is off screen
 * detect if element is a hidden input element
   you can really do that yourself. e.g.:

```
#!javascript

function isHiddenInputElement(element) {
   if (element.tagName && String(element.tagName).toLowerCase() === 'input') {
       return element.type && String(element.type).toLowerCase() === 'hidden';
   }
   return false;
}
```

## core
### What it does
 * provides a convenience class for calling isHidden, isVisible, isFullyVisible, percentage

### What it does *not*
* detect if element is overlapped by other content
* parts of elements behind scrollbars are considered visible
* elements opacity has no impact on visibility

##monitor

### What it does
 * provides a convenience class for detecting changes in visibility
 * memoizes current and previous computed results

### What it does *not*
 * update automatically. this is up to you - hence giving you the freedom to decide when
   to trigger updates. here is what this could look like:

```
#!javascript
var element = document.getElementById('my-element');
var vismon = VisSense(element).monitor();

(function initVisMonUpdateStrategy() {
    ['readystatechange', 'scroll', 'resize'].forEach(function(event) {
        window.addEventListener(event, vismon.update);
    });

    // triggers update if mouse moves over element
    // this is important for example if the element is draggable
    element.addEventListener('mousemove', vismon.update);
}());
```
