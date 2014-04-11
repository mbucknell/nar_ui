import re
from StringIO import StringIO
from lxml import etree
import requests

# Create your models here.
def get_site_name(site_id, url):
    filter = """
    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
       <ogc:PropertyIsEqualTo>
        <ogc:PropertyName>NAR:staid</ogc:PropertyName>
        """
    filter += '<ogc:Literal>' +site_id +'</ogc:Literal>' + """
       </ogc:PropertyIsEqualTo>
    </ogc:Filter>
    """
    #kill all whitespace except for one-length whitespace like the spaces between xml tag names and attribute names
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

    return site_name