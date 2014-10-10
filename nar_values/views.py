
import simplejson

from django.core.exceptions import ObjectDoesNotExist
from django.forms import model_to_dict
from django.http import HttpResponse, Http404, HttpResponseBadRequest
from django.views.generic import View

from .models import MrbSubBasinContributions, SiteMeanAndTarget, SiteMovingAverage


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


class SiteAveragesAndTargetsJsonView(View):
    
    query_params = ['site_id', 'constituent']
    
    def get(self, request, *args, **kwargs):
        safe_query_values = {}

        for query_param in self.query_params:
            if query_param in request.GET:
                safe_query_values[query_param] = request.GET[query_param]
            else:
                #require all query parameters
                return HttpResponseBadRequest('Missing Parameter - "{}"'.format(query_param))
        
        try:    
            mean_target = SiteMeanAndTarget.objects.get(**safe_query_values)
        except ObjectDoesNotExist:
            raise Http404
        
        moving_averages_qs = SiteMovingAverage.objects.filter(**safe_query_values).order_by('water_year')
        moving_averages = [dict(water_year=m.water_year, annual_moving_average=m.annual_moving_average, may_moving_average=m.may_moving_average) for m in moving_averages_qs]
        
        result = model_to_dict(mean_target)
        result['moving_average'] = moving_averages
        
        return HttpResponse(simplejson.dumps(result), content_type='application/json')
        
            
        
            
            