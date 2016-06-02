# generator-atom-package-plus

[![NPM version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Dependency Status][daviddm-image]][daviddm-url]
[![Coverage percentage](https://coveralls.io/repos/ldez/generator-atom-package-plus/badge.svg)](https://coveralls.io/r/ldez/generator-atom-package-plus)

> A Yeoman generator to build and develop [Atom][atom-url] packages.

![anim](https://cloud.githubusercontent.com/assets/5674651/15632788/08f9bfb6-259d-11e6-8750-212c4a37ce21.gif)

## Description

Generates an Atom packages with:

- [Travis CI](https://travis-ci.org) file already configured.
- [AppVeyor](https://ci.appveyor.com) file already configured.
- [GitHub templates](https://help.github.com/articles/helping-people-contribute-to-your-project/) already defined.

Generates starters for:

- lib
- [spec](http://flight-manual.atom.io/hacking-atom/sections/writing-specs/)
- [grammars](http://flight-manual.atom.io/using-atom/sections/grammar/) (optional)
- [keymaps](http://flight-manual.atom.io/behind-atom/sections/keymaps-in-depth/) (optional)
- menus (optional)
- settings (optional)
- [snippets](http://flight-manual.atom.io/using-atom/sections/snippets/) (optional)
- styles (optional)

## Installation

First, install [Yeoman][yeoman-url] and `generator-atom-package-plus` using [npm](https://www.npmjs.com/) (we assume you have pre-installed [node.js](https://nodejs.org/)).

```bash
npm install -g yo
npm install -g generator-atom-package-plus
```

Then generate your new project:

```bash
yo atom-package-plus
```

## Getting To Know Yeoman

 * Yeoman has a heart of gold.
 * Yeoman is a person with feelings and opinions, but is very easy to work with.
 * Yeoman can be too opinionated at times but is easily convinced not to be.
 * Feel free to [learn more about Yeoman][yeoman-url].

## License

MIT © [Fernandez Ludovic](https://github.com/ldez/)


[npm-image]: https://badge.fury.io/js/generator-atom-package-plus.svg
[npm-url]: https://npmjs.org/package/generator-atom-package-plus
[travis-image]: https://travis-ci.org/ldez/generator-atom-package-plus.svg?branch=master
[travis-url]: https://travis-ci.org/ldez/generator-atom-package-plus
[daviddm-image]: https://david-dm.org/ldez/generator-atom-package-plus.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/ldez/generator-atom-package-plus
[atom-url]: http://atom.io/
[yeoman-url]: http://yeoman.io
