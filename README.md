# nar-ui
======

NAWQA Annual Reporting User Interface

## Installation

### On *nix:
dev_setup.sh

### On Windows:
win_dev_setup.bat
2_win_dev_setup.bat

## Running HTTPS

```
#after activating virtualenv
python manage.py runserver_plus --cert cert
```
Then visit the url indicated in the output.
This will generate a self-signed SSL cert. The first time you visit this you will need to trust it.


## Running HTTP

```
#after activating virtual env
python manage.py runserver
```
Then visit the url indicated in the output.
