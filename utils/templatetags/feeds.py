
import feedparser

from bs4 import BeautifulSoup

from django import template

register = template.Library()

@register.inclusion_tag('utils/feed_template.html')
def pull_feed (feed_url):
    feed = feedparser.parse(feed_url)

    # Process html to remove unwanted mark-up and fix links
    post = ''
    if len(feed['entries']) > 0:
        soup = BeautifulSoup(feed['entries'][0].summary)

        # Remove edited by paragraph
        soup.p.extract()

        # Remove final div in the feed
        feedDiv = soup.find('div', class_='feed')
        childrenDivs = feedDiv.findAll('div')
        childrenDivs[len(childrenDivs) - 1].extract()

        # Any links which use anchors should have the leading part of the url (before #) removed.
        links = feedDiv.select('a[href*="#"]')
        for link in links:
            link['href'] = link['href'][link['href'].find('#'):]
        post = unicode(soup)

    return {'post' : post}
