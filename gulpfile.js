var gulp = require('gulp');
var sass = require('gulp-sass');
var babel = require('gulp-babel');
var pug = require('gulp-pug');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var fs = require('fs');
var path = require('path');

gulp.task('default', ['sass', 'scripts', 'views', 'sass:watch', 'scripts:watch', 'views:watch']);

gulp.task('build', ['sass', 'scripts', 'views']);

gulp.task('watch', ['sass:watch', 'scripts:watch', 'views:watch']);


gulp.task('sass', function () {
  return gulp.src(['./sass/variables/*.scss', './sass/mixins/*.scss', './sass/globals/*.scss', './sass/pages/*.scss'])
    .pipe(concat('bundle.min.css'))
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(gulp.dest('./public/stylesheets/'));
});

gulp.task('scripts', function() {
  return gulp.src('./src/**/*.js')
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(concat('app.min.js'))
    .pipe(uglify({
      mangle: false
    }))
    .pipe(gulp.dest('./public/js'));
});

gulp.task('views', function buildHTML() {
  var locals = {};
  fs.readdirSync("data").forEach(function(filename) {
    locals[/[a-zA-Z0-9]*/g.exec(filename)] = JSON.parse(fs.readFileSync(path.join('data', filename)))
  })
  return gulp.src('views/**/*.pug')
  .pipe(pug({
    locals:locals
  }))
  .pipe(gulp.dest('./public'))
});

gulp.task('sass:watch', function () {
  gulp.watch('./sass/**/*.scss', ['sass']);
});

gulp.task('scripts:watch', function () {
  gulp.watch('./src/**/*.js', ['scripts']);
});

gulp.task('views:watch', function () {
  gulp.watch('./views/**/*.pug', ['views']);
});
