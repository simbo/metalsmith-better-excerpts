'use strict';

var _           = require('lodash'),
    _s          = require('underscore.string'),
    match       = require('multimatch'),
    path        = require('path'),
    cheerio     = require('cheerio');

/**
 * default options
 * @type {Object}
 */
var defaultOptions = {
        moreRegExp: /\s*<!--\s*more\s*-->/i,
        stripTags: true,
        pattern: '**/*.html',
        pruneLength: 140,
        pruneString: '…'
    };


/**
 * plugin expose function
 *
 * @param  {Object} options custom options
 * @return {Function}       plugin function
 */
module.exports = function(options) {
    options = _.merge({}, defaultOptions, options);
    return function(files, metalsmith, done) {
        setImmediate(done);
        _.forEach(files, function(file, filename) {
            if (!isMatch(filename, options.pattern)) {
                return;
            }
            var excerpt = file.excerpt ||
                            getExcerptByMoreTag(file, options.moreRegExp) ||
                            getExcerptByFirstParagraph(file) ||
                             '';
            if (options.stripTags) {
                excerpt = _s.stripTags(excerpt);
                if (options.pruneLength > 0) {
                    excerpt = _s.prune(excerpt, options.pruneLength, options.pruneString);
                }
            }
            file.excerpt = excerpt && excerpt.length > 0 ? excerpt : false;
        });
    };
};


/**
 * retrieve excerpt from file object by extracting contents until a 'more' tag
 *
 * @param  {Object} file   file object
 * @param  {RegExp} regExp 'more' tag regexp
 * @return {mixed}         excerpt string or false
 */
function getExcerptByMoreTag(file, regExp) {
    var excerpt = false,
        contents = file.contents.toString();
    contents = cheerio.load('<root>' + contents + '</root>')('root').html();
    var match = contents.search(regExp);
    if (match > -1) {
        excerpt = contents.slice(0, Buffer.byteLength(contents.slice(0, match)));
        excerpt = _s.unescapeHTML(excerpt);
    }
    return excerpt;
}


/**
 * retrieve excerpt from file object by extracting the first p's contents
 *
 * @param  {Object} file file object
 * @return {mixed}       excerpt string or false
 */
function getExcerptByFirstParagraph(file) {
    var $ = cheerio.load(file.contents.toString()),
        p = $('p').first(),
        excerpt = p.length ? p.html().trim() : false;
    if (excerpt) {
        excerpt = _s.unescapeHTML(excerpt);
    }
    return excerpt;
}


/**
 * Check if a filename matches the supplied pattern
 *
 * @param  {String}  filename path to check
 * @param  {String}  pattern  pattern to use for matching
 * @return {Boolean}          test result
 */
function isMatch(filename, pattern) {
    return match(filename, pattern)[0];
}
