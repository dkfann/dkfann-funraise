var gulp = require('gulp');
var less = require('gulp-less');
var watch = require('gulp-watch');
var babel = require('gulp-babel');

gulp.task('build_css', function() {
    build_css();
});

gulp.task('build_js', function() {
    build_js();
});

gulp.task('watch_css', function() {
    watch_css();
});

gulp.task('watch_js', function() {
    watch_js();
});

function build_css() {
    return gulp.src('./app/src/css/**/*.+(less)')
        .pipe(less())
        .pipe(gulp.dest('./app/static/css/'));
}

function build_js() {
    return gulp.src('./app/src/js/**/*.+(js)')
        .pipe(babel({
            presets: ['env']
        }))
        .pipe(gulp.dest('./app/static/js'));
}

function watch_css() {
    return gulp.src('./app/src/css/**/*.+(less)')
        .pipe(watch('./app/src/css/**/*.+(less)'))
        .pipe(less())
        .pipe(gulp.dest('./app/static/css/'));
}

function watch_js() {
    return gulp.src('./app/src/js/**/*.+(js)')
        .pipe(watch('./app/src/js/**/*.+(js)'))
        .pipe(babel({
            presets: ['env']
        }))
        .pipe(gulp.dest('./app/static/js'));
}
