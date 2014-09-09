[![Build Status](https://api.travis-ci.org/vissense/vissense.png?branch=master)](https://api.travis-ci.org/vissense/vissense)

# VisSense.js

A utility library for detecting visibility of DOM element

## Get Started

Install dependencies

`npm install && bower install`

Build Project

`grunt`

Run Tests

`grunt connect watch`

Open `http://localhost:3000/SpecRunner.html` in your browser and test with jasmine.


### What it does
 * provides methods for detecting visibility of DOM elements
 * provides a convenience class for calling isHidden, isVisible, isFullyVisible, percentage
 * provides a convenience class for detecting changes in visibility

### What it does *not*
 * detect if an element is overlapped by others
 * take scrollbars into account - elements "hidden" behind scrollbars are considered visible
 * detect if the active browser window is off screen
 * take elements opacity into account
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
