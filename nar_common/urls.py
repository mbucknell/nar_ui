from django.conf.urls import patterns, include, url
from nar_ui.views import *
from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'nar_ui.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

#     url(r'^admin/', include(admin.site.urls)),
#     url(r'.*', HomePageView.as_view(), name='home' )
    url(r'^$', HomePageView.as_view()),
    url(r'^site/summary-report$', SiteSummaryReportView.as_view()),
#     url(r'^index/', 'nar_ui.views.index', name='index')
)
urlpatterns += static(settings.STATIC_URL)