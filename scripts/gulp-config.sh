#!/bin/bash
mkdir -p /project/$BASE_DIR/$STYLES_DIR
mkdir -p /project/$BASE_DIR/$SCRIPTS_DIR
mkdir -p /project/$BASE_DIR/$IMAGES_DIR

if [ ! -f /project/gulpfile.js ]
then
	cp -f /conf/gulpfile.js /project/gulpfile.js
fi

source /usr/local/rvm/scripts/rvm
if [ ! -f /project/package.json ]
then
	cp -f /conf/package.json /project/package.json
fi
npm install --save \
	gulp \
	gulp-autoprefixer \
 	gulp-bower \
	browser-sync \
 	browserify \
 	browserify-shim \
 	gulp-cache \
	gulp-coffee \
	colors \
	gulp-compass \
	gulp-concat \
	del \
	gulp-exec \
	globule \
	gulp-imagemin \
	imagemin-jpegoptim \
	imagemin-optipng \
	gulp-jshint \
	gulp-less \
 	gulp-minify-css \
	gulp-phpunit \
	gulp-phpspec \
	gulp-ruby-sass \
	gulp-sass \
 	gulp-rename \
 	gulp-sourcemaps \
 	gulp-uglify \
	gulp-util \
	watchify \
	fs.extra

npm install

