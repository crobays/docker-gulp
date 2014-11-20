FROM phusion/baseimage:0.9.15
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

RUN gem install sass -v 3.4.5
RUN gem install compass
RUN gem uninstall sass -v 3.4.6 2&>/dev/null

RUN apt-get install -y software-properties-common && \
	add-apt-repository -y ppa:nginx/stable && \
	apt-get update

RUN apt-get install -y \
					php5-cli \
					php5-fpm \
					php5-mysql \
					php5-pgsql \
					php5-sqlite \
					php5-curl \
					php5-gd \
					php5-mcrypt \
					php5-memcache \
					php5-intl \
					php5-imap \
					php5-tidy

ADD /scripts/download-and-install.sh /scripts/download-and-install.sh
ADD /scripts/node.sh /scripts/node.sh
RUN /scripts/node.sh

ENV PATH /usr/local/node/bin:$PATH

WORKDIR /root

RUN npm install -g gulp
RUN npm install \
	gulp \
	browser-sync \
	gulp-coffee \
	gulp-compass \
	gulp-concat \
	gulp-exec \
	gulp-phpunit \
	gulp-phpspec \
	gulp-util

# RUN npm install -g \
# 	gulp-autoprefixer \
# 	gulp-bower \
# 	main-bower-files \
# 	gulp-browserify \
# 	gulp-cache \
# 	gulp-coffeelint \
# 	gulp-cssimport \
# 	gulp-css-globbing \
# 	gulp-exit \
# 	gulp-filter \
# 	gulp-minify-css \
# 	gulp-sourcemaps \
# 	gulp-sass \
# 	gulp-ruby-sass \
# 	gulp-rename \
# 	gulp-uglify

# Exposed ENV
ENV TIMEZONE Etc/UTC
ENV ENVIRONMENT prod

VOLUME  ["/project"]

# BrowserSync port
EXPOSE 3000

# Clean up APT when done.
RUN apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

RUN mkdir /etc/service/gulp
ADD /scripts/gulp-run.sh /etc/service/gulp/run

RUN echo "#!/bin/bash\necho \"\$TIMEZONE\" > /etc/timezone && dpkg-reconfigure -f noninteractive tzdata" > /etc/my_init.d/01-timezone.sh
ADD /scripts/php-config.sh /etc/my_init.d/02-php-config.sh
ADD /scripts/gulp-config.sh /etc/my_init.d/03-gulp-config.sh

RUN chmod +x /etc/my_init.d/* && chmod +x /etc/service/*/run

ADD /conf /conf

# docker build \
#   -t crobays/gulp \
#   /workspace/docker/crobays/gulp && \
# docker run \
#   -v /workspace/projects/james-mijdrecht/www-jamesmijdrecht-nl:/project \
#   -e ENVIRONMENT=dev \
#   -e TIMEZONE=Europe/Amsterdam \
#   -it --rm \
#   crobays/gulp bash

# /etc/my_init.d/01-timezone.sh ;/etc/my_init.d/02-gulp-config.sh
