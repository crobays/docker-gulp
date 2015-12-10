#!/bin/bash

cd /project

var="$(env | grep _BOILERPLATE_ZIP_URL)"
if [ "${var:${#var}-4:4}" == ".zip" ]
then
	boilerplate=1
fi
while [ ! -f /project/package.json ]
do
	if [ $boilerplate ]
	then
		sleep 1
		continue
	fi

	echo 'No existing package.json: ...creating one!'
	cp /conf/package.json /project/package.json
	break
done

packages="
	bower
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
	npm install --save $list
fi
echo "All gulp packages installed"


if [ -f ./bower.json ]
then
	bower install --allow-root --config.interactive=false
fi
