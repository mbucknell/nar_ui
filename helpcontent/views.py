
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
    queryset = Definition.objects.all().order_by('term')
    context_object_name = 'definitions'
    template_name = 'definition_of_terms.html'
    

class AboutView(FeedContextMixin, TemplateView):
    
    template_name = 'about.html'
    feed_titles = [{'context_name' : 'about_feed', 'title' :'NAR+about+feed', 'label' : 'about_nawqa_annual_reports'}]
    

class NationalFixedSiteNetworkView(FeedContextMixin, TemplateView):
    
    template_name = 'national_fixed_site_network.html'
    feed_titles = [{'context_name' : 'fixed_site_feed', 'title' : 'National+Fixed+Site+Network', 'label' : 'objectives_national_fixed_site_network'}]


class NetworkSiteListView(FeedContextMixin, TemplateView):
    
    template_name = 'network_site_list.html'
    feed_titles = [{'context_name' : 'network_site_list_feed', 'title' : 'Network+Site+List', 'label' : 'network_site_list'}]


class QualityControlView(FeedContextMixin, TemplateView):
    
    template_name = 'quality_control.html'
    feed_titles = [{'context_name' : 'quality_control_feed', 'title' : 'Quality+Control', 'label' : 'quality_control'}]


class PreviousNetworkInformationView(FeedContextMixin, TemplateView):
    
    template_name = 'previous_network_info.html'
    feed_titles = [
        {'context_name' : 'nasqan_1974_1995_feed', 'title' : 'NASQAN+1974-1995', 'label' : 'nasqan_1974_1995'},
        {'context_name' : 'nasqan_1996_2000_feed', 'title' : 'NASQAN+1996-2000', 'label' : 'nasqan_1996_2000'},
        {'context_name' : 'nasqan_2001_2007_feed', 'title' : 'NASQAN+2001-2007', 'label' : 'nasqan_2001_2007'},
        {'context_name' : 'nawqa_1991_2001_feed', 'title' : 'NAWQA+1991-2001', 'label' : 'nawqa_1991_2001'},
        {'context_name' : 'nawqa_2002_2012_feed', 'title' : 'NAWQA+2002-2012', 'label' : 'nawqa_2002_2012'}
    ]

class LaboratoryView(FeedContextMixin, TemplateView):
    
    template_name = 'laboratory.html'
    feed_titles = [{'context_name' : 'laboratory_feed', 'title' : 'Laboratory', 'label' : 'laboratory'}]
    
    
class SampleCollectionView(FeedContextMixin, TemplateView):
    
    template_name = 'sample_collection.html'
    feed_titles = [{'context_name' : 'sample_collection_feed', 'title' : 'Sample+Collection', 'label' : 'sample_collection'}]    
    
    
class TechnicalInformationView(FeedContextMixin, TemplateView):
    
    template_name = 'technical_information.html'
    feed_titles = [{'context_name' : 'technical_info_feed', 'title' : 'Technical+Information', 'label' : 'technical_info'}]
    
    
class ConstituentView(FeedContextMixin, TemplateView):
    
    template_name = 'constituents.html'
    feed_titles = [{'context_name' : 'constituent_feed', 'title' : 'Constituent+List', 'label' : 'constituent'}]
  
  
class ContactsAndCitationsView(FeedContextMixin, TemplateView):
    template_name = 'contacts_and_citations.html'
    feed_titles = [{'context_name' : 'contacts_feed', 'title' : 'Contacts+and+Citations', 'label' : 'contacts_and_citations'}]  
    
    
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
