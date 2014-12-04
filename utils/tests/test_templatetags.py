import mock

from mock import patch

from django.test import SimpleTestCase

from ..templatetags.feeds import pull_feed

class PullFeedTestCase(SimpleTestCase):

    @patch('utils.templatetags.feeds.feedparser.parse')
    def test_empty_feed(self, mock_feedparser):
        mock_feedparser.return_value = {'entries' : []}
        result = pull_feed('http://fakefeed.com/feed/')
        self.assertEqual(mock_feedparser.call_args[0][0], 'http://fakefeed.com/feed/')
        self.assertEqual(result, {'post' : ''})

    @patch('utils.templatetags.feeds.feedparser.parse')
    def test_non_emtpy_feed_no_substitution(self, mock_feedparser):
        entryMock = mock.Mock
        entryMock.summary = '<div><p>First Paragraph</p><div class="feed"><div>Content Div</div><div>Edit Info Div</div></div></div>'
        entryMock.summary_detail = mock.Mock
        entryMock.summary_detail.base = 'http://fakefeed.com/feed/'
        mock_feedparser.return_value = {'entries' : [entryMock, ]}

        result = pull_feed('http://fakefeed.com/feed/')
        self.assertEqual(mock_feedparser.call_args[0][0], 'http://fakefeed.com/feed/')
        self.assertEqual(result, {'post' : u'<div><div class="feed"><div>Content Div</div></div></div>'})

    @patch('utils.templatetags.feeds.feedparser.parse')
    def test_feed_with_substitution(self, mock_feedparser):
        entryMock = mock.Mock
        entryMock.summary = '<div><p>First Paragraph</p><div class="feed"><div>Content Div<a href="http://fakefeed.com/feed/#localref">Local Link</a></div><div>Edit Info Div</div></div></div>'
        entryMock.summary_detail = mock.Mock
        entryMock.summary_detail.base = 'http://fakefeed.com/createfeed/'
        mock_feedparser.return_value = {'entries' : [entryMock, ]}

        result = pull_feed('http://fakefeed.com/feed/')
        self.assertEqual(mock_feedparser.call_args[0][0], 'http://fakefeed.com/feed/')
        self.assertEqual(result, {'post' : u'<div><div class="feed"><div>Content Div<a href="#localref">Local Link</a></div></div></div>'})
