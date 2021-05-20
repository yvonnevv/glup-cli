var gulp = require('gulp');

// 引入组件
var path = require('path'), // node自带组件
    fse = require('fs-extra'); // 通过npm下载


// 获取当前文件路径
var PWD = process.env.PWD || process.cwd(); // 兼容windows

gulp.task('init', function () {

    var dirs = ['src', 'src/html', 'src/sass', 'src/js', 'src/images', 'src/pic', 'src/sprite'];

    dirs.forEach(function (item, index) {
        // 使用mkdirSync方法新建文件夹
        fse.mkdirSync(path.join(PWD + '/' + item));
    })

    // 往index里写入的基本内容
    var template = '<!DOCTYPE html><html lang="zh-CN"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no"/><title></title><meta name="apple-touch-fullscreen" content="yes" /><meta name="format-detection" content="telephone=no" /><meta name="apple-mobile-web-app-capable" content="yes" /><meta name="apple-mobile-web-app-status-bar-style" content="black" /></head><body></body></html>';

    fse.writeFileSync(path.join(PWD + '/src/html/index.html'), template);
    fse.writeFileSync(path.join(PWD + '/src/sass/style.scss'), '@charset "utf-8";');
});

// 编译sass
var sass = require('gulp-sass');
var postcss = require('gulp-postcss');
var px2rem = require('postcss-px2rem');

gulp.task('sass', function () {
    var processors = [px2rem({
        remUnit: 37.5
    })];
    return gulp
        // 在src/sass目录下匹配所有的.scss文件
        .src('src/sass/**/*.scss')
        // 基于一些配置项 运行sass()命令
        .pipe(sass({
            errLogToConsole: true,
            outputStyle: 'expanded'
        }).on('error', sass.logError))
        .pipe(postcss(processors))
        // 输出css
        .pipe(gulp.dest('src/css'));
});

var autoprefixer = require('gulp-autoprefixer');

gulp.task('autoprefixer', function () {
    return gulp.src('src/css/**/*.css')
        .pipe(autoprefixer({
            browsers: ['ios 5', 'android 2.3'],
            cascade: false
        }));
});

//=======================
//     服务器 + 监听
//=======================
var browserSync = require('browser-sync').create();
gulp.task('default', function () {
    // 监听重载文件
    var files = [
        'src/html/**/*.html',
        'src/css/**/*.css',
        'src/js/**/*.js',
        'src/sprite/**/*.png'
    ]
    browserSync.init(files, {
        server: {
            baseDir: "./",
            directory: true
        },
        open: 'external',
        startPath: "src/html/"
    });
    // 监听编译文件
    gulp.watch("src/html/**/*.html").on('change', browserSync.reload);
    gulp.watch("src/sass/**/*.scss", gulp.series('sass'));
    gulp.watch("src/css/**/*.css", gulp.series('autoprefixer'));
});