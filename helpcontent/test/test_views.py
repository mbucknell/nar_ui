from django.test import SimpleTestCase, Client, TestCase
from django.core.urlresolvers import reverse
from django.http import HttpResponseNotFound, HttpResponseBadRequest
from ..models import MrbSubBasinContributions
import json
from ..views import FeedContextMixin, MrbSubBasinContributionsJsonView

class FeedContextMixinTestCase(SimpleTestCase):
    
    def test_get_context_data(self):  
        class TestFeedMixin(FeedContextMixin):
            feed_titles = [{'context_name' : 'feed1', 'title' : 'Feed+1', 'label' : 'test_feed1'}, 
                           {'context_name' : 'feed2', 'title' : 'Feed+2', 'label' : 'test_feed2'}]
            
        self.test_mixin = TestFeedMixin()
          
        kwargs = {}
        result = self.test_mixin.get_context_data(**kwargs)
        
        self.assertIn('feed1',result)
        self.assertTrue('feed2', result)
        self.assertNotEqual(result['feed1'].find('Feed+1'), -1)
        self.assertNotEqual(result['feed1'].find('test_feed1'), -1)
        self.assertNotEqual(result['feed2'].find('Feed+2'), -1)
        self.assertNotEqual(result['feed2'].find('test_feed2'), -1)

class MrbContributionsJsonViewTestCase(TestCase):
    contribution = {
                    'contribution': 0.314159,
                    'constituent': 'NO23',
                    'parameter_type': 'WY',
                    'water_year' : '2012',
                    'basin_name': 'MISS',
                    }
    @staticmethod
    def getContributions(params):
        client = Client()
        response = client.get(reverse('helpcontent-mrbSubBasinContributions'), params)
        
        return response

    def setUp(self):
        
        MrbSubBasinContributions.objects.create(**self.contribution)
        
    def test_empty_parameters(self):
        
        response = self.getContributions({})
        self.assertIsInstance(response, HttpResponseBadRequest)
        
    def test_missing_parameters(self):
        #get all but one of the required param names
        parameter_keys = MrbSubBasinContributionsJsonView.query_params[:-1]
        params = {}
        for key in parameter_keys:
            params[key] = 'dummy'
            
        response = self.getContributions(params)
        self.assertIsInstance(response, HttpResponseBadRequest)
        
    def test_valid_parameters_but_no_matching_record(self):
        params = dict(self.contribution)
        #override one of the values so that the query fails
        params[params.keys()[0]] = 'dummy'

        self.assertIsInstance(self.getContributions(params), HttpResponseNotFound)
    
    def test_valid_parameters_and_matching_record(self):
        response = self.getContributions(self.contribution)
        self.assertEqual(response.status_code, 200)
        response_map = json.loads(response.content)
        expected_contribution_map = {}
        expected_contribution_map[self.contribution['basin_name']] = self.contribution['contribution'] 
        self.assertDictEqual(response_map, expected_contribution_map)
        