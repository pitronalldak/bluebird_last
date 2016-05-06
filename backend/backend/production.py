from .base import *

DEBUG = False

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'bluebird',
        'USER': 'bluebird',
        'PASSWORD': 'bluebird',
        'HOST': '',
        'PORT': '',
    }
}

FRONTEND_URL = 'http://partnervine-dev.10clouds.com'
BACKEND_URL = 'http://partnervine-dev.10clouds.com'
LINKEDIN_CLIENT_ID = '77q0khphqrr577'
LINKEDIN_CLIENT_SECRET = '7AgaExWIjHY0OB1y'
LINKEDIN_AUTH_URL = 'https://www.linkedin.com/uas/oauth2/authorization?response_type=code&client_id={0}&redirect_uri={1}/api/auth/linkedin/&state=987654321&scope=r_basicprofile%20r_emailaddress'.format(LINKEDIN_CLIENT_ID, BACKEND_URL)

ALLOWED_HOSTS = ['*']
