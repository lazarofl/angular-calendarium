var gulp = require('gulp'),
	jshint = require('gulp-jshint'),
	clean = require('gulp-contrib-clean'),
	uglify = require('gulp-uglify'),
	minifyCss = require('gulp-minify-css'),
	rename = require("gulp-rename");

// build the main source into the min file 
gulp.task('javascript', function () {
    return gulp.src(['src/angular-calendarium.js'])
    			.pipe(jshint())
    			.pipe(jshint.reporter('jshint-stylish'))
    			.pipe(jshint.reporter('fail'))
    			.pipe(gulp.dest('dist'))
    			.pipe(uglify())
			    .pipe(rename(function(path) {
			        path.basename += '.min';
			    }))
			    .pipe(gulp.dest('dist'));
});

// build the css
gulp.task('styles', function () {
    return gulp.src(['css/angular-calendarium.css'])
    			.pipe(gulp.dest('dist'))
    			.pipe(minifyCss({compatibility: 'ie8'}))
    			.pipe(rename(function(path) {
			        path.basename += '.min';
			    }))
    			.pipe(gulp.dest('dist'));
});

gulp.task('clean', function() {
	return gulp.src('dist')
		.pipe(clean());
});

gulp.task('default', ['clean', 'javascript', 'styles'], function() {
	
});