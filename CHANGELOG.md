# Change Log
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).
See [Keep A Changelog](https://github.com/olivierlacan/keep-a-changelog) 
before changing this file!

## [Unreleased][unreleased]
### Removed
- removed deprecated method `VisMon.use`

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

[unreleased]: https://github.com/vissense/vissense/compare/0.4.0...HEAD
[0.4.0]: https://github.com/vissense/vissense/compare/0.3.0...0.4.0
[0.3.0]: https://github.com/vissense/vissense/compare/0.2.1...0.3.0
