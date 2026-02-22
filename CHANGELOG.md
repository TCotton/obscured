# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html)

## [2.0.6] - 2026-02-15

### Added
- Node.js 24.x support in CI/CD pipeline
  - Updated test matrix to include Node.js 24.x alongside 20.x and 22.x
- Deno runtime setup in GitHub Actions workflow
  - Added `denoland/setup-deno@v2` action with Deno v2.x
- Comprehensive JSDoc documentation for all exported functions
  - Added detailed documentation for `make()`, `value()`, `obscureKeys()`, `isObscured()`, and `isEquivalent()`
  - Includes parameter descriptions, return types, and usage examples

### Changed
- Enhanced TypeScript configuration with stricter type checking rules
  - Added `noImplicitOverride` for better class inheritance safety
  - Added `allowJs` to support JavaScript files
  - Added `resolveJsonModule` for JSON imports
  - Changed target from `esnext` to `es2022` for better compatibility
  - Updated lib to include `es2022`, `dom`, and `dom.iterable`
- Updated publish job in CI/CD to use Node.js 22.x instead of 20.x
- Improved GitHub Actions workflow for NPM publishing with 2FA support

## [2.0.2] - 2025-11-30

### Added
- Bun runtime support for running tests
  - New `test:bun` script to run tests with Bun's runtime
  - Created `vitest.bun.config.ts` configuration file
  - Tests now run in three JavaScript runtimes: Node.js, Browser (Chromium), and Bun
  - Graceful fallback if Bun is not installed (won't break CI/CD)
- GitHub Actions workflow now installs and uses Bun
  - Added `oven-sh/setup-bun@v2` action to CI/CD pipeline
  - Ensures Bun tests run in both test and publish jobs

### Changed
- Updated main `test` script to include all three test environments: `npm run test:node && npm run test:browser && npm run test:bun`
- Enhanced test coverage across multiple JavaScript runtimes for better compatibility assurance

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