var gulp = require('gulp')
    ,autoprefixer = require('gulp-autoprefixer')
    ,bower = require('gulp-bower')
    //,bower_files = require('main-bower-files')
    ,browserify = require('browserify')
    ,browserSync = require('browser-sync')
    //,browserify_shim = require('browserify-shim')
    //,cache = require('gulp-cache')
    ,coffee = require('gulp-coffee')
    //,coffeelint = require('gulp-coffeelint')
    ,colors = require('colors')
    //,compass = require('gulp-compass')
    ,concat = require('gulp-concat')
    //,cssimport = require("gulp-cssimport")
    //,cssGlobbing = require('gulp-css-globbing')
    //,globule = require('globule')
    //,debug = require('gulp-debug')
    ,native_exec = require('child_process').exec
    ,exec = require('gulp-exec')
    //,exit = require('gulp-exit')
    ,fs = require('fs')
    //,filter = require('gulp-filter')
    ,less = require('gulp-less')
    ,minifycss = require('gulp-minify-css')
    //,path = require('path')
    //,phpunit = require('gulp-phpunit')
    //,phpspec = require('gulp-phpspec')
    //,plumber = require('gulp-plumber')
    ,sass = require('gulp-sass')
    //,sass = require('gulp-ruby-sass')
    ,source = require('vinyl-source-stream')
    ,sourcemaps = require('gulp-sourcemaps')
    //,sys = require('sys')
    ,rename = require('gulp-rename')
    ,uglify = require('gulp-uglify')
    ,gutil = require('gulp-util')
    ,watchify = require('watchify')
    ;

var project = fs.lstatSync('/project').isDirectory() ? '/project' : __dirname,
    static_ = 'static/wiestaateraanmijnbed',
    styles_dir = 'style',
    scripts_dir = 'js',
    input = project+'/src/'+static_,
    output = project+'/'+static_;

var paths = {
    styles: input+'/'+styles_dir,
    less: input+'/'+styles_dir+'/less',
    sass: input+'/'+styles_dir+'/sass',
    scripts: input+'/'+scripts_dir,
    styles_output: output+'/'+styles_dir+'/css',
    scripts_output: output+'/'+scripts_dir,
};

process.stdout.write('input styles: '+paths.styles+"\n");
process.stdout.write('input scripts: '+paths.scripts+"\n");
process.stdout.write('output styles: '+paths.styles_output+"\n");
process.stdout.write('output scripts: '+paths.scripts_output+"\n");

var backend_tcp = process.env.BACKEND_PORT_8000_TCP;
if ( ! backend_tcp )
{
    backend_tcp = process.env.BACKEND_PORT;
}

gulp.task('browser-sync', function() {
    if (backend_tcp) {
        browserSync.init({
            proxy: backend_tcp.substr(6)
        });
    }
});

var browserSyncConfig = {
    stream: true
};

var report_options = {
    err: true, // default = true, false means don't write err
    stderr: true, // default = true, false means don't write stderr
    stdout: true // default = true, false means don't write stdout
}

gulp.task('sass', function () {
    return gulp.src(paths.sass+'/*.sass')
        .on('error', function (err) {
            gutil.log(err.message);
            this.emit('end');
        })
        .pipe(sourcemaps.init())
        .pipe(sass({
            indentedSyntax: true,
            errLogToConsole: true,
        }))
        //// .pipe(autoprefixer())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(paths.styles_output))
        // .pipe(rename({suffix: '.min'}))
        // .pipe(minifycss())
        // .pipe(gulp.dest(paths.styles_output))
        // .pipe(notify({message: 'Styles task complete'}));
        .pipe(exec.reporter(report_options))
        .pipe(browserSync.reload(browserSyncConfig))
});

gulp.task('less', function () {
    return gulp.src(paths.less+'/*.less')
        .on('error', function (err) {
            gutil.log(err.message);
            this.emit('end');
        })
        .pipe(sourcemaps.init())
        .pipe(less())
        // .pipe(autoprefixer())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(paths.styles_output))
        // .pipe(rename({suffix: '.min'}))
        // .pipe(minifycss())
        // .pipe(gulp.dest(paths.styles_output))
        // .pipe(notify({message: 'Styles task complete'}));
        .pipe(exec.reporter(report_options))
        .pipe(browserSync.reload(browserSyncConfig))
});

gulp.task('js:all', function() {

    return gulp.src([
        input+'/bower_components/modernizr/modernizr.js',
        input+'/bower_components/jquery/dist/jquery.min.js',
        input+'/bower_components/bootstrap/js/tooltip.js',
        input+'/bower_components/raven-js/dist/raven.min.js',
        paths.scripts+'/main.js',
    ])
        .pipe(sourcemaps.init())
        .pipe(concat('all.js'))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(paths.scripts_output))
});

gulp.task('js:home', function() {
    return gulp.src([
        input+'/blueimp-gallery/js/blueimp-gallery.js',
        input+'/blueimp-gallery/js/blueimp-gallery-indicator.js',
        input+'/blueimp-gallery/js/blueimp-gallery-video.js',
        input+'/blueimp-gallery/js/blueimp-gallery-youtube.js',
        input+'/blueimp-gallery/js/blueimp-gallery-vimeo.js',
    ])
        .pipe(sourcemaps.init())
        .pipe(concat('home.js'))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(paths.scripts_output))
});

gulp.task('js:detail', function() {
    return gulp.src([
        paths.scripts+'/sticky-nav.js',
    ])
        .pipe(sourcemaps.init())
        .pipe(concat('detail.js'))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(paths.scripts_output))
});

gulp.task('js:ie', function() {
    return gulp.src([
        paths.scripts+'/../bower_components/selectivzr/selectivzr.js',
    ])
        .pipe(sourcemaps.init())
        .pipe(concat('ie.js'))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(paths.scripts_output))
});

gulp.task('watch', ['browser-sync'], function() {
    gulp.watch(paths.styles+'/**/*.*ss', ['sass', 'less']);
    gulp.watch(paths.scripts+'/**/*.js', ['js:all', 'js:home', 'js:detail', 'js:ie',]);
});

gulp.task('default', ['watch', 'sass', 'less', 'js:all', 'js:home', 'js:detail', 'js:ie',]);
