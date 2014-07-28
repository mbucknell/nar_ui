
# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/1.6/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'ChangeMe'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

TEMPLATE_DEBUG = True

ALLOWED_HOSTS = ['localhost', '127.0.0.1']

BASE_URL = '/'

STATIC_URL = BASE_URL + 'static/'

SOS_HOST_NAME = 'cida-eros-nardev.er.usgs.gov'

#no trailing slash

SOS_PATH = ':8080/nawqareports/service/sos/sos'

GEOSERVER_HOST_NAME = 'cida-eros-nardev.er.usgs.gov'

GEOSERVER_PATH = ':8080/nawqareports/service/geoserver/'
