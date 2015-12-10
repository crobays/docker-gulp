#!/bin/bash
cd /project
source /usr/local/rvm/scripts/rvm
rvm --install --default use $(rvm list strings)

if [ ! -f /project/gulpfile.js ]
then
	cp /conf/gulpfile.js /project/gulpfile.js
fi

while true
do
	gulp
done
