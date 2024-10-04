const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const reload = browserSync.reload;
const load = require('gulp-load-plugins')();
const del = require('del');
const historyApiFallback = require('connect-history-api-fallback');
const gulpDartSass = require('gulp-dart-sass');

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
    .pipe(load.rename({suffix: '.min'}))
    .pipe(load.minifyCss({keepBreaks: true}))
    .pipe(gulp.dest('./_build/css/'))
    .pipe(browserSync.stream());
}

// Minify JS
function minifyjs() {
  return gulp.src('js/*.js')
    .pipe(load.uglify())
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
  return gulp.src([
    './**/*.html',
    '!bower_components/**/*.*',
    '!node_modules/**/*.*',
    '!_build/**/*.*'
  ]).pipe(load.minifyHtml())
  .pipe(load.angularTemplatecache({
    module: 'angel2017'
  })).pipe(gulp.dest('./_build/js/'));

}

function views() {
  return Promise.resolve();
}

function usemin() {
  return gulp.src('./index.html')
  // add templates path
  .pipe(load.htmlReplace({
    'templates': '<script type="text/javascript" src="js/templates.js"></script>'
  }))
  .pipe(load.usemin({
    css: [load.minifyCss(), 'concat'],
    libs: [load.uglify()],
    nonangularlibs: [load.uglify()],
    angularlibs: [load.uglify()],
    appcomponents: [load.uglify()],
    mainapp: [load.uglify()]
  }))
  .pipe(gulp.dest('./_build/'));
}

function fonts() {
  return gulp.src('./assets/fonts/**/*.{ttf,woff,eof,eot,svg}').pipe(load.changed('./_build/fonts'))
    .pipe(gulp.dest('./_build/fonts'));
  
}

function assets() {
  return gulp.src('./assets/prototypes/**/*.*').pipe(load.changed('./_build/prototypes'))
    .pipe(gulp.dest('./_build/prototypes'));
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
