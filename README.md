metalsmith-better-excerpts
==========================

  > A [Metalsmith](https://github.com/segmentio/metalsmith) plugin to
  > extract/generate an excerpt from file content or metadata with multiple
  > options.

[![npm Package Version](https://img.shields.io/npm/v/metalsmith-better-excerpts.svg?style=flat-square)](https://www.npmjs.com/package/metalsmith-better-excerpts)
[![MIT License](http://img.shields.io/:license-mit-blue.svg?style=flat-square)](http://simbo.mit-license.org)
[![Dependencies Status](https://img.shields.io/david/simbo/metalsmith-better-excerpts.svg?style=flat-square)](https://david-dm.org/simbo/metalsmith-better-excerpts)
[![devDependencies Status](https://img.shields.io/david/dev/simbo/metalsmith-better-excerpts.svg?style=flat-square)](https://david-dm.org/simbo/metalsmith-better-excerpts#info=devDependencies)
[![Travis Build Status](https://img.shields.io/travis/simbo/metalsmith-better-excerpts/master.svg?style=flat-square)](https://travis-ci.org/simbo/metalsmith-better-excerpts)
[![Code Climate GPA](https://img.shields.io/codeclimate/github/simbo/metalsmith-better-excerpts.svg?style=flat-square)](https://codeclimate.com/github/simbo/metalsmith-better-excerpts)
[![Code Climate Test Coverage](https://img.shields.io/codeclimate/coverage/github/simbo/metalsmith-better-excerpts.svg?style=flat-square)](https://codeclimate.com/github/simbo/metalsmith-better-excerpts)


## About

***metalsmith-better-excerpts*** will generate an excerpt for each *file* object 
either from frontmatter/metadata, from content until the first `more` tag or 
from the first paragraph in content. So generated excerpt content can be 
additionally parsed by 
[underscore.string](https://github.com/epeli/underscore.string)'s 
`stripTags` and `prune` functions, although `prune` can only be used together 
with `stripTags`.


## Installation

``` sh
$ npm install metalsmith-better-excerpts
```


## CLI Usage

Install via npm and then add the metalsmith-better-excerpts key to your
_metalsmith.json_ with any options you want, like so:

``` json
{
  "plugins": {
    "metalsmith-better-excerpts": {
      "pruneLength": 80
    }
  }
}
```


## Javascript Usage

Pass options to the plugin and pass it to Metalsmith with the use method:

``` javascript
var excerpts = require('metalsmith-better-excerpts');

metalsmith.use(excerpts({
    pruneLength: 80
}));
```


## Options

All options are optional.

Set `pruneLength` to `0` to disable pruning.


### Defaults

``` javascript
var defaultOptions = {
        moreRegExp: /\s*<!--\s*more\s*-->/i,
        stripTags: true,
        pruneLength: 140,
        pruneString: '…'
    };
```
