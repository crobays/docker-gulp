#!/bin/bash
cd /root
prev_last_modified_gulpfile="$(stat -c %y /project/gulpfile.js)"
prev_last_modified_package="$(stat -c %y /project/package.json)"
while true
do
	last_modified_gulpfile="$(stat -c %y /project/gulpfile.js)"
	if [ "$prev_last_modified_gulpfile" != "$last_modified_gulpfile" ]
	then
		prev_last_modified_gulpfile="$last_modified_gulpfile"
		cp -f /project/gulpfile.js /root/gulpfile.js
		echo "Gulpfile.js modified"
	fi
	last_modified_package="$(stat -c %y /project/package.json)"
	if [ "$prev_last_modified_package" != "$last_modified_package" ]
	then
		prev_last_modified_package="$last_modified_package"
		cp -f /project/package.json /root/package.json
		npm install
		echo "package.json modified"
	fi
	sleep 1
done
