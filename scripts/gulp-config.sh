#!/bin/bash
cd /project
if [ ! -d /project/$BASE_DIR/src ]
then
	mkdir -p /project/$BASE_DIR/src/styles/sass/inc
	mkdir -p /project/$BASE_DIR/src/styles/sass/masters
	mkdir -p /project/$BASE_DIR/src/styles/sass/pages
	mkdir -p /project/$BASE_DIR/src/scripts/js
	mkdir -p /project/$BASE_DIR/images
fi

if [ ! -f /project/gulpfile.js ]
then
	cp -f /conf/gulpfile.js /project/gulpfile.js
fi

if [ ! -f /project/package.json ]
then
	cp -f /conf/package.json  /project/package.json
fi

packages="
	gulp
	require-install
"

for section in dependencies devDependencies
do
	echo "Looking for missing project packages ($section)..."
	for package in $(dot-json ./package.json $section)
	do
		if [ "${package:${#package}-1:1}" != ":" ]
		then
			continue
		fi
		package="${package:1:${#package}-3}"
		if [ ! -d "./node_modules/$package" ]
		then
			echo "missing package: $package"
			install=1
		fi
	done
done

if [ $install ]
then
	echo "Installing missing project packages..."
	npm install
fi
echo "All project packages installed"

echo "Looking for missing gulp packages..."
for package in $packages
do
	if [ ! $(dot-json ./package.json devDependencies.${package//./..}) ] && [ ! $(dot-json ./package.json dependencies.${package//./..}) ]
	then
		echo "missing package: $package"
		list="$list $package"
	fi
done

if [ "$list" != "" ]
then
	echo "Installing missing gulp packages..."
	npm install --save-dev $list
fi
echo "All gulp packages installed"



