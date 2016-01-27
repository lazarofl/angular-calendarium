var gulp = require('gulp'),
	jshint = require('gulp-jshint'),
	clean = require('gulp-contrib-clean'),
	uglify = require('gulp-uglify');

// build the main source into the min file 
gulp.task('default', ['clean'], function () {
    return gulp.src(['src/angular-calendarium.js'])
    			.pipe(jshint())
    			.pipe(jshint.reporter('jshint-stylish'))
    			.pipe(jshint.reporter('fail'))
    			.pipe(uglify())
    			.pipe(gulp.dest('dist'));
});

gulp.task('clean', function() {
	return gulp.src('dist')
		.pipe(clean());
});