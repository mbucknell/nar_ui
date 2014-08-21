
import simplejson

from django.core.exceptions import ObjectDoesNotExist
from django.forms import model_to_dict
from django.http import HttpResponse, Http404
from django.views.generic import View, ListView, TemplateView
from django.views.generic.base import ContextMixin 

from .models import Definition, SiteLinkInfo, SiteEcoregionCriteriaInfo


class FeedContextMixin(ContextMixin):
    ''' 
    Extends ContextMixin to include context variables for feed urls.
    The feed_titles attribute should be a list of dictionaries. Each dictionary should have
    three keys, context_name, title, and label. The context_name value will be the context variable name.
    The title and label keys are used to form the url and should be the title and label parameters from the
    My USGS RSS feed builder for the page. 
    '''
    
    feed_titles = {} # Dictionary where each value is a dictionary with a title keay and a label key
    
    def get_my_usgs_feed_url(self, title, label):
        return 'https://my.usgs.gov/confluence/createrssfeed.action?types=page&types=atlassian-mail&spaces=TrackingWaterQuality&title=' + title + '&labelString=' + label + '&excludedSpaceKeys%3D&sort=modified&maxResults=1&timeSpan=3650&showContent=true&confirm=Create+RSS+Feed' 
    
    def get_context_data(self, **kwargs):
        context = super(FeedContextMixin, self).get_context_data(**kwargs)
        
        feed_context = dict([f['context_name'], self.get_my_usgs_feed_url(f['title'], f['label'])] for f in self.feed_titles)
        context.update(feed_context)
        return context
    

class DefinitionsView(ListView):
    model = Definition
    context_object_name = 'definitions'
    template_name = 'definition_of_terms.html'
    
class AboutView(FeedContextMixin, TemplateView):
    
    template_name = 'about.html'
    feed_titles = [{'context_name' : 'about_feed', 'title' :'NAR+about+feed', 'label' : 'about_nawqa_annual_reports'}]
    

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
