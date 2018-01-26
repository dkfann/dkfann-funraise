import os

class Config(object):
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'sk_test_BQokikJOvBiI2HlWgH4olfQ2'
    PUBLISHABLE_KEY = os.environ.get('PUBLISHABLE_KEY') or 'pk_test_6pRNASCoBOKtIshFeQd4XMUh'
