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
    //,debug = require('gulp-debug')
    ,native_exec = require('child_process').exec
    ,exec = require('gulp-exec')
    //,exit = require('gulp-exit')
    ,fs = require('fs')
    //,filter = require('gulp-filter')
    ,less = require('gulp-less')
    //,mincss = require('gulp-minify-css')
    //,path = require('path')
    //,phpunit = require('gulp-phpunit')
    //,phpspec = require('gulp-phpspec')
    //,plumber = require('gulp-plumber')
    //,sass = require('gulp-sass')
    ,sass = require('gulp-ruby-sass')
    ,source = require('vinyl-source-stream')
    ,sourcemaps = require('gulp-sourcemaps')
    //,sys = require('sys')
    //,rename = require('gulp-rename')
    //,uglify = require('gulp-uglify')
    ,gutil = require('gulp-util')
    ,watchify = require('watchify')
    ;

var project = '/project';
var assets = project+'/'+process.env.BASE_DIR;

var paths = {
    styles: assets+'/'+process.env.STYLES_DIR,
    scripts: assets+'/'+process.env.SCRIPTS_DIR,
    svg: assets+'/'+process.env.IMAGES_DIR+'/*.svg',
    //php: project+'/app',
    output_dir: assets
};

gulp.task('browser-sync', function() {
    if (process.env.BACKEND_PORT) {
        browserSync.init({
            proxy: process.env.BACKEND_PORT.substr(6)
        });
    }
});

var browserSyncConfig = {
    stream: true
};

var env = process.env.ENVIRONMENT;

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

var sass_config = {
    style: 'compressed',
    sourcemap: false,
    project: assets,
    import_path: 'bower_components',
    css: './',
    scss: process.env.STYLES_DIR,
    sass: process.env.STYLES_DIR
};

if(env.substr(0, 3) == 'dev' || env == 'local')
{
    sass_config.style = 'nested';
    sass_config.sourcemap = true;
}

gulp.task('sass', function () {
    sass(paths.styles+'/style.sass', {sourcemap: true, style: 'compact'})
        .pipe(autoprefixer("last 1 version", "> 1%", "ie 8", "ie 7"))
        .pipe(sourcemaps('.'))
        .on('error', function (err) {
            gutil.log(err.message);
            this.emit('end');
        })
        .pipe(gulp.dest(paths.output_dir))
        .pipe(exec(commands.sass.post, {pipeStdout: false}))
        .pipe(exec.reporter(report_options))
        .pipe(browserSync.reload(browserSyncConfig))
});

//gulp.task('sass', function() {
//    return gulp.src(paths.styles+'/*')
//        .pipe(exec(commands.sass.pre, {pipeStdout: false}))
//        .pipe(exec.reporter(report_options))
//        //.pipe(filter(['*', '!**/_*^']))
//        .pipe(compass(sass_config))
//        .pipe(autoprefixer({browsers: ['last 2 versions', 'ie 10']}))
//        .on('error', function (err) {
//            gutil.log(err.message);
//            this.emit('end');
//        })
//        .pipe(gulp.dest(paths.output_dir))
//        .pipe(exec(commands.sass.post, {pipeStdout: false}))
//        .pipe(exec.reporter(report_options))
//        .pipe(browserSync.reload(browserSyncConfig))
//});

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

// gulp.task('js', function() {
//     exec(commands.js.pre, {pipeStdout: false});
//     exec.reporter(report_options);

//     var bundler = watchify(browserify(paths.script, {debug: true}), watchify.args);
//     var output_file = 'script.js';
//     bundler.transform('/root/node_modules/browserify-shim');
//     bundler.on('update', rebundle);
//     function rebundle() {
//         return bundler.bundle()
//             .on('error', function (err) {
//                 gutil.log(err.message);
//                 this.emit('end');
//             })
//             .pipe(source(output_file))
//             .pipe(gulp.dest(paths.output_dir))
            

//     }
//     return rebundle();
// });

var createBundle, createBundles;

createBundle = function(options) {
    var bundler = browserify({
        entries: options.input,
        extensions: options.extensions,
        debug: true
    });
    bundler.transform('/root/node_modules/browserify-shim');
    var rebundle = function() {
        var startTime = new Date().getTime();
        return bundler
            .bundle()
            .on('error', function() {
                return console.log(arguments);
            })
            // .pipe(exec(commands.js.pre, {pipeStdout: false}))
            // .pipe(exec.reporter(report_options))
            .pipe(source(options.output))
            .pipe(gulp.dest(options.destination))
            .on('end', function() {
                var time = (new Date().getTime() - startTime) / 1000;
                return console.log("" + options.output.cyan + " was browserified: " + (time + 's').magenta);
            })
            .pipe(browserSync.reload(browserSyncConfig))
            // .pipe(exec(commands.js.post, {pipeStdout: false}))
            // .pipe(exec.reporter(report_options))
            ;
    };

    return rebundle();
};

createBundles = function(bundles) {
    return bundles.forEach(function(bundle) {
        return createBundle({
            input: bundle.input,
            output: bundle.output,
            extensions: bundle.extensions,
            destination: bundle.destination
        });
    });
};

gulp.task('browserify', function() {

    var scripts = fs.readdirSync(paths.scripts);
    var files = [];

    scripts.forEach(function(script) {
        // Do not include dirctories, hidden or underscored scripts
        if (['.', '_'].indexOf(script.substr(0, 1)) !== -1 || fs.lstatSync(paths.scripts+'/'+script).isDirectory()) {
            return;
        }

        files.push({
            input: [paths.scripts+'/'+script],
            output: script,
            extensions: ['.coffee', '.js'],
            destination: paths.output_dir
        });
    });
    return createBundles(files);
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

// gulp.task('php', function() {
//     exec('phpunit', function(error, stdout) {
//         sys.puts(stdout);
//     });
//     browserSync.reload();
// });

gulp.task('watch', ['browser-sync'], function() {
    gulp.watch(paths.styles+'/**/*', ['sass']);
    //gulp.watch(paths.php+'/**/*.php', ['php']);
    gulp.watch(paths.scripts+'/**/*', ['browserify']);
});

//gulp.task('default', ['watch', 'sass', 'coffee', 'js', 'php']);
gulp.task('default', ['watch', 'sass', 'browserify']);
//gulp.task('default', ['watch', 'js']);