/**
 * app文件夹内的每一个js都压缩成.min.js
 * Created by summer on 2017/3/1.
 */


var gulp = require('gulp');

var gulpIf = require('gulp-if');

var uglify = require('gulp-uglify');

var elixir = require('laravel-elixir');

elixir.extend('appJs', function (src, output) {

    var inputFilePath = src || './resources/assets/app/';
    var outputFilePath = output || './public/build/app/';


    new elixir.Task('appJs', function () {
        return gulp.src(inputFilePath + '**/*.js')
            .pipe(gulpIf(elixir.config.production, uglify()))
            .pipe(gulp.dest(outputFilePath));
    })
        .watch(inputFilePath + '**/*.js');
});