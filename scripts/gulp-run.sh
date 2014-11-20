#!/bin/bash
gulpfile="/conf/gulpfile.js"
if [ -f "/project/gulpfile.js" ]
then
	gulpfile="/project/gulpfile.js"
fi
source /usr/local/rvm/scripts/rvm

cd /root
cp -f "$gulpfile" ./gulpfile.js
gulp
