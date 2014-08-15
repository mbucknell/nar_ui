import json
import re

from django.db import models

class Definition(models.Model):
    
    term = models.CharField(unique=True, max_length=64)
    short_definition = models.CharField(max_length=128)
    long_definition = models.CharField(max_length=1024)
    
    def __unicode(self):
        return u'%s' %self.term
    
    class Meta:
        
        managed = False
        db_table = 'definition'
        
    def get_dict_key(self):
        key = re.sub(r'([^\s\w]|_)+', ' ', self.term)
        key = key.title()
        key = re.sub(r'\s', '', key)
        return key[0:1].lower() + key[1:]
        
        
    
class SiteLinkInfo(models.Model):
    
    network = models.CharField(max_length=16)
    natqw_site = models.CharField(unique=True, max_length=20)
    station_nm = models.CharField(max_length=128)
    sitetype_c3 = models.CharField(max_length=20)
    realtime_streamflow_link = models.CharField(max_length=512)
    nwisweb_link = models.CharField(max_length=512)
    flow_compared_to_historic_link = models.CharField(max_length=512)
    
    def __unicode__(self):
        return u'%s, %s' %(self.natqw_site, self.station_nm)
    
    class Meta:
        
        managed = False
        db_table = 'site_link_info'
        
        
class SiteEcoregionCriteriaInfo(models.Model):
    network = models.CharField(max_length=16)
    natqw_site = models.CharField(unique=True, max_length=20)
    station_nm = models.CharField(max_length=128)
    lat = models.DecimalField(max_digits=10, decimal_places=7, null=True)
    lon = models.DecimalField(max_digits=10, decimal_places=7, null=True)
    sitetype_c3 = models.CharField(max_length=32)
    ecoreg_3 = models.CharField(max_length=12)
    ecoreg_2 = models.CharField(max_length=12)
    nutrient_ecoregion = models.CharField(max_length=8)
    econame = models.CharField(max_length=128)
    tn_criteria = models.DecimalField(max_digits=4, decimal_places=2, null=True)
    tp_criteria = models.DecimalField(max_digits=4, decimal_places=2, null=True)
    
    def __unicode__(self):
        return u'%s, %s' %(self.natqw_site, self.station_nm)
    
    class Meta:
        
        managed = False
        db_table = 'site_ecoregion_criteria_info'