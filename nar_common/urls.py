from django.conf import settings
from django.conf.urls import patterns, include, url
from django.conf.urls.static import static
from django.contrib import admin

from nar_ui.views import *


admin.autodiscover()


urlpatterns = patterns('',
    url(r'^$', HomePageView.as_view()),
    url(r'^site/summary-report$', SiteSummaryReportView.as_view()),
    url(r'^site/(?P<siteId>\d*)/summary-report$', SiteSummaryReportView.as_view()),
    url(r'^site/full-report$', SiteFullReportView.as_view()),
    url(r'^graph-demo$', DemoGraphView.as_view()),
#     url(r'^index/', 'nar_ui.views.index', name='index')

)
urlpatterns += static(settings.STATIC_URL)