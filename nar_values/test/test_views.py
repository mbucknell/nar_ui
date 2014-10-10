
import json

from django.core.urlresolvers import reverse
from django.http import HttpResponseNotFound, HttpResponseBadRequest, Http404
from django.test import Client, TestCase
from django.test.client import RequestFactory

from ..models import MrbSubBasinContributions, SiteMeanAndTarget, SiteMovingAverage
from ..views import MrbSubBasinContributionsJsonView, SiteAveragesAndTargetsJsonView

class MrbContributionsJsonViewTestCase(TestCase):
    contribution = {
                    'contribution': 0.314159,
                    'constituent': 'NO23',
                    'parameter_type': 'WY',
                    'water_year' : '2012',
                    'basin_name': 'MISS',
                    }
    @staticmethod
    def get_contributions(params):
        client = Client()
        response = client.get(reverse('nar_values-mrbSubBasinContributions'), params)
        
        return response

    def setUp(self):
        
        MrbSubBasinContributions.objects.create(**self.contribution)
        
    def test_empty_parameters(self):
        
        response = self.get_contributions({})
        self.assertIsInstance(response, HttpResponseBadRequest)
        
    def test_missing_parameters(self):
        #get all but one of the required param names
        parameter_keys = MrbSubBasinContributionsJsonView.query_params[:-1]
        params = {}
        for key in parameter_keys:
            params[key] = 'dummy'
            
        response = self.get_contributions(params)
        self.assertIsInstance(response, HttpResponseBadRequest)
        
    def test_valid_parameters_but_no_matching_record(self):
        params = dict(self.contribution)
        #override one of the values so that the query fails
        params[params.keys()[0]] = 'dummy'

        self.assertIsInstance(self.get_contributions(params), HttpResponseNotFound)
    
    def test_valid_parameters_and_matching_record(self):
        response = self.get_contributions(self.contribution)
        self.assertEqual(response.status_code, 200)
        response_map = json.loads(response.content)
        expected_contribution_map = {}
        expected_contribution_map[self.contribution['basin_name']] = self.contribution['contribution'] 
        self.assertDictEqual(response_map, expected_contribution_map)
        
        
class SiteAveragesAndTargetsJsonViewTestCase(TestCase):
    
    def setUp(self):
        self.m1 = SiteMeanAndTarget.objects.create(site_id='1212', 
                                           constituent='TP', 
                                           annual_mean=1.1, 
                                           annual_target=1.2,
                                           may_mean=3.1,
                                           may_target=3.2)
        self.m2 = SiteMeanAndTarget.objects.create(site_id='1212', 
                                           constituent='TKN', 
                                           annual_mean=2.1, 
                                           annual_target=2.2,
                                           may_mean=4.1,
                                           may_target=4.2)
        self.m3 = SiteMeanAndTarget.objects.create(site_id='1213', 
                                           constituent='TP', 
                                           annual_mean=3.1, 
                                           annual_target=3.2,
                                           may_mean=5.1,
                                           may_target=5.2)
        
        self.a1 = SiteMovingAverage.objects.create(site_id='1212',
                                          constituent='TP',
                                          water_year='1993',
                                          annual_moving_average=2.0,
                                          may_moving_average=3.0)
        self.a2 = SiteMovingAverage.objects.create(site_id='1212',
                                          constituent='TP',
                                          water_year='1994',
                                          annual_moving_average=3.0,
                                          may_moving_average=4.0)
        self.a3 = SiteMovingAverage.objects.create(site_id='1212',
                                          constituent='TP',
                                          water_year='1995',
                                          annual_moving_average=2.1,
                                          may_moving_average=3.1)
        self.a4 = SiteMovingAverage.objects.create(site_id='1212',
                                              constituent='TKN',
                                              water_year='1993',
                                              annual_moving_average=2.0,
                                              may_moving_average=3.0)
        
        self.factory = RequestFactory()
        self.test_view = SiteAveragesAndTargetsJsonView()
        self.args = []
        self.kwargs = {}
        
        
    def test_missing_params(self):
        request = self.factory.get('/dummy_service?site_id=1')
        response = self.test_view.get(request, *self.args, **self.kwargs)
        
        self.assertIsInstance(response, HttpResponseBadRequest)
        
    def test_no_object(self):
        request = self.factory.get('/dummy_service?site_id=1214&constituent=TP')
        self.assertRaises(Http404, self.test_view.get, request, *self.args, **self.kwargs)
        
    def test_retrieval_with_moving_averages(self):
        request = self.factory.get('/dummy_service?site_id=1212&constituent=TP')
        response = self.test_view.get(request, *self.args, **self.kwargs)
        result = json.loads(response.content)
        self.assertEqual(result['site_id'], '1212')
        self.assertEqual(result['constituent'], 'TP')
        self.assertEqual(result['annual_mean'], 1.1)
        self.assertEqual(len(result['moving_average']), 3)
        self.assertEqual(result['moving_average'][0]['water_year'], 1993)
        self.assertEqual(result['moving_average'][1]['water_year'], 1994)
        self.assertEqual(result['moving_average'][2]['water_year'], 1995)
         