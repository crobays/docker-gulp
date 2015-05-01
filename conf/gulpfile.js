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
    ,spawn = require('child_process').spawn
    ,exec = require('gulp-exec')
    //,exit = require('gulp-exit')
    ,fs = require('fs')
    //,filter = require('gulp-filter')
    //,less = require('gulp-less')
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

var project = '/project';

try {
    fs.statSync(project);
}
catch(e) {
    project = '.';
};

var styles_dir = process.env.STYLES_DIR,
    scripts_dir = process.env.SCRIPTS_DIR,
    base_path = project+'/'+process.env.BASE_DIR;

var paths = {
    src: project+'/src/',
    styles: base_path+'/src/'+styles_dir,
    sass: base_path+'/src/'+styles_dir+'/sass',
    scripts: base_path+'/src/'+scripts_dir,
    output: base_path+'/dist',
    bower: base_path+'/bower_components',
};

process.stdout.write('base_path styles: '+paths.styles+"\n");
process.stdout.write('base_path scripts: '+paths.scripts+"\n");
process.stdout.write('output styles: '+paths.output+"/styles\n");
process.stdout.write('output scripts: '+paths.output+"/scripts\n");

var reload = browserSync.reload;
var browserSyncConfig = {
    stream: true
};

var report_options = {
    err: true, // default = true, false means don't write err
    stderr: true, // default = true, false means don't write stderr
    stdout: true // default = true, false means don't write stdout
}

var browsers = ["last 1 version", "> 1%", "ie 8", "ie 7"];
gulp.task('sass', function () {
    gulp.src(paths.sass+'/*.sass')
        //.pipe(minifycss())
        .pipe(sourcemaps.init())
        .pipe(sass({
            indentedSyntax: true,
            errLogToConsole: true
        }))
        .pipe(autoprefixer({browsers: browsers}))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(paths.output+"/"+styles_dir))
        .pipe(exec.reporter(report_options))
        .pipe(reload(browserSyncConfig));

    //sass(paths.sass+'/*.sass', {
    //        sourcemap: false,
    //        style: 'compressed',
    //    })
    //    //.pipe(autoprefixer({browsers: browsers}))
    //    .pipe(minifycss())
    //    .pipe(gulp.dest(paths.output));
});

gulp.task('js:all', function() {
    var files = [
        paths.bower+'/modernizr/modernizr.js',
        paths.bower+'/jquery/dist/jquery.js',
        paths.bower+'/raven-js/dist/raven.js',
        paths.bower+'/fastclick/lib/fastclick.js',
        paths.bower+'/foundation/js/foundation/foundation.js',
        paths.bower+'/foundation/js/foundation/foundation.topbar.js',
        paths.bower+'/foundation/js/foundation/foundation.offcanvas.js',
        paths.scripts+'/main.js',
    ];

    gulp.src(files)
        .pipe(sourcemaps.init())
        .pipe(concat('all.js'))
        //.pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(paths.output+"/"+scripts_dir))
        .pipe(reload(browserSyncConfig));
    //gulp.src(files)
    //    .pipe(concat('all.js'))
    //    .pipe(uglify())
    //    .pipe(gulp.dest(paths.output+"/scripts"));
});

gulp.task('js:ie', function() {
    var files = [
        paths.bower+'/selectivzr.foundation/selectivzr.js',
    ];
    gulp.src(files)
        .pipe(sourcemaps.init())
        .pipe(concat('ie.js'))
        //.pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(paths.output+"/"+scripts_dir))
        .pipe(reload(browserSyncConfig));
    //gulp.src(files)
    //    .pipe(concat('ie.js'))
    //    .pipe(uglify())
    //    //.pipe(rename({suffix: '.min'}))
    //    .pipe(gulp.dest(paths.output+"/scripts"));
});

var backend_tcp = process.env.BACKEND_PORT_8000_TCP ? process.env.BACKEND_PORT_8000_TCP : process.env.BACKEND_PORT;

gulp.task('watch', function() {
    browserSync.init({
        proxy: backend_tcp ? backend_tcp.substr(6) : 'localhost:8000'
    });
    gulp.watch(paths.styles+'/**/*.sass', ['sass']);
    gulp.watch(paths.scripts+'/**/*.js', ['js:all', 'js:ie',]);
    gulp.watch(paths.src+"/**/*.py").on('change', reload);
    gulp.watch(paths.src+"/**/*.html").on('change', reload);
});

gulp.task('initial-task', ['watch', 'sass', 'js:all', 'js:ie',]);

var p;
gulp.task('autoreload-gulp', function(){
    // kill previous spawned process
    if (p) {
        p.kill();
        browserSync.exit();
    }

    // `spawn` a child `gulp` process linked to the parent `stdio`
    p = spawn('gulp', ['initial-task'], {stdio: 'inherit'});
});

gulp.task('gulpfile-watch', function(){
    gulp.watch(__filename, ['autoreload-gulp']);
});
gulp.task('default', ['autoreload-gulp', 'gulpfile-watch'])
