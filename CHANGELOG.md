# Change Log
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).
See [Keep A Changelog](https://github.com/olivierlacan/keep-a-changelog) 
before changing this file!

## [Unreleased][unreleased]
## [0.8.0] - 2015-04-15
### Added
- added support for defining a VisSense objects reference window
- added function `Utils.createVisibilityApi`
- added method `VisSense.referenceWindow`

## [0.7.0] - 2015-04-13
### Added
- added method `VisMon.publish`
- added `VisMon.Builder`

## [0.6.1] - 2015-03-17
### Fixed
- prevent multiple executions of a throttled function

## [0.6.0] - 2015-03-16
### Added
- added function `Utils.throttle`

### Changed
- adapted EventStrategy to use `Utils.throttle` instead of `Utils.debounce`

### Deprecated
- deprecated EventStrategy option `debounce` - use `throttle` instead

## [0.5.0] - 2015-03-14
### Added
- added function `VisSense.noConflict`

### Removed
- removed deprecated method `VisMon.use`
- removed deprecated method `VisMon.onUpdate` - use `VisMon.on('update', ...)`
- removed deprecated method `VisMon.onHidden` - use `VisMon.on('hidden', ...)`
- removed deprecated method `VisMon.onVisible` - use `VisMon.on('visible', ...)`
- removed deprecated method `VisMon.onFullyVisible` - use `VisMon.on('fullyvisible', ...)`
- removed deprecated method `VisMon.onVisibilityChange` - use `VisMon.on('visibilitychange', ...)`
- removed deprecated method `VisMon.onPercentageChange` - use `VisMon.on('percentagechange', ...)`

### Fixed
- prevent emitting start/stop events if already started/stopped

## [0.4.0] - 2015-03-03
### Added
- added function `Utils.once`
- added method `VisSense.element`
- added method `Strategy.init`
- added `start` and `stop` events to `VisMon`
- added `Utils.VisibilityApi`
- react on `touchmove` events in `VisMon.EventStrategy`

### Changed
- changed order of `percentagechange` event parameters
- listeners on all events (including `*`) are only called once per even
- template methods `Strategy.start` and `Strategy.stop` do not throw an error by default

### Deprecated
- deprecated `Vismon.on<Event>` - use `Vismon.on('<Event>', ...)` instead
- deprecated `VisMon.use`


## [0.3.0] - 2015-02-08
### Added
- added `Utils.async`
- added `VisMon.startAsync`
- added constructor option `visibilityHooks` to `VisSense`

### Removed
- removed `VisMon.NoopStrategy`

[unreleased]: https://github.com/vissense/vissense/compare/0.8.0...HEAD
[0.8.0]: https://github.com/vissense/vissense/compare/0.7.0...0.8.0
[0.7.0]: https://github.com/vissense/vissense/compare/0.6.1...0.7.0
[0.6.1]: https://github.com/vissense/vissense/compare/0.6.0...0.6.1
[0.6.0]: https://github.com/vissense/vissense/compare/0.5.0...0.6.0
[0.5.0]: https://github.com/vissense/vissense/compare/0.4.0...0.5.0
[0.4.0]: https://github.com/vissense/vissense/compare/0.3.0...0.4.0
[0.3.0]: https://github.com/vissense/vissense/compare/0.2.1...0.3.0
