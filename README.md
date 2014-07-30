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


## vistimer
### What it does
 * provides a convenience class for periodically tasks based on elements visibility
 * updates a vismon object every X milliseconds and triggers registered handlers

### What it does *not*
 * being a hundred percent accurate timer. since it updates a vismon object every X milliseconds
   it can callback your handler X milliseconds "too late". if you want an other strategy you must
   provide it yourself (like updating the vismon instance yourself based on user events).