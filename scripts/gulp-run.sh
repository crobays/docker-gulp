#!/bin/bash
cd /root

if [ -f /project/gulpfile.js ]
then
	cp -f /project/gulpfile.js ./gulpfile.js
else
	cp -f /conf/gulpfile.js ./gulpfile.js
fi
source /usr/local/rvm/scripts/rvm
if [ -f /project/package.json ]
then
	cp -f /project/package.json ./package.json
	npm install
fi
gulp
