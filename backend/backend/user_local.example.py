from .local import *

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
