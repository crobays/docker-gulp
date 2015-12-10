FROM phusion/baseimage:0.9.17
CMD ["/sbin/my_init"]

MAINTAINER Crobays <crobays@userex.nl>

ENV HOME /root
ENV DOCKER_NAME gulp
ENV DEBIAN_FRONTEND noninteractive

RUN apt-get update
RUN apt-get dist-upgrade -y

RUN apt-get install -y curl

ADD /scripts/rvm.sh /scripts/rvm.sh
RUN /scripts/rvm.sh
ENV PATH /usr/local/rvm/bin:$PATH

RUN apt-get install -y \
	software-properties-common \
	libjpeg-dev \
	jpegoptim \
	optipng

ADD /scripts/download-and-install.sh /scripts/download-and-install.sh
ADD /scripts/node.sh /scripts/node.sh
RUN /scripts/node.sh

RUN gem install sass

ENV PATH /usr/local/node/bin:/root/node_modules/.bin:./node_modules/.bin:$PATH

RUN npm install -g \
	gulp \
	dot-json
	
WORKDIR /project

# Exposed ENV
ENV TIMEZONE Etc/UTC
ENV ENVIRONMENT production
ENV BASE_DIR src/static/app

VOLUME ["/project"]

# BrowserSync port
EXPOSE 3000 3001

RUN echo '/sbin/my_init' > /root/.bash_history

# Clean up APT when done.
RUN apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

RUN mkdir /etc/service/gulp
ADD /scripts/gulp-run.sh /etc/service/gulp/run
RUN mkdir /etc/service/watch-files
ADD /scripts/watch-files-run.sh /etc/service/watch-files/run

RUN echo "#!/bin/bash\necho \"\$TIMEZONE\" > /etc/timezone && dpkg-reconfigure -f noninteractive tzdata" > /etc/my_init.d/01-timezone.sh
ADD /scripts/gulp-config.sh /etc/my_init.d/02-gulp-config.sh

RUN chmod +x /etc/my_init.d/* && chmod +x /etc/service/*/run

ADD /conf /conf
