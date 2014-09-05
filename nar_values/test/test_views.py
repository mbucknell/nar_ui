from django.test import Client, TestCase
from django.core.urlresolvers import reverse
from django.http import HttpResponseNotFound, HttpResponseBadRequest
from ..models import MrbSubBasinContributions
import json
from ..views import MrbSubBasinContributionsJsonView

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
        