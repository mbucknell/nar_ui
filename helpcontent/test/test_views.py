from django.test import SimpleTestCase

from ..views import FeedContextMixin

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