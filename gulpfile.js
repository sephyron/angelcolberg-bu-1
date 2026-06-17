const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const reload = browserSync.reload;
const del = require('del');
const historyApiFallback = require('connect-history-api-fallback');
const gulpDartSass = require('gulp-dart-sass');
const fs = require('fs');
const path = require('path');
const postcss = require('gulp-postcss');
// const purgecss = require('gulp-purgecss');
const cssnano = require('cssnano');
const uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');
const angularTemplatecache = require('gulp-angular-templatecache');
const usemin = require('gulp-usemin');
const minifyHtml = require('gulp-minify-html');

function ensureDirectoryExistence(filePath) {
    const dirname = path.dirname(filePath);
    if (fs.existsSync(dirname)) {
        return true;
    }
    fs.mkdirSync(dirname, { recursive: true });
}

// Task to serve the application
function serve() {
  browserSync.init({
    server: {
      baseDir: "./",  
      middleware: [historyApiFallback()]
    },
    port: 3000,
    files: [
      './*.html',
      'components/**/*.html',
      'views/**/*.html'
    ]
  });
}

// CSS Linting task
function lintCss() {
  const stylelint = require('stylelint');
  
  return gulp.src([
    './styles/**/*.css',
    './styles/static/**/*.css',
    '!./styles/**/*.min.css',
    '!node_modules/**'
  ])
    .pipe(postcss([
      require('stylelint')({
        fix: true,
        reporters: [
          {
            formatter: 'string',
            console: true
          }
        ]
      })
    ]))
    .pipe(gulp.dest(file => file.base));
}

// Copy static CSS files
function copyStaticCss() {
  // Copy main compiled CSS to expected location for usemin
  gulp.src([
    './styles/style.css',
    './styles/single-page.css'
  ], { allowEmpty: true })
    .pipe(gulp.dest('./_build/styles/'))
    .on('error', function(err) {
      console.error('Copy CSS Error (main):', err.message);
      this.emit('end');
    });

  // Copy vendor/static CSS to static folder
  return gulp.src([
    './styles/static/**/*.css',
    './styles/static/swiper.css',
    './styles/static/magnific-popup.css',
    './styles/static/brands.css',
    './styles/static/fontawesome.css',
    './styles/static/fonts.css',
    './styles/static/et-line.css',
    './styles/static/font-icons.css',
    './styles/static/responsive.css',
    './styles/static/bootstrap.css'
  ], { allowEmpty: true })
    .pipe(gulp.dest('./_build/styles/static/'))
    .on('error', function(err) {
      console.error('Copy CSS Error (static):', err.message);
      this.emit('end');
    })
    .pipe(browserSync.stream());
}

// Minify CSS
function minifycss() {
  return gulp.src(['./styles/static/**/*.css', '!./styles/**/*.min.css'])
    .pipe(postcss([
      cssnano({
        preset: ['default', {
          discardComments: {
            removeAll: true,
          },
        }],
      })
    ]))
    .pipe(gulp.dest('./_build/styles/static/'))
    .pipe(browserSync.stream());
}

// Minify JS
function minifyjs() {
  return gulp.src(['js/**/*.js', 'app/**/*.js', 'components/**/*.js'], { base: './', allowEmpty: true })
    .pipe(uglify())
    .pipe(gulp.dest('./_build/'))
    .pipe(browserSync.stream());
}

// Minify HTML
function minifyHtmlFiles() {
  var opts = {
    comments: true,
    spare: true,
    conditionals: true
  };
  return gulp.src('./*.html')
    .pipe(minifyHtml(opts))
    .pipe(gulp.dest('./_build/'));
}

// Copy HTML files
function copyHtml() {
  return gulp.src('./index.html')
    .pipe(gulp.dest('./_build/'));
}

// Clean build directory
async function cleanbuild() {
  const deletedFiles = await del(['./_build/']);
  return deletedFiles;
}

