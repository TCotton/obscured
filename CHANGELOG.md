# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2025-11-29

### Changed
- **BREAKING**: `obscured.make()` now only accepts primitive values (string, number, boolean, null, undefined, symbol, bigint)
  - Attempting to obscure objects with `make()` will throw a `TypeError`
  - Use `obscured.obscureKeys()` to obscure object properties instead
- Updated `obscureKeys()` to directly create obscured instances, bypassing the primitive-only constraint
- Improved type safety by constraining the `make()` function with a `Primitive` type

### Fixed
- Runtime validation now prevents accidental misuse of `make()` with complex objects
- Clearer API separation between obscuring primitives (`make()`) and object properties (`obscureKeys()`)

### Tests
- Updated test suite to verify `make()` throws error for objects
- Removed obsolete tests for object obscuring with `make()`
- Added test to ensure `obscureKeys()` continues to work with nested objects

## [1.2.0] - 2025-11-29

### Added
- New `isEquivalent` function to compare two obscured values for equivalence
  - Compares the underlying values stored in the registry using strict equality
  - Works with all primitive types (strings, numbers, booleans)
  - Supports object comparison via reference equality
  - Returns `true` if both obscured values exist in the registry and contain equivalent values
- Comprehensive test suite for `isEquivalent` function with 10 test cases covering:
  - String value comparison
  - Number value comparison
  - Boolean value comparison
  - Type safety verification
  - Object reference equality
  - Edge cases for same instance comparison
- Full JSDoc documentation for the `isEquivalent` function with usage examples

### Changed
- Updated package version to 1.2.0