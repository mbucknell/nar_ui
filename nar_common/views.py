
from django.views.generic import View
from django.http import HttpResponse, HttpResponseServerError

from helpcontent.models import Definition

class NarHealthServiceView(View):
    
    def get(self, request, *args, **kwargs):
        try:
            all_defs = Definition.objects.all()
        except Exception as value:
            return HttpResponseServerError(value)
        else:
            if len(all_defs) > 0:
                return HttpResponse('{"status" : "good"}', content_type='application/json')
            else:
                return HttpResponseServerError("Unexpected database contents : Definition table is empty");
    