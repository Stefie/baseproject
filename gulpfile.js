const gulp = require('gulp'),
del = require('del'),
pug = require('gulp-pug2'),
stylus = require('gulp-stylus'),
sourcemaps = require('gulp-sourcemaps'),
image = require('gulp-image'),
nib = require('nib'),
concat = require('gulp-concat'),
browserSync = require('browser-sync').create();

/** Paths **/
const rootPatterns = './app/patterns/',
rootJS = './app/js/',
rootStyles = './app/styles/',
rootAssets = './app/assets/',
rootPages = './app/patterns/04-pages/',
rootPublic = './docs/';

// Compile CSS with stylus
gulp.task('compile:styl', function() {
	return gulp.src([
		rootStyles + 'includes.styl',
		rootPatterns + '**/**/*.styl'
	])
	.pipe(concat('app.styl'))
	.pipe(sourcemaps.init())
	.pipe(stylus({
		'resolve url': true,
		import: ['nib'],
		use: nib()
	}))
	.pipe(sourcemaps.write())
	.pipe(gulp.dest(rootPublic + 'css/'))
	.pipe(browserSync.reload({
		stream: true
	}));
});

// Compile html with pug
gulp.task('compile:pug', function buildHTML() {
	return gulp.src(rootPages + '*.pug')
	.pipe(pug({basedir: __dirname + '/app'}))
	.pipe(gulp.dest(rootPublic))
	.pipe(browserSync.reload({
		stream: true
	}));
});

// Compile Javascript
gulp.task('compile:js', function() {
	var aframe = gulp.src([
		rootJS + 'aframe/aframe.min.js',
		rootJS + 'aframe/kframe.min.js',
		rootJS + 'fonts/*.typeface.js'
		])
		.pipe(gulp.dest(rootPublic + 'js'));
	var appjs = gulp.src([
		rootJS + 'plugins/*.js',
		rootJS + 'app.js'
		])
		.pipe(gulp.dest(rootPublic + 'js'));
	return (aframe, appjs);
});

// compile images
gulp.task('compile:assets', function () {
	gulp.src(rootAssets + '**/*')
	.pipe(image({
		pngquant: false,
		optipng: false,
		zopflipng: false,
		jpegRecompress: false,
		jpegoptim: false,
		mozjpeg: false,
		gifsicle: false,
		svgo: false,
		concurrent: 10
	}))
	.pipe(gulp.dest(rootPublic));
});

// Watch task
gulp.task('app:watch', ['app:browserSync', 'compile:styl'], function() {
	gulp.watch([rootStyles + '**/*.styl', rootStyles + '*.styl',  rootPatterns + '**/**/*.styl'], ['compile:styl']),
	gulp.watch([rootPatterns + '**/**/*.pug', rootPages + '*.pug'], ['compile:pug']);
	gulp.watch([rootJS + 'app.js', rootJS + '**/*.js'], browserSync.reload); ;
});

// Browser Sync - reload browser on change
gulp.task('app:browserSync', function() {
	browserSync.init({
		server: {
			baseDir: 'docs',
			index: "index.html"
		},
	})
})