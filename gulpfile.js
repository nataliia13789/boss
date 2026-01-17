const { src, dest, watch, series, parallel } = require('gulp');

const browserSync = require('browser-sync').create();
const scss = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;
const autoprefixer = require('gulp-autoprefixer');
const clean = require('gulp-clean');
const include = require('gulp-include');
const svgstore = require('gulp-svgstore');

function sprites() {
  return src('app/images/sprite/*.svg')
    .pipe(svgstore())
    .pipe(dest('app/images'))
}

function pages() {
  return src('app/pages/*.html')
    .pipe(include({
      includePaths: 'app/components'
    }))
    .pipe(dest('app'))
    .pipe(browserSync.stream())
}

function fonts() {
  const ttf2woff2 = require('gulp-ttf2woff2');

  return src('app/fonts/*.ttf')
    .pipe(ttf2woff2())
    .pipe(dest('app/fonts'));
}


function images() {
  const webp = require('gulp-webp');
  const avif = require('gulp-avif');
  const imagemin = require('gulp-imagemin');

  // JPG / PNG → оптимізовані
  src('app/images/src/**/*.{jpg,jpeg,png,svg}')
    .pipe(imagemin())
    .pipe(dest('app/images'));

  // WEBP
  src('app/images/src/**/*.{jpg,jpeg,png}')
    .pipe(webp())
    .pipe(dest('app/images'));

  // AVIF
  return src('app/images/src/**/*.{jpg,jpeg,png}')
    .pipe(avif({ quality: 50 }))
    .pipe(dest('app/images'));
}

function svg() {
  return src('app/images/src/**/*.svg')
    .pipe(dest('app/images'));
}


function styles() {
  return src('app/scss/style.scss')
    .pipe(autoprefixer())
    .pipe(concat('style.min.css'))
    .pipe(scss(
      { style: 'compressed' }
    ))
    .pipe(dest('app/css'))
    .pipe(browserSync.stream())
}

function scripts() {
  return src([
    'node_modules/swiper/swiper-bundle.js',
    'app/js/main.js'
  ])
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(dest('app/js'))
    .pipe(browserSync.stream())
}

function watching() {
  browserSync.init({
    server: {
      baseDir: 'app/'
    }
  });
  watch(['app/scss/style.scss'], styles);
  watch(['app/js/main.js'], scripts);
  watch(['app/images/src/**/*.{jpg,jpeg,png}'], images);
  watch(['app/images/src/**/*.svg'], svg);
  watch(['app/components/*', 'app/pages/*'], pages);
  watch(['app/*.html']).on('change', browserSync.reload);
}

function building() {
  return src([
    'app/css/style.min.css',
    'app/images/**/*.*',
    'app/fonts/*.woff2',
    'app/js/main.min.js',
    'app/*.html'
  ], { base: 'app' })
    .pipe(dest('dist'))
}

function cleanDist() {
  return src('dist')
    .pipe(clean());
}

exports.styles = styles;
exports.watching = watching;
exports.fonts = fonts;
exports.pages = pages;
exports.images = images;
exports.svg = svg;
exports.sprites = sprites;
exports.svgstore = svgstore;
exports.scripts = scripts;
exports.building = building;
exports.cleanDist = cleanDist;

exports.build = series(cleanDist, building);
exports.default = parallel(styles, scripts, pages, watching);