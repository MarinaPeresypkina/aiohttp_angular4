import os
import logging


log = logging.getLogger('app')
log.setLevel(logging.DEBUG)

DATABASE = {
    'drivername': 'postgres',
    'host': 'localhost',
    'port': '5432',
    'username': 'aio_chat',
    'password': 'aio_chat',
    'database': 'aio_chat'
}

SECRET_KEY = '&z8=0cwf8xqughzs53)c)q3icd58cfvc)4$io05b'

PROJECT_ROOT = os.path.dirname(os.path.abspath(__file__))
STATIC = 'static'
STATIC_ROOT = os.path.join(PROJECT_ROOT, STATIC)
MEDIA = 'media'
