
from django.test import SimpleTestCase

from ..models import Definition

class DefinitionSerializeTestCase(SimpleTestCase):
    
    def test_get_dict_key_with_alphanumeric(self):
        m1 = Definition(term='My name', short_definition='Short Definition', long_definition='Long Definition')
        self.assertEqual(m1.get_dict_key(), 'myName')
        
    def test_get_dict_key_with_dashes(self):
        m1 = Definition(term='My middle-name', short_definition='Short Definition', long_definition='Long Definition')
        self.assertEqual(m1.get_dict_key(), 'myMiddleName')
        
    def test_get_dict_key_with_underscores(self):
        m1 = Definition(term='My middle_name', short_definition='Short Definition', long_definition='Long Definition')
        self.assertEqual(m1.get_dict_key(), 'myMiddleName')
        
