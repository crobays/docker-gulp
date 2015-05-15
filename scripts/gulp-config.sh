#!/bin/bash
cd /project
mkdir -p /project/$BASE_DIR/src/$STYLES_DIR/sass/masters
mkdir -p /project/$BASE_DIR/src/$SCRIPTS_DIR
mkdir -p /project/$BASE_DIR/$IMAGES_DIR

if [ ! -f /project/gulpfile.js ]
then
	cp -f /conf/gulpfile.js /project/gulpfile.js
fi

if [ -f /project/package.json ]
then
	npm install
else
	cp -f /conf/package.json  /project/package.json
fi

for package in gulp \
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
	gulp-insert \
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
do
	if [ $(dot-json ./package.json devDependencies.${package//./..}) ] || [ $(dot-json ./package.json dependencies.${package//./..}) ]
	then
		echo "present: $package"
	else
		echo "missing: $package"
		list="$list $package"
	fi
done

if [ "$list" != "" ]
then
	echo "Installing missing packages..."
	npm install --save-dev $list
fi
