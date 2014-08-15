
import json

from django.forms import model_to_dict
from django.http import HttpResponse
from django.views.generic import View

from .models import Definition

class DefinitionsJsonView(View):

    def get(self, request, *args, **kwargs):
        defs = {}
        for d in Definition.objects.all():
            defs[d.get_dict_key()] = model_to_dict(d)
            
        return HttpResponse(json.dumps(defs), content_type='application/json')
