#!/bin/bash
cd /root
if [ -f "/project/gulpfile.js" ]
then
	gulpfile="./gulpfile-custom.js"
	cp -f /project/gulpfile.js $gulpfile
else
	gulpfile="./gulpfile.js"
	cp -f /conf/gulpfile.js $gulpfile
fi
source /usr/local/rvm/scripts/rvm

gulp --gulpfile="$gulpfile"
