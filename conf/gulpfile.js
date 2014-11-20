var gulp = require('gulp')
    //,autoprefixer = require('gulp-autoprefixer')
    //,browserify = require('browserify')
    ,browserSync = require('browser-sync')
    //,bower = require('gulp-bower')
    //,cache = require('gulp-cache')
    ,coffee = require('gulp-coffee')
    //,coffeelint = require('gulp-coffeelint')
    ,compass = require('gulp-compass')
    ,concat = require('gulp-concat')
    //,cssimport = require("gulp-cssimport")
    //,cssGlobbing = require('gulp-css-globbing')
    //,debug = require('gulp-debug')
    ,native_exec = require('child_process').exec
    ,exec = require('gulp-exec')
    //,exit = require('gulp-exit')
    ,fs = require('fs')
    //,filter = require('gulp-filter')
    //,mincss = require('gulp-minify-css')
    //,bowerFiles = require('main-bower-files')
    //,path = require('path')
    ,phpunit = require('gulp-phpunit')
    ,phpspec = require('gulp-phpspec')
    //,plumber = require('gulp-plumber')
    //,sass = require('gulp-sass')
    //,sourcemaps = require('gulp-sourcemaps')
    //,sys = require('sys')
    //,rename = require('gulp-rename')
    //,uglify = require('gulp-uglify')
    ,gutil = require('gulp-util')
    ;

var project = '/project';

var paths = {
    styles: project+'/assets/styles/*',
    style: project+'/assets/styles/style.*',
    scripts: project+'/assets/scripts/*',
    svg: project+'/images/*.svg',
    php: project+'/app/**/*.php',
    output_dir: project+'/assets'
};

gulp.task('browser-sync', function() {
    browserSync.init({
        proxy: process.env.BACKEND_PORT_80_TCP_ADDR+":80"
    });
});

var browserSyncConfig = {
    stream: true
};

var env = process.env.ENVIRONMENT;

var sass_config = {
    style: 'compressed',
    sourcemap: false,
    project: project+'/assets',
    import_path: 'bower_components',
    css: './',
    scss: 'styles',
    sass: 'styles',
    javascript: 'scripts',
    font: 'fonts',
    image: 'img',
    picture: 'pic'
};

if(env == 'dev' || env == 'local')
{
    sass_config.style = 'nested';
    sass_config.sourcemap = true;
}

var exec_config = {
    pipeStdout: true
};

var report_options = {
    err: true, // default = true, false means don't write err
    stderr: true, // default = true, false means don't write stderr
    stdout: true // default = true, false means don't write stdout
}

var commands = {
    sass: {
        pre: fs.existsSync(project+'/gulp-hooks/sass-pre') ? project+'/gulp-hooks/sass-pre' : 'echo "No sass-pre hook found"',
        post: fs.existsSync(project+'/gulp-hooks/sass-post') ? project+'/gulp-hooks/sass-post' : 'echo "No sass-post hook found"'
    },
    js: {
        pre: fs.existsSync(project+'/gulp-hooks/js-pre') ? project+'/gulp-hooks/js-pre' : 'echo "No js-pre hook found"',
        post: fs.existsSync(project+'/gulp-hooks/js-post') ? project+'/gulp-hooks/js-post' : 'echo "No js-post hook found"'
    }
};

gulp.task('sass', function() {
    return gulp.src(paths.style)
        .pipe(exec(commands.sass.pre, exec_config))
        .pipe(exec.reporter(report_options))
        //.pipe(filter(['*', '!**/_*^']))
        //.pipe(plumber())
        // .pipe(function(){
        //     console.log('change');
        // })
        .pipe(compass(sass_config))
        .on('error', function (err) {
            gutil.log(err.message);
            this.emit('end');
        })
        .pipe(exec(commands.sass.post, exec_config))
        .pipe(exec.reporter(report_options))
        //.pipe(sass(config))
        //.pipe(gulp.dest(paths.output_dir))
        //.pipe(autoprefixer('last 2 versions'))
        .pipe(browserSync.reload(browserSyncConfig))
});

