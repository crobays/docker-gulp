#!/bin/bash
cd /root

if [ ! -f /project/gulpfile.js ]
then
	cp -f /conf/gulpfile.js /project/gulpfile.js
fi

cp -f /project/gulpfile.js ./gulpfile.js

source /usr/local/rvm/scripts/rvm
if [ -f /project/package.json ]
then
	cp -f /project/package.json ./package.json
	npm install
fi
gulp
