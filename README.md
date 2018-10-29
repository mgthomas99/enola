[github-repository-url]: https://github.com/mgthomas99/enola
[npm-package-url]: http://npmjs.com/package/enola
[npm-package-version-shield-url]: https://img.shields.io/npm/v/enola.svg
[repository-license-shield-url]: https://img.shields.io/github/license/mgthomas99/enola.svg?style=flat-square
[repository-license-url]: https://github.com/mgthomas99/enola/blob/master/LICENSE

# Enola

[![npm][npm-package-version-shield-url]][npm-package-url]
[![GitHub repository license][repository-license-shield-url]][repository-license-url]

Command-line utility for obliterating files and directories as quickly as
possible. It's the equivalent of Linux's `rm -rf` command.

## Usage

```sh
npm install -g enola
```

The above command will use NPM to install Enola globally.

To destroy a file or directory, use the `nuke` command:

```sh
nuke ["path"] [--pretty | -p] [--silent | -s]
```

* **--pretty** will allow the command line utility to use colours when
  outputting text. This is helpful when you want more readable output, but it
  may cause problems when printing to terminals that do not support ANSI colour
  codes. `true` by default.
* **--silent** will mute all error and output streams. `false` by default.

## Build & Test

To build the project, run `npm run build` from the command line. This will
launch a Gulp task which will compile the source files and output the result to
a `build/` directory (which is created if it doesn't already exist).

To run the project's tests, run `npm test` from the command line. The results of
the tests will be outputted to the standard output and error streams.

## License

See the `LICENSE` file for license information.
