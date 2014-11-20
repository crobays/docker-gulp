#!/bin/bash
INITIAL_PATH="$PATH" 

curl --url https://get.rvm.io \
	--location \
	--silent | \
		bash -s \
			master \
			--ruby \
			--autolibs=enable \
			--auto-dotfiles \
			--quiet-curl

source /usr/local/rvm/scripts/rvm

ln --symbolic "$(which ruby)" /usr/local/bin/ruby
ln --symbolic "$(which gem)" /usr/local/bin/gem

echo "export PATH=\"${PATH/$INITIAL_PATH/\$PATH}\"" >> /root/.bashrc
echo "source /usr/local/rvm/scripts/rvm" >> /root/.bashrc

unset INITIAL_PATH