# Change Log
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).
See [Make A Changelog](https://github.com/olivierlacan/keep-a-changelog) 
before changing this file!

## [Unreleased][unreleased]
### Added
- added `Utils.once`
- added `start` and `stop` events

### Changed
- changed order of `percentagechange` event parameters

### Deprecated
- deprecated `Vismon.on<Event>` - use `Vismon.on('<Event>', ...)` instead
- deprecated `VisMon.use`


## [0.3.0] - 2015-02-08
### Added
- added `Utils.async`
- added `VisMon.startAsync`
- added constructor option `visibilityHooks` to `VisSense`

### Removed
- Removed `VisMon.NoopStrategy`

[unreleased]: https://github.com/vissense/vissense/compare/0.3.0...HEAD
[0.3.0]: https://github.com/vissense/vissense/compare/0.2.1...0.3.0
