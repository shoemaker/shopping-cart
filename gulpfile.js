var _ = require('lodash'),
    gulp = require('gulp'),
    less = require('gulp-less'),
    rename = require('gulp-rename'),
    minifycss = require('gulp-minify-css'),
    header = require('gulp-header'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    del = require('del'),
    mocha = require('gulp-mocha');
var nodemon = require('gulp-nodemon');
var pkg = require('./package.json'),
    bannerTemplate = buildBannerTemplate();


// Configuration

var bases = {
    app: '',
    dist: 'dist/',
};
 
var sources = {
    scripts: ['public/js/**/*.js', '!public/js/**/*.min.js'],
    styles: ['public/css/**/*.less'],
    views: ['views/*'],
    images: ['public/img/*', '!public/img/orig'],
    controllers: ['controllers/**/*'],
    routes: ['routes/**/*'],
    models: ['models/**/*'],
    misc: ['public/*'],
    extras: ['.bowerrc','config.js','server.js','package.json','bower.json'],
};

var targets = {
    tmp: '.tmp/', 
    dist: 'dist/'
};


/**
 * $ gulp prepare
 * Deletes the build/dist directories
 */
gulp.task('prepare', function (cb) {
    del(_.values(targets), cb);
});


/**
 * $ gulp styles
 * Transforms LESS to CSS. 
 * Minifies.
 * Adds a banner. 
 */
gulp.task('styles', ['prepare'], function() {
    gulp.src(sources.styles, {cwd: bases.app})
        .pipe(less({ style: 'expanded' }))
        .pipe(rename({suffix: '.min'}))
        .pipe(minifycss())
        .pipe(header(bannerTemplate, {pkg:pkg}))
        .pipe(gulp.dest(bases.app + 'public/css'))
        .pipe(gulp.dest(bases.dist + 'public/css'));
});


/**
 * $ gulp scripts
 *
 * For js:
 * Lints.
 * Minify/uglify.
 * Adds a banner
 */
gulp.task('scripts', ['prepare'], function() {

    gulp.src(sources.scripts, {cwd: bases.app})
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('default'))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(header(bannerTemplate, {pkg:pkg}))
        .pipe(gulp.dest(bases.app + 'public/js'))
        .pipe(gulp.dest(bases.dist + 'public/js'))
});


/**
 * $ gulp images
 * Copies images. TODO: Why doesn't image minification perform as well as the grunt task? 
 */
gulp.task('images', ['prepare'], function() {
    gulp.src(sources.images, {cwd: bases.app})
        .pipe(imagemin({ optimizationLevel: 7, progressive: true, interlaced: true}))
        .pipe(gulp.dest(bases.dist + 'public/img'));
});


/**
 * $ gulp copy
 * Copy all other files to dist directly.
 */
gulp.task('copy', ['prepare'], function() {
    // Copy views
    gulp.src(sources.views, {cwd: bases.app})
        .pipe(gulp.dest(bases.dist + 'views'));

    // Copy controllers
    gulp.src(sources.controllers, {cwd: bases.app})
        .pipe(gulp.dest(bases.dist + 'controllers'));

    // Copy routes
    gulp.src(sources.routes, {cwd: bases.app})
        .pipe(gulp.dest(bases.dist + 'routes'));

    // Copy models
    gulp.src(sources.models, {cwd: bases.app})
        .pipe(gulp.dest(bases.dist + 'models'));

    // Copy miscellanous public items
    gulp.src(sources.misc, {cwd: bases.app})
        .pipe(gulp.dest(bases.dist + 'public'));

    // Copy Extras
    gulp.src(sources.extras, {cwd: bases.app})
        .pipe(gulp.dest(bases.dist));
 });

/**
 * $ gulp test
 * Runs the tests. 
 * Troubleshooting why gulp-exit does not return once finished. For now, use 'npm test'.
 */
gulp.task('test', function() {
    return gulp.src('test/*.js', {read:false})
        .pipe(mocha({reporter: 'nyan'}));
});


/**
 * $ gulp develop
 * A development task to run anytime a file changes. 
 */
gulp.task('develop', ['build'], function() {
    nodemon({ script: 'server.js', ext: 'js css ejs', ignore: ['dist/*','public/library/*','node_modules/*'], nodeArgs: ['--debug']  })
        .on('start', function() {
            
        })
        .on('restart', function () {
            
        });

    // Setup watch for style changes
    var watchStyles = [];
    _.forEach(sources.styles, function(path) {
        watchStyles.push(bases.app + path);
    });
    gulp.watch(watchStyles, ['styles']);

    // Setup watch for JS changes
    var watchScripts = [];
    _.forEach(sources.scripts, function(path) {
        watchScripts.push(bases.app + path);
    });
    gulp.watch(watchScripts, ['scripts']);
});

/**
 * $ gulp 
 * The default task to build the project
 */
gulp.task('default', ['styles','scripts','images','copy'], function() { });
gulp.task('build', ['default'], function() { });


/* HELPER FUNCTIONS */

function buildBannerTemplate() {
    var now = new Date();
    var today = now.getFullYear() + '-' + (now.getMonth()+1) + '-' + now.getDate();
    return ['/*',
      ' * <%= pkg.name %> v<%= pkg.version %>',
      ' * ' + today,
      ' * Copyright ' + now.getFullYear() + ' <%= pkg.author %>',
      ' */',
      ''].join('\n');
}
