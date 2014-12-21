'use strict';

var _           = require('lodash'),
    _s          = require('underscore.string'),
    path        = require('path'),
    cheerio     = require('cheerio');

var util = require('util');

/**
 * default options
 * @type {Object}
 */
var defaultOptions = {
        moreRegExp: /\s*<!--\s*more\s*-->/i,
        stripTags: true,
        pruneLength: 140,
        pruneString: '…'
    };


/**
 * plugin expose function
 * @param  {object} options custom options
 * @return {function}       plugin function
 */
module.exports = function(options) {
    options = _.merge({}, defaultOptions, options);
    return function(files, metalsmith, done){
        setImmediate(done);
        _.forEach(files, function(file, filename){
            if (!isHtml(filename)) {
                return;
            }
            var excerpt = file.excerpt || getExcerptByMoreTag(file, options.moreRegExp) || getExcerptByFirstParagraph(file) || '';
            if (options.stripTags) {
                excerpt = _s.stripTags(excerpt);
                if (options.pruneLength > 0) {
                    excerpt = _s.prune( excerpt, options.pruneLength, options.pruneString);
                }
            }
            file.excerpt = excerpt && excerpt.length>0 ? excerpt : false;
        });
    };
};


/**
 * retrieve excerpt from file object by extracting contents until a 'more' tag
 * @param  {Object} file   file object
 * @param  {RegExp} regExp 'more' tag regexp
 * @return {mixed}         excerpt string or false
 */
function getExcerptByMoreTag(file, regExp) {
    var excerpt = false,
        contents = file.contents.toString(),
        match = contents.search(regExp);
        if (match > -1) {
            excerpt = contents.slice(0, Buffer.byteLength(contents.slice(0, match)));
        }
    return excerpt;
}


/**
 * retrieve excerpt from file object by extracting the first p's contents
 * @param  {Object} file file object
 * @return {mixed}       excerpt string or false
 */
function getExcerptByFirstParagraph(file) {
    var $ = cheerio.load(file.contents.toString()),
        p = $('p').first();
    return p.length ? p.html().trim() : false;
}


/**
 * Check if a filename has an html extension
 * @param  {String}  filename path to check
 * @return {Boolean}          test result
 */
function isHtml(filename){
    return /\.html?/.test(path.extname(filename)) ? true : false;
}
