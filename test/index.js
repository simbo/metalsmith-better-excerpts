'use strict';

var assert     = require('assert'),
    excerpt    = require('..'),
    Metalsmith = require('metalsmith'),
    markdown   = require('metalsmith-markdown');

describe('metalsmith-better-excerpts', function() {

    it('should generate excerpts with default options', function(done) {
        new Metalsmith('test/fixtures/basic')
            .use(markdown())
            .use(excerpt())
            .build(function(err, files) {
                if (err) {
                    return done(err);
                }
                assert.equal(files['index.html'].excerpt, 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod \ntempor incididunt ut labore et dolore magna aliqua. Ut enim ad…');
                done();
            });
    });

    it('should allow setting excerpts in frontmatter', function(done) {
        new Metalsmith('test/fixtures/frontmatter')
            .use(markdown())
            .use(excerpt())
            .build(function(err, files) {
                if (err) {
                    return done(err);
                }
                assert.equal(files['index.html'].excerpt, 'Tokyo rain bridge motion fetishism boat dissident long-chain hydrocarbons  disposable sprawl warehouse cardboard Kowloon neon face forwards…');
                done();
            });
    });

    it('should allow to keep html tags', function(done) {
        new Metalsmith('test/fixtures/basic')
            .use(markdown())
            .use(excerpt({
                stripTags: false
            }))
            .build(function(err, files) {
                if (err) {
                    return done(err);
                }
                assert.equal(files['index.html'].excerpt, 'Lorem <strong>ipsum dolor</strong> <em>sit</em> amet, consectetur adipisicing elit, sed do eiusmod \ntempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, \nquis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo \nconsequat.');
                done();
            });
    });

    it('should allow to override pruneLength and pruneString', function(done) {
        new Metalsmith('test/fixtures/basic')
            .use(markdown())
            .use(excerpt({
                pruneLength: 50,
                pruneString: '[...]'
            }))
            .build(function(err, files) {
                if (err) {
                    return done(err);
                }
                assert.equal(files['index.html'].excerpt, 'Lorem ipsum dolor sit amet, consectetur[...]');
                done();
            });
    });

    it('should not prune if pruneLength is set to 0', function(done) {
        new Metalsmith('test/fixtures/basic')
            .use(markdown())
            .use(excerpt({
                pruneLength: 0
            }))
            .build(function(err, files) {
                if (err) {
                    return done(err);
                }
                assert.equal(files['index.html'].excerpt, 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod \ntempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, \nquis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo \nconsequat.');
                done();
            });
    });

    it('should do nothing when processing non-html files', function(done) {
        new Metalsmith('test/fixtures/basic')
            .use(excerpt())
            .build(function(err, files) {
                if (err) {
                    return done(err);
                }
                assert.equal(undefined, files['index.md'].excerpt);
                done();
            });
    });

    it('should find an excerpt by \'more\' tag, not case-sensitive', function(done) {
        new Metalsmith('test/fixtures/more')
            .use(markdown())
            .use(excerpt())
            .build(function(err, files) {
                if (err) {
                    return done(err);
                }
                assert.equal(files['index.html'].excerpt, 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor \nincididunt ut labore et dolore magna aliqua.\nUt enim ad…');
                done();
            });
    });

    it('should allow to define a custom \'more\' tag', function(done) {
        new Metalsmith('test/fixtures/more-custom')
            .use(markdown())
            .use(excerpt({
                moreRegExp: /\s*<!--\s*excerpt\s*-->/i
            }))
            .build(function(err, files) {
                if (err) {
                    return done(err);
                }
                assert.equal(files['index.html'].excerpt, 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor \nincididunt ut labore et dolore magna aliqua.\nUt enim ad…');
                done();
            });
    });

    it('should set excerpt to false if all generation methods fail', function(done) {
        new Metalsmith('test/fixtures/no-excerpt')
            .use(markdown())
            .use(excerpt())
            .build(function(err, files) {
                if (err) {
                    return done(err);
                }
                assert.equal(files['index.html'].excerpt, false);
                done();
            });
    });

    it('should have no problem special chars', function(done) {
        new Metalsmith('test/fixtures/html-specialchars')
            .use(markdown())
            .use(excerpt())
            .build(function(err, files) {
                if (err) {
                    return done(err);
                }
                assert.equal(files['index.html'].excerpt, 'Lörém ipšüm dõlœr sït āmêt.');
                done();
            });
    });

    it('should have no problem special chars when using \'more\' tag', function(done) {
        new Metalsmith('test/fixtures/html-specialchars-more')
            .use(markdown())
            .use(excerpt())
            .build(function(err, files) {
                if (err) {
                    return done(err);
                }
                assert.equal(files['index.html'].excerpt, 'Lörém ipšüm dõlœr sït āmêt.');
                done();
            });
    });

    it('should have no problem emoji', function(done) {
        new Metalsmith('test/fixtures/html-emoji')
            .use(markdown())
            .use(excerpt())
            .build(function(err, files) {
                if (err) {
                    return done(err);
                }
                assert.equal(files['index.html'].excerpt, '☺️');
                done();
            });
    });

});
