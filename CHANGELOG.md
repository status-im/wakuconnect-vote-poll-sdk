# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.4.0] - 2022-01-20

### Fixed

- Contract ABI in core package.

## [0.3.0] - 2022-01-12

- Add `examples/mainnet-poll` to demonstrate the usage of the published library, outside yarn's workspace.
- **Breaking Change on smart contract ABI**: Vote SDK - Rename `voting room` to `proposal` and improve smart contract documentation.

## [0.2.0] - 2022-01-03

### Fixed

- Upgrades: `ethers@5.4.6`, `ethereum-waffle@3.4.0`,`@usedapp/core@0.5.5` to ensure there are no conflicting version of
  ethers in the codebase.

### [0.1.0] - 2021-12-23

- Initial release.

[Unreleased]: https://github.com/status-im/js-waku/compare/v0.4.0...HEAD
[0.4.0]: https://github.com/status-im/js-waku/compare/v0.3.0...v0.4.0
[0.3.0]: https://github.com/status-im/js-waku/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/status-im/js-waku/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/status-im/js-waku/compare/bce7cf74f07f673643da6152a707215bdc8369af...v0.1.0
