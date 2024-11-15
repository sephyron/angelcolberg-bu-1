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
    },
    port: 3000, // You can change the port if needed
    files: [
      './*.html',            // Watch changes in the root
      'components/**/*.html', // Watch changes in components folder
      'views/**/*.html'        // Watch changes in all views, including projects

    ]
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

function minifyHtml() {
  var opts = {
    comments: true,
    spare: true,
    conditionals: true
  };
  gulp.src('./*.html')
    .pipe($.minifyHtml(opts))
    .pipe(gulp.dest('./_build/'));
}


require('events').EventEmitter.prototype._maxListeners = 100;


// Clean build directory
async function cleanbuild() {
  const deletedFiles =  del(['./_build/']);
  return Promise.resolve(deletedFiles);
}


function sassbuild() {
  return gulp.src('styles/**/*.scss')
    .pipe(gulpDartSass().on('error', gulpDartSass.logError))
    .pipe(gulp.dest('./_build/css/'));
}


function images() {
  return gulp.src('images/**/*')
    .pipe(gulp.dest('./_build/images/'));
}

function templates() {
  return gulp.src([
    './**/*.html',
    '!bower_components/**/*.*',
    '!node_modules/**/*.*',
    '!_build/**/*.*'
  ]).pipe(load.minifyHtml())
  .pipe(load.angularTemplatecache({
    module: 'portfolio-app'
  })).pipe(gulp.dest('./_build/js/'));

}

function views() {
  return gulp.src('views/**/*.html')
    .pipe(gulp.dest('./_build/views/'));
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
// Reload all Browsers
function bsreload() {
  return new Promise((resolve) => {
    browserSync.reload;
    resolve();
  });
}
function buildSize() {
  return gulp.src('./_build/**/*')
    .pipe(load.size({
      showFiles: false,
      gzip: false
    }));
}

gulp.task('default', gulp.series(serve, gulp.parallel(minifycss, minifyjs, templates, views, minifyHtml), function () { // Include templates, views, and minifyHtml here
  gulp.watch('styles/**/*.scss', minifycss);
  gulp.watch(['*.html', 'components/**/*.html', 'views/**/*.html'], gulp.series(templates, views, minifyHtml, bsreload)); // Include templates, views, and minifyHtml here
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
  bsreload,
  buildSize
));

exports.build = gulp.task('build');
