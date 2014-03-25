from django.conf.urls import patterns, include, url
from nar_ui.views import *
from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
admin.autodiscover()


urlpatterns = patterns('',
    url(r'^$', HomePageView.as_view()),
    url(r'^site/summary-report$', SiteSummaryReportView.as_view()),
)
urlpatterns += static(settings.STATIC_URL)