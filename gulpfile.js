'use strict';

var gulp = require('gulp');
var rename = require('gulp-rename');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var uglify = require('gulp-uglify');

gulp.task('lint', function() {
    return gulp.src(['src/**/*.js', 'gulpfile.js'])
        .pipe(jshint())
        .pipe(jshint.reporter(stylish));
});

gulp.task('copy', ['lint'], function() {
    return gulp.src('src/cachier.js')
        .pipe(gulp.dest('dist'));
});

gulp.task('minify', ['copy'], function() {
    return gulp.src('src/cachier.js')
        .pipe(uglify())
        .pipe(rename('cachier.min.js'))
        .pipe(gulp.dest('dist'));
});

gulp.task('default', ['lint', 'copy', 'minify']);