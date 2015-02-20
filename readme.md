## Run Gulp in a container on top of [phusion/baseimage](https://github.com/phusion/baseimage-docker)

	docker build \
		 --name crobays/gulp \
		 .

	docker run \
		-v ./:/project \
		crobays/gulp
