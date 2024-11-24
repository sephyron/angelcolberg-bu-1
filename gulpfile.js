const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const reload = browserSync.reload;
const load = require('gulp-load-plugins')();
const del = require('del');
const historyApiFallback = require('connect-history-api-fallback');
const gulpDartSass = require('gulp-dart-sass');
const fs = require('fs');
const path = require('path');
const postcss = require('gulp-postcss');
const purgecss = require('gulp-purgecss');
const cssnano = require('cssnano');

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
  return gulp.src([
    // Static CSS files
    './styles/static/**/*.css',
    // Node module CSS files
    './node_modules/owl.carousel/dist/assets/owl.carousel.css',
    './node_modules/morphext/dist/morphext.css',
    './node_modules/animate.css/animate.css',
    // Main CSS files
    './styles/style.css',
    './styles/single-page.css',
    // Additional static files
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
    .pipe(gulp.dest('./_build/styles/'))
    .on('error', function(err) {
      console.error('Copy CSS Error:', err.message);
      this.emit('end');
    })
    .pipe(browserSync.stream());
}

// Purge CSS
function purgeCSS() {
  return gulp.src([
    './styles/style.css',
    './styles/animation.css',
    './styles/single-page.css',
    '!./styles/**/*.min.css'
  ], { allowEmpty: true })
    .pipe(purgecss({
      content: [
        './index.html',
        './views/**/*.html',
        './components/**/*.html',
        './js/**/*.js',
        './app/**/*.js'
      ],
      safelist: {
        standard: [
          /^animate-/,
          /^owl-/,
          /^swiper-/,
          /^fa-/,
          /^et-/,
          'active',
          'show',
          'hide',
          'open',
          'close',
          'current',
          'fade',
          'in'
        ],
        deep: [
          /^modal/,
          /^popup/,
          /^carousel/,
          /^swiper/
        ],
        greedy: [
          /^ng-/,
          /^fa-/,
          /^owl-/
        ]
      },
      defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || []
    }))
    .on('error', function(err) {
      console.error('PurgeCSS Error:', err);
      this.emit('end');
    })
    .pipe(gulp.dest('./_build/css/'))
    .pipe(browserSync.stream());
}

// Minify CSS
function minifycss() {
  return gulp.src(['./styles/static/**/*.css', '!./styles/**/*.min.css', './node_modules/**/*.css'])
    .pipe(load.rename({suffix: '.min'}))
    .pipe(postcss([
      cssnano({
        preset: ['default', {
          discardComments: {
            removeAll: true,
          },
        }],
      })
    ]))
    .pipe(gulp.dest('./_build/css/'))
    .pipe(browserSync.stream());
}

// Minify JS
function minifyjs() {
  return gulp.src('js/*.js')
    .pipe(load.uglify())
    .pipe(gulp.dest('./_build/'))
    .pipe(browserSync.stream());
}

// Minify HTML
function minifyHtml() {
  var opts = {
    comments: true,
    spare: true,
    conditionals: true
  };
  return gulp.src('./*.html')
    .pipe(load.minifyHtml(opts))
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

// Image optimization
function images() {
  return gulp.src(['images/**/*', '!images/README'])
    .pipe(load.changed('./_build/images'))
    .pipe(load.imagemin({
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
    .pipe(load.angularTemplatecache({
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
function usemin() {
  return gulp.src('./index.html')
    .pipe(load.usemin({
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
      js: [load.uglify()],
      html: [function() { return load.minifyHtml({ empty: true }); }],
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
    .pipe(load.size({title: 'build', gzip: true}));
}

// Default task
gulp.task('default', gulp.series(serve, gulp.parallel(lintCss, minifycss, minifyjs, templates, views, minifyHtml), function () {
  gulp.watch('styles/**/*.scss', gulp.series(lintCss, minifycss));
  gulp.watch(['*.html', 'components/**/*.html', 'views/**/*.html'], gulp.series(lintCss, templates, views, minifyHtml, bsreload));
  gulp.watch('js/**/*.js', gulp.series(minifyjs, bsreload));
}));

// Build task
gulp.task('build', gulp.series(
  cleanbuild,
  copyHtml,
  copyStaticCss,
  sassbuild,
  lintCss,
  purgeCSS,
  images,
  templates,
  views,
  usemin,
  fonts,
  assets,
  bsreload,
  buildSize
));