// Sass compilation
function sassbuild() {
  const outputPath = './_build/css/style.css';
  ensureDirectoryExistence(outputPath);
  return gulp.src('./styles/**/*.scss')
    .pipe(gulpDartSass().on('error', gulpDartSass.logError))
    .pipe(gulp.dest('./_build/css/'))
    .pipe(browserSync.stream());
}

// Sass compilation for development (writes to styles/style.css)
function sassdev() {
  return gulp.src('./styles/style.scss')
    .pipe(gulpDartSass().on('error', gulpDartSass.logError))
    .pipe(gulp.dest('./styles/'))
    .pipe(browserSync.stream());
}

// Image optimization
function images() {
  return gulp.src(['images/**/*', '!images/README'])
    .pipe(imagemin({
      optimizationLevel: 3,
      progressive: true,
      interlaced: true
    }).on('error', function(err) {
      console.error('Imagemin Error:', err.message);
      this.emit('end');
    }))
    .pipe(gulp.dest('./_build/images'))
    .pipe(browserSync.stream());
}

// Template cache
function templates() {
  return gulp.src(['components/**/*.html'])
    .pipe(angularTemplatecache({
      root: 'components/',
      module: 'app.templates',
      standalone: true
    }))
    .pipe(gulp.dest('./_build/js/'));
}

// Views
function views() {
  return gulp.src(['views/**/*.html'])
    .pipe(gulp.dest('./_build/views/'));
}

// Usemin task
function useminTask() {
  return gulp.src('./index.html')
    .pipe(usemin({
      css: [
        function() {
          return postcss([
            cssnano({
              preset: ['default', {
                discardComments: { removeAll: true },
                mergeLonghand: false,
                mergeRules: false
              }]
            })
          ]);
        }
      ],
      js: [uglify()],
      html: [function() { return minifyHtml({ empty: true }); }],
      path: './_build'
    }))
    .on('error', function(err) {
      console.error('Usemin Error:', err.message);
      this.emit('end');
    })
    .pipe(gulp.dest('./_build/'));
}

// Fonts
function fonts() {
  return gulp.src(['fonts/**/*'])
    .pipe(gulp.dest('./_build/fonts/'))
    .pipe(browserSync.stream());
}

// Assets
function assets() {
  return gulp.src(['assets/**/*'])
    .pipe(gulp.dest('./_build/assets/'));
}

// Browser reload
function bsreload() {
  browserSync.reload();
  return Promise.resolve('reloaded');
}

// Build size
function buildSize() {
  return gulp.src('./_build/**/*')
    .pipe(gulp.dest('./_build/'));
}

// Default task
gulp.task('default', gulp.series(serve, gulp.parallel(sassdev, lintCss, minifycss, minifyjs, templates, views, minifyHtmlFiles), function () {
  gulp.watch('styles/**/*.scss', gulp.series(sassdev));
  gulp.watch(['*.html', 'components/**/*.html', 'views/**/*.html'], gulp.series(templates, views, minifyHtmlFiles, bsreload));
  gulp.watch('js/**/*.js', gulp.series(minifyjs, bsreload));
}));

// Build task
gulp.task('build', gulp.series(
  cleanbuild,
  copyHtml,
  copyStaticCss,
  sassbuild,
  lintCss,
  // purgeCSS,
  images,
  templates,
  // ensure required JS assets exist where usemin expects them
  function copyNodeModulesJs() {
    return gulp.src([
      'node_modules/sine-waves/sine-waves.min.js',
      'node_modules/angular/angular.min.js',
      'node_modules/angular-route/angular-route.js',
      'node_modules/angular-animate/angular-animate.js'
    ], { allowEmpty: true, base: './' })
      .pipe(gulp.dest('./_build/'));
  },
  // copy and minify local JS so usemin finds them
  minifyjs,
  views,
  useminTask,
  fonts,
  assets,
  bsreload,
  buildSize
));
