[![Build Status](https://api.travis-ci.org/vissense/vissense.png?branch=master)](https://api.travis-ci.org/vissense/vissense)
[![Coverage Status](https://coveralls.io/repos/vissense/vissense/badge.png)](https://coveralls.io/r/vissense/vissense)

# VisSense.js

A utility library for detecting visibility of DOM element

## Get Started

##### Install dependencies

`npm install && bower install`

##### Build Project

`grunt`

##### Run Tests

`grunt test`

or

`grunt serve`

and open `http://localhost:3000/SpecRunner.html` in your browser.


### What it does
 * provides methods for detecting visibility of DOM elements
 * provides a convenience class for calling isHidden, isVisible, isFullyVisible, percentage
 * provides a convenience class for detecting changes in visibility

### What it does *not*
 * detect if an element is overlapped by others
 * detect if an element is a hidden input element
 * take elements opacity into account
 * take scrollbars into account - elements "hidden" behind scrollbars are considered visible
