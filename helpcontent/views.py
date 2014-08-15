
import simplejson

from django.core.exceptions import ObjectDoesNotExist
from django.forms import model_to_dict
from django.http import HttpResponse, Http404
from django.views.generic import View, ListView

from .models import Definition, SiteLinkInfo, SiteEcoregionCriteriaInfo


class DefinitionsView(ListView):
    model = Definition
    context_object_name = 'definitions'
    template_name = 'definition_of_terms.html'
    

class DefinitionsJsonView(View):

    def get(self, request, *args, **kwargs):
        defs = {}
        for d in Definition.objects.all():
            defs[d.get_dict_key()] = model_to_dict(d)
            
        return HttpResponse(simplejson.dumps(defs), content_type='application/json')
    
    
class SiteInfoJsonView(View):
    
    def get(self, request, *args, **kwargs):
        if 'site_id' in request.GET:
            try:
                link_info = SiteLinkInfo.objects.get(natqw_site=request.GET['site_id'])
                criteria = SiteEcoregionCriteriaInfo.objects.get(natqw_site=request.GET['site_id'])
            except ObjectDoesNotExist:
                raise Http404   
            
            result = model_to_dict(criteria)
            del result['id']
            result['realtime_streamflow_link'] = link_info.realtime_streamflow_link
            result['nwisweb_link'] = link_info.nwisweb_link
            result['flow_compared_to_historic_link'] = link_info.flow_compared_to_historic_link
            
            return HttpResponse(simplejson.dumps(result), content_type='application/json')
        
        raise Http404