gulp.task('svg', function() {
    return gulp
        .pipe(browserSync.reload(browserSyncConfig))
});

// gulp.task('coffee', function() {
//     return gulp.src(paths.scripts+'.coffee')
//         .pipe(sourcemaps.init())
//         .pipe(coffee({
//             sourceMap: true
//         }).on('error', gutil.log))
//         .pipe(concat(paths.scripts))
//         .pipe(gulp.dest(paths.output_dir))
//         .pipe(browserSync.reload(browserSyncConfig))
//         .pipe(uglify())
//         .pipe(rename({
//             suffix: '.min'
//         }))
//         .pipe(gulp.dest(paths.output_dir))
// });

gulp.task('js', function() {

    var scripts = [
        "assets/bower_components/jquery/dist/jquery.js",
        "assets/scripts/foundation.min.js",
        "assets/scripts/script.js"
    ];
    //bowerFiles();


    return gulp.src(scripts)
        .pipe(exec(commands.js.pre, exec_config))
        .pipe(exec.reporter(report_options))
        // .pipe(filter(['**/*.js', '!**/_*']))
        
        // .pipe(filter(function(file){
        //     console.log(file.path);
        //     return path.basename(file.path).substr(0, 1) != "_";
        // }))
        
        .on('error', function (err) {
            gutil.log(err.message);
            this.emit('end');
        })
        .pipe(concat('script.js'))
        .pipe(exec(commands.js.pre, exec_config))
        .pipe(exec.reporter(report_options))
        //.pipe(browserify({debug: true}))
        
        // .pipe(browserSync.reload(browserSyncConfig))
        // .pipe(uglify())
        // .pipe(rename({
        //     suffix: '.min'
        // }))
        .pipe(gulp.dest(paths.output_dir))
});

// gulp.task('lint', function () {
//     gulp.src(paths.scripts)
//         .pipe(coffeelint())
//         .pipe(coffeelint.reporter())
// });

// gulp.task('bower-copy', function() {
//   return gulp.src(paths.copy)
//   .pipe(sourcemaps.init())
//      .pipe(concat("plugins.js"))
//      .pipe(uglify())
//      .pipe(rename({
//         suffix: '.min'
//     }))
//     .pipe(gulp.dest(paths.output_dir))
// });

// gulp.task('bower-merge', function() {
//   return gulp.src(paths.scripts)
//     .pipe(sourcemaps.init())
//     .pipe(concat("plugins.js"))
//     .pipe(uglify())
//     .pipe(sourcemaps.write())
//     .pipe(gulp.dest(paths.coffee.output.dir));
// });

//gulp.task('bower', ['bower-copy']);

gulp.task('php', function() {
    exec('phpunit', function(error, stdout) {
        sys.puts(stdout);
    });
    browserSync.reload();
});

// gulp.task('bower', function() {
//     return gulp.src(bower)
//         .pipe(sass({
//             style: 'expanded'
//         }).on('error', gutil.log))
//         .pipe(autoprefixer('last 2 versions'))
//         .pipe(concat('bower.css'))
//         .pipe(gulp.dest(paths.css.output.dir))
//         .pipe(browserSync.reload({
//             stream: true
//         }));
// });

gulp.task('watch', ['browser-sync'], function() {
    gulp.watch(paths.styles, ['sass']);
    gulp.watch(paths.scripts, ['js']);
    gulp.watch(paths.svg, ['svg']);
    gulp.watch(paths.php, ['php']);

    // gulp.watch(mainBowerFiles, ['bower']);
    // gulp.watch(paths.input.scripts.dir+'/'+paths.input.scripts.file, ['phpunit']).on('change', function(file){
    //  server.changed(file.path);
    // });
    // gulp.watch(paths.input.styles.dir+'/'+paths.css.input.file, ['phpunit']).on('change', function(file){
    //  server.changed(file.path);
    // });
    // gulp.watch('app/**/*.php', ['phpunit']).on('change', function(file){
    //  server.changed(file.path);
    // });
});

//gulp.task('default', ['watch', 'sass', 'coffee', 'js', 'php']);
gulp.task('default', ['watch', 'sass', 'js', 'php']);