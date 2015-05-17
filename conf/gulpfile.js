var require_install = require('require-install')
    ,gulp = require('gulp')
    ,fs = require('fs')
    ,path = require('path')
    ,autoprefixer = require_install('gulp-autoprefixer')
    ,browserSync = require_install('browser-sync')
    ,concat = require_install('gulp-concat')
    ,filter = require_install('gulp-filter')
    ,sass = require_install('gulp-ruby-sass')
    ,sourcemaps = require_install('gulp-sourcemaps')
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
    //,native_exec = require_install('child_process').exec
    //,spawn = require_install('child_process')//.spawn
    //,exec = require_install('gulp-exec')
    //,exit = require_install('gulp-exit')
    //,less = require_install('gulp-less')
    //,minifycss = require_install('gulp-minify-css')
    //,phpunit = require_install('gulp-phpunit')
    //,phpspec = require_install('gulp-phpspec')
    //,plumber = require_install('gulp-plumber')
    //,sass = require_install('gulp-sass')
    //,source = require_install('vinyl-source-stream')
    //,sys = require_install('sys')
    //,rename = require_install('gulp-rename')
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

var base_path = process.env.BASE_DIR ? process.env.BASE_DIR : 'src/static/app'

var paths = {
    src: 'src',
    styles: base_path+'/src/styles',
    scripts: base_path+'/src/scripts',
    output_styles: base_path+'/dist/styles',
    output_scripts: base_path+'/dist/scripts',
    bower: base_path+'/bower_components',
};

var reload = browserSync.reload;
var browserSyncConfig = {
    stream: true
};

var report_options = {
    err: true, // default = true, false means don't write err
    stderr: true, // default = true, false means don't write stderr
    stdout: true, // default = true, false means don't write stdout
}

gulp.task('sass', function () {
    return sass(paths.styles+'/sass/masters', { sourcemap: true})
        .on('error', function (err) {
            console.error('Error', err.message);
        })
        .pipe(autoprefixer({
            browsers: [
                "last 1 version",
                "> 1%",
                "ie 8",
                "ie 7",
            ]
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.output_styles))
        .pipe(filter('**/*.css'))
        .pipe(reload(browserSyncConfig));
});

// gulp.task('sass', function () {
//     return gulp.src(paths.styles+'/sass/**/*.sass')
//         .pipe(sourcemaps.init())
//         .pipe(sass({
//             indentedSyntax: true,
//             errLogToConsole: true
//         }))
//         .pipe(sourcemaps.write())
//         .pipe(gulp.dest(paths.output_styles))
// });

// gulp.task('sass-autoprefix', ['sass'], function () {
//     return gulp.src(paths.output_styles+'/*.css')
//         .pipe(autoprefixer({
//             browsers: ["last 1 version", "> 1%", "ie 8", "ie 7"]
//         }))
//         .pipe(insert.append('\n\n/*# sourceMappingURL=master.css.map */'))
//         .pipe(gulp.dest(paths.output_styles))
//         .pipe(filter('**/*.css'))
//         .pipe(reload(browserSyncConfig));
// });

gulp.task('js:all', function() {
    var files = [
        //paths.bower+'/modernizr/modernizr.js',
        //paths.bower+'/jquery/dist/jquery.js',
        //paths.bower+'/fastclick/lib/fastclick.js',
        //paths.bower+'/foundation/js/foundation/foundation.js',
        //paths.bower+'/foundation/js/foundation/foundation.topbar.js',
        //paths.bower+'/foundation/js/foundation/foundation.offcanvas.js',
        paths.scripts+'/js/main.js',
    ];

    gulp.src(files)
        .pipe(sourcemaps.init())
        .pipe(concat('all.js'))
        //.pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(output_scripts))
        .pipe(reload(browserSyncConfig));
    //gulp.src(files)
    //    .pipe(concat('all.js'))
    //    .pipe(uglify())
    //    .pipe(gulp.dest(output_scripts));
});

gulp.task('js:ie', function() {
    var files = [
        //paths.bower+'/selectivzr.foundation/selectivzr.js',
    ];
    gulp.src(files)
        .pipe(sourcemaps.init())
        .pipe(concat('ie.js'))
        //.pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(output_scripts))
        .pipe(reload(browserSyncConfig));
    //gulp.src(files)
    //    .pipe(concat('ie.js'))
    //    .pipe(uglify())
    //    //.pipe(rename({suffix: '.min'}))
    //    .pipe(gulp.dest(output_scripts));
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
    ]);
    gulp.watch(paths.scripts+'/js/**/*.js', [
        'js:all',
        'js:ie',
    ]);
    gulp.watch(paths.src+"/**/*.html").on('change', reload);
});

gulp.task('default', [
    'gulpfile-watch',
    'watch',
    'sass',
    'js:all',
    'js:ie',
]);

gulp.task('exit-gulp', function(){
    process.exit(0);
});

gulp.task('gulpfile-watch', function(){
   gulp.watch(__filename, ['exit-gulp']);
});
