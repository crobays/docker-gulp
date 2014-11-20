#!/bin/bash
mkdir -p "/project/assets/bower_components"
mkdir -p "/project/assets/fonts"
mkdir -p "/project/assets/images"
mkdir -p "/project/assets/pictures"

mkdir -p "/project/assets/styles"
if [ ! -f "/project/assets/styles/style.sass" ];then
	echo -e "body\n\tbackground-color: #eee" > "/project/assets/styles/style.sass"
fi

mkdir -p "/project/assets/scripts"
if [ ! -f "/project/assets/scripts/script.js" ];then
	echo -e "console.log(\"hello world\");" > "/project/assets/scripts/script.js"
fi

if [ ! -d /project/gulp-hooks ];then
	cp --recursive /conf/gulp-hooks /project/gulp-hooks
fi