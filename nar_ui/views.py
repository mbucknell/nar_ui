from django.views.generic.base import TemplateView
from owslib.wfs import WebFeatureService
from django.conf import settings

class HomePageView(TemplateView):
    template_name = 'nar_ui/home.html'
    
    
class SiteSummaryReportView(TemplateView):
    template_name = 'nar_ui/summary.html'
    
    def get_context_data(self, **kwargs):
        
        context = super(SiteSummaryReportView, self).get_context_data(**kwargs)
        siteId = context.get('siteId', '01646580')
        url = 'http://' + settings.GEOSERVER_HOST_NAME + settings.GEOSERVER_PATH + 'wfs'
        wfs = WebFeatureService(url, '2.0.0')
        typeName = 'NAR:NAWQA100_cy3fsmn'
        
        feature = wfs.getfeature(typename=typeName, featureid=siteId, maxfeatures=1)
        
        return context
    
class SiteFullReportView(TemplateView):
    template_name = 'nar_ui/full_reports.html'

class DemoGraphView(TemplateView):
    template_name = 'nar_ui/demo_graph.html'