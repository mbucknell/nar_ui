from django.db import models

class MrbSubBasinContributions(models.Model):
    contribution = models.DecimalField(max_digits=18, decimal_places=17, null=True)
    constituent = models.CharField(max_length=10)
    parameter_type = models.CharField(max_length=5)
    water_year = models.CharField(max_length=10)
    basin_name = models.CharField(max_length=32)
    
    def __unicode__(self):
        return u'contribution: %s, constituent: %s, parameter type: %s, water year: %s, basin name : %s' % (self.contribution, self.constitiuent, self.parameter_type, self.water_year, self.basin_name)
    
    class Meta:
        
        managed = False
        db_table = 'mrb_sub_basin_contributions'
        
        
class SiteMeanAndTarget(models.Model):
    site_id = models.CharField(max_length=20)
    constituent = models.CharField(max_length=8)
    annual_mean = models.DecimalField(max_digits=22, decimal_places=11, null=True)
    annual_target = models.DecimalField(max_digits=22, decimal_places=11, null=True)
    may_mean = models.DecimalField(max_digits=22, decimal_places=11, null=True)
    may_target = models.DecimalField(max_digits=22, decimal_places=11, null=True)
    
    def __unicode__(self):
        return u'site_id: %s, constituent: %s' %(self.site_id, self.constituent)
    
    class Meta:
        managed = False
        db_table = 'site_mean_and_targets'
        unique_together = ('site_id', 'constituent')
    
    
class SiteMovingAverage(models.Model):
    water_year = models.IntegerField()
    site_id = models.CharField(max_length=20)
    constituent = models.CharField(max_length=10)
    annual_moving_average = models.DecimalField(max_digits=22, decimal_places=11, null=True)
    may_moving_average = models.DecimalField(max_digits=22, decimal_places=11, null=True)
    
    def __unicode__(self):
        return u'water_year: %s, site_id: %s, constituent: %s' % (self.water_year, self.site_id, self.constituent)
    
    class Meta:
        managed = False
        db_table = 'site_moving_averages'
        unique_together = ('water_year', 'site_id', 'constituent')