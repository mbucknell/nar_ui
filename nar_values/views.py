
import simplejson

from django.core.exceptions import ObjectDoesNotExist
from django.http import HttpResponse, Http404, HttpResponseBadRequest
from django.views.generic import View

from .models import MrbSubBasinContributions


class MrbSubBasinContributionsJsonView(View):
    query_params = ['constituent', 'parameter_type', 'water_year']
    
    def get(self, request, *args, **kwargs):
        """given adequate query params, return a map of basin name to contribution amount"""
        
        safe_query_values = {}

        for query_param in self.query_params:
            if query_param in request.GET:
                safe_query_values[query_param] = request.GET[query_param]
            else:
                #require all query parameters
                return HttpResponseBadRequest('Missing Parameter - "{}"'.format(query_param))

        try:
            mrbSubBasinContributions = MrbSubBasinContributions.objects.filter(**safe_query_values)
            if(0 == len(mrbSubBasinContributions)):
                raise Http404
            results = {}
            for mrbSubBasinContribution in mrbSubBasinContributions:
                results[mrbSubBasinContribution.basin_name] = mrbSubBasinContribution.contribution

            return HttpResponse(simplejson.dumps(results), content_type='application/json')
        except ObjectDoesNotExist:
                raise Http404

