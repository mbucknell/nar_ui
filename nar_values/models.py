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