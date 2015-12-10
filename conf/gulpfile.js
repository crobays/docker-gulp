var require_install = require('require-install')
    ,child_process = require('child_process')
    ,gulp = require('gulp')
    ,fs = require('fs')
    ,path = require('path')
    ,autoprefixer = require_install('gulp-autoprefixer')
    ,browserSync = require_install('browser-sync')
    ,concat = require_install('gulp-concat')
    ,filter = require_install('gulp-filter')
    ,sass = require_install('gulp-ruby-sass')
    ,sourcemaps = require_install('gulp-sourcemaps')
    ,browserify = require_install('browserify')
    //,browserify_shim = require_install('browserify-shim')
    //,bower = require_install('gulp-bower')
    //,bower_files = require_install('main-bower-files')
    //,browserify = require_install('browserify')
    //,browserify_shim = require_install('browserify-shim')
    //,cache = require_install('gulp-cache')
    //,coffee = require_install('gulp-coffee')
    //,coffeelint = require_install('gulp-coffeelint')
    //,colors = require_install(//'colors')
    //,compass = require_install('gulp-compass')
    //,cssimport = require_install("gulp-cssimport")
    //,cssGlobbing = require_install('gulp-css-globbing')
    //,debug = require_install('gulp-debug')
    //,globule = require_install('globule')
    //,insert = require_install('gulp-insert')
    ,mq_remove = require_install('gulp-mq-remove')
    //,native_exec = require_install('child_process').exec
    ,no_media_queries = require_install('gulp-no-media-queries')
    //,exec = require_install('gulp-exec')
    //,exit = require_install('gulp-exit')
    //,less = require_install('gulp-less')
    //,minifycss = require_install('gulp-minify-css')
    //,phpunit = require_install('gulp-phpunit')
    //,phpspec = require_install('gulp-phpspec')
    //,plumber = require_install('gulp-plumber')
    ,rem_to_px = require_install('gulp-rem-to-px')
    //,sass = require_install('gulp-sass')
    ,source = require_install('vinyl-source-stream')
    //,svg2png = require_install('gulp-svg2png')
    //,sys = require_install('sys')
    ,rename = require_install('gulp-rename')
    //,uglify = require_install('gulp-uglify')
    //,gutil = require_install('gulp-util')
    //,watchify = require_install('watchify')
    ;

var backend_try_list = [
    process.env.BACKEND_PORT_8000_TCP,
    process.env.BACKEND_PORT_80_TCP,
    process.env.BACKEND_PORT,
    'tcp://localhost:8000',
];

var base_path = process.env.BASE_DIR ? process.env.BASE_DIR : 'src/static/app';

var paths = {
    styles: base_path+'/src/styles',
    scripts: base_path+'/src/scripts',
    output_styles: base_path+'/dist',
    output_scripts: base_path+'/dist',
};

var reload = browserSync.reload;
var browserSyncConfig = {
    stream: true
};

child_process.exec('mkdir -p '+paths.styles+'/masters && touch '+paths.styles+'/masters/style.sass')
gulp.task('sass', function () {
    return sass(paths.styles+'/masters', { sourcemap: true})
        .on('error', function (err) {
            console.error('Error', err.message);
        })
        .pipe(autoprefixer({
            browsers: [
                "last 2 version",
                "> 1%",
                "ie 11",
                "ie 10",
                "ie 9",
            ]
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.output_styles))
        .pipe(filter('**/*.css'))
        .pipe(reload(browserSyncConfig))
        ;
});

gulp.task('css-master-ie', ['sass'], function () {
    gulp.src(paths.output_styles+'/style.css')
        .pipe(no_media_queries({width: '1026px'}))
        .pipe(rename('no-media-query.css'))
        .pipe(gulp.dest(paths.output_styles))
        ;

    return gulp.src([paths.output_styles+'/style.css', paths.output_styles+'/no-media-query.css', paths.output_styles+'/ie.css'])
        .pipe(concat('style-ie.css'))
        .pipe(mq_remove({type: 'screen'}))
        .pipe(rem_to_px({fontSize: 16}))
        .pipe(gulp.dest(paths.output_styles))
        .pipe(filter('**/*.css'))
        .pipe(reload(browserSyncConfig))
        ;
});

child_process.exec('mkdir -p '+paths.scripts+'/masters && touch '+paths.scripts+'/masters/script.js')
gulp.task('js:all', function() {
    return browserify(paths.scripts+'/masters/script.js')
            .bundle()
            .pipe(source('script.js'))
            .pipe(gulp.dest(paths.output_scripts))
            .pipe(reload(browserSyncConfig))
            ;
});

child_process.exec('mkdir -p '+paths.scripts+'/masters && touch '+paths.scripts+'/masters/ie.js')
gulp.task('js:ie', function() {
    browserify(paths.scripts+'/masters/ie.js')
        .bundle()
        .pipe(source('ie.js'))
        .pipe(gulp.dest(paths.output_scripts))
        .pipe(reload(browserSyncConfig))
        ;
});

var backend_tcp;
for (var k in backend_try_list) {
    if (backend_try_list[k] === undefined) {
        continue;
    }
    backend_tcp = backend_try_list[k];
    break;
}

gulp.task('browser-sync', function() {
    browserSync.init({
        proxy: backend_tcp.substr(6)
    });
});

gulp.task('watch', ['browser-sync'], function() {
    gulp.watch(paths.styles+'/**/*.sass', [
        'sass',
        'css-master-ie',
    ]);
    gulp.watch(paths.scripts+'/**/*.js', [
        'js:all',
        'js:ie',
    ]);
    gulp.watch(paths.src+"/**/*.html").on('change', reload);
});

gulp.task('default', [
    'gulpfile-watch',
    'watch',
    'sass',
    'css-master-ie',
    'js:all',
    'js:ie',
]);

gulp.task('exit-gulp', function(){
    process.exit(0);
});

gulp.task('gulpfile-watch', function(){
   gulp.watch(__filename, ['exit-gulp']);
});
