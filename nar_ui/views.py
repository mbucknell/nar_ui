from django.views.generic.base import TemplateView
from django.conf import settings
import models

class HomePageView(TemplateView):
    template_name = 'nar_ui/home.html'
    
    
class SiteSummaryReportView(TemplateView):
    template_name = 'nar_ui/summary.html'
    
    def get_context_data(self, **kwargs):
        
        context = super(SiteSummaryReportView, self).get_context_data(**kwargs)
        site_id = context.get('site_id', '01646580')
        url = 'http://' + settings.GEOSERVER_HOST_NAME + settings.GEOSERVER_PATH + 'wfs'
        site_name = models.get_site_name(site_id, url)
        context['site_name'] = site_name
        
        return context
    
class SiteFullReportView(TemplateView):
    template_name = 'nar_ui/full_reports.html'

class DemoGraphView(TemplateView):
    template_name = 'nar_ui/demo_graph.html'