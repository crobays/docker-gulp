## Run Gulp in a container on top of [phusion/baseimage](https://github.com/phusion/baseimage-docker)

	docker build \
		 --name crobays/gulp \
		 .

	docker run \
		-p 3000:3000 \
		-p 3001:3001 \
		-e TIMEZONE=Europe/Amsterdam \
		-v ./:/project \
		crobays/gulp
