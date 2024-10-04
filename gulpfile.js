const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const reload = browserSync.reload;
const $ = require('gulp-load-plugins')();
const del = require('del');
const historyApiFallback = require('connect-history-api-fallback');
const gulpDartSass = require('gulp-dart-sass'); // Use gulp-dart-sass

// Task to serve the application
function serve() {
  browserSync.init({
    server: {
      baseDir: "./",
      middleware: [historyApiFallback()]
    }
  });
}

// Minify CSS
function minifycss() {
  return gulp.src(['./styles/static/**/*.css', '!./styles/**/*.min.css'])
    .pipe($.rename({suffix: '.min'}))
    .pipe($.minifyCss({keepBreaks: true}))
    .pipe(gulp.dest('./_build/css/'))
    .pipe(browserSync.stream());
}

// Minify JS
function minifyjs() {
  return gulp.src('js/*.js')
    .pipe($.uglify())
    .pipe(gulp.dest('./_build/'));
}

// Reload all Browsers
function bsreload() {
  browserSync.reload();
}

// Clean build directory
async function cleanbuild() {
  const deletedFiles = await del(['./_build/']);
  return Promise.resolve(deletedFiles);
}

// Sass build task 
function sassbuild() {
  return gulp.src('styles/**/*.scss')
    .pipe(gulpDartSass().on('error', gulpDartSass.logError))
    .pipe(gulp.dest('./_build/css/'));
}

// Example images task (replace with your actual image processing)
function images() {
  return gulp.src('images/**/*')
    .pipe(gulp.dest('./_build/images/'));
}

// Example templates, views, usemin, fonts, assets, build:size tasks 
// (replace with your actual implementations)
function templates() {
  return Promise.resolve();
}

function views() {
  return Promise.resolve();
}

function usemin() {
  return Promise.resolve();
}

function fonts() {
  return Promise.resolve();
}

function assets() {
  return Promise.resolve();
}

function buildSize() {
  return Promise.resolve();
}

// Default task
gulp.task('default', gulp.series(serve, gulp.parallel(minifycss, minifyjs), function () {
  gulp.watch('styles/**/*.scss', minifycss);
  gulp.watch(['*.html', 'components/**/*.html', 'views/*.html'], bsreload);
  gulp.watch(['app/*.js', 'components/**/*.js', 'js/*.js'], gulp.series(minifyjs, bsreload));
}));

// Build task
gulp.task('build', gulp.series(
  cleanbuild,
  sassbuild,
  images,
  templates,
  views,
  usemin,
  fonts,
  assets,
  buildSize
));

exports.build = gulp.task('build');
