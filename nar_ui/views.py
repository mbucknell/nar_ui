from django.views.generic.base import TemplateView
from django.conf import settings
import re
from StringIO import StringIO
from lxml import etree
from pip._vendor import requests

class HomePageView(TemplateView):
    template_name = 'nar_ui/home.html'
    
    
class SiteSummaryReportView(TemplateView):
    template_name = 'nar_ui/summary.html'
    
    def get_context_data(self, **kwargs):
        
        context = super(SiteSummaryReportView, self).get_context_data(**kwargs)
        site_id = context.get('siteId', '01646580')
        url = 'http://' + settings.GEOSERVER_HOST_NAME + settings.GEOSERVER_PATH + 'wfs'
        
        filter = """
        <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
           <ogc:PropertyIsEqualTo>
            <ogc:PropertyName>NAR:staid</ogc:PropertyName>
            """
        filter += '<ogc:Literal>' +site_id +'</ogc:Literal>' + """
           </ogc:PropertyIsEqualTo>
        </ogc:Filter>
        """
        filter = re.sub(r'\s{2,}', '',  filter)
        
        params = {
                  'service': 'WFS',
                  'version': '2.0.0',
                  'request': 'GetFeature',
                  'typeName': 'NAR:NAWQA100_cy3fsmn',
                  'filter': filter,
        }
        
        my_request = requests.get(url, params=params)
        xml_pseudo_file = StringIO(my_request.content)
        tree = etree.parse(xml_pseudo_file)
        
        site_name = tree.xpath('//NAR:staname', namespaces={'NAR':'http://cida.usgs.gov/NAR'})[0].text
        
        context['site_name'] = site_name
        
        return context
    
class SiteFullReportView(TemplateView):
    template_name = 'nar_ui/full_reports.html'

class DemoGraphView(TemplateView):
    template_name = 'nar_ui/demo_graph.html'