#!/bin/sh
PREFIX="dev_setup.sh:"
echo "$PREFIX Instaling virtualenv"
sudo pip install virtualenv
echo "$PREFIX Creating virtualenv for project"
virtualenv --no-site-packages --python=python2.7 env
echo "$PREFIX Installing project's python dependencies"
source  env/bin/activate
pip install -r requirements.txt
echo "$PREFIX Creating an example local_settings file"
cd nar_common
cp example_local_settings.py local_settings.py
echo "$PREFIX Setup is ALMOST complete -- modify nar_common/local_settings.py to complete setup"

