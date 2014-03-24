
from datetime import datetime
from django.conf import settings

def default(request):

    # you can declare any variable that you would like and pass 
    # them as a dictionary to be added to each template's context like so:
    return dict(
        settings = settings
    )