FROM phusion/baseimage:0.9.16
ENV HOME /root
RUN /etc/my_init.d/00_regen_ssh_host_keys.sh
CMD ["/sbin/my_init"]

MAINTAINER Crobays <crobays@userex.nl>
ENV DOCKER_NAME gulp
ENV DEBIAN_FRONTEND noninteractive

RUN apt-get update
RUN apt-get dist-upgrade -y

RUN apt-get install -y curl

ADD /scripts/rvm.sh /scripts/rvm.sh
RUN /scripts/rvm.sh
ENV PATH /usr/local/rvm/bin:$PATH

RUN gem install sass -v 3.4.9
RUN gem install compass
RUN gem uninstall sass -v 3.4.6 2&>/dev/null

RUN apt-get install -y software-properties-common && \
	add-apt-repository -y ppa:nginx/stable && \
	apt-get update

ADD /scripts/download-and-install.sh /scripts/download-and-install.sh
ADD /scripts/node.sh /scripts/node.sh
RUN /scripts/node.sh

ENV PATH /usr/local/node/bin:/root/node_modules/.bin:./node_modules/.bin:$PATH

WORKDIR /project

RUN npm install -g gulp
RUN cd /root && npm install \
	gulp \
	gulp-autoprefixer \
 	gulp-bower \
	browser-sync \
 	browserify \
 	browserify-shim
RUN cd /root && npm install \
 	gulp-cache \
	gulp-coffee \
	colors \
	gulp-compass \
	gulp-concat \
	del \
	gulp-exec
RUN cd /root && npm install \
	globule \
	gulp-imagemin \
	imagemin-jpegoptim \
	imagemin-optipng \
	gulp-jshint \
	gulp-less \
	gulp-livereload
RUN cd /root && npm install \
 	gulp-minify-css \
 	gulp-notify \
	gulp-phpunit \
	gulp-phpspec \
	gulp-ruby-sass \
	gulp-sass
RUN cd /root && npm install \
	vinyl-source-stream \
 	gulp-rename \
 	gulp-sourcemaps \
 	gulp-uglify \
	gulp-util \
	watchify

RUN cd /root && npm install \
	fs.extra

# RUN npm install -g \
# 	main-bower-files \
# 	gulp-coffeelint \
# 	gulp-cssimport \
# 	gulp-css-globbing \
# 	gulp-exit \
# 	gulp-filter \
# 	gulp-sass \

# Exposed ENV
ENV TIMEZONE Etc/UTC
ENV ENVIRONMENT production
ENV BASE_DIR static/app
ENV STYLES_DIR styles
ENV SCRIPTS_DIR scripts
ENV IMAGES_DIR images

VOLUME ["/project"]

# BrowserSync port
EXPOSE 3000 3001

RUN echo '/sbin/my_init' > /root/.bash_history

# Clean up APT when done.
RUN apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

RUN mkdir /etc/service/gulp
ADD /scripts/gulp-run.sh /etc/service/gulp/run

RUN echo "#!/bin/bash\necho \"\$TIMEZONE\" > /etc/timezone && dpkg-reconfigure -f noninteractive tzdata" > /etc/my_init.d/01-timezone.sh
ADD /scripts/gulp-config.sh /etc/my_init.d/02-gulp-config.sh

RUN chmod +x /etc/my_init.d/* && chmod +x /etc/service/*/run

ADD /conf /conf

# docker build \
# --tag crobays/gulp \
# /workspace/docker/crobays/gulp && \
# docker run \
# -v /workspace/projects/kwekerij-vlasman/www-kwekerijvlasman-nl:/project \
# -p 3000:3000 \
# -e ENVIRONMENT=dev \
# -e TIMEZONE=Europe/Amsterdam \
# --name gulp \
# -it --rm \
# crobays/gulp


# docker run \
#   -v /workspace/projects/crobays/foundation-apps:/project \
#   -p 3000:3000 \
#   -e ENVIRONMENT=dev \
#   -e TIMEZONE=Europe/Amsterdam \
#   -it --rm \
#   crobays/gulp bash

# /etc/my_init.d/01-timezone.sh ;/etc/my_init.d/02-gulp-config.sh
