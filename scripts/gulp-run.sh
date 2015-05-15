#!/bin/bash
cd /project
source /usr/local/rvm/scripts/rvm
rvm --install --default use $(rvm list strings)
while true
do
	gulp
done