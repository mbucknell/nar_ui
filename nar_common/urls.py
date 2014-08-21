from django.conf.urls import patterns, include, url
from django.conf.urls.static import static
from django.contrib import admin
from django.views.generic import TemplateView

from nar_ui.views import *
from helpcontent.views import DefinitionsView

admin.autodiscover()


urlpatterns = patterns('',
    url(r'^home$', HomePageView.as_view(), name='home'),
    url(r'^sites$', SiteView.as_view()),
    
    url(r'^content/about/$', 
        TemplateView.as_view(template_name='about.html'),
        name='about'),
    url(r'^definition_of_terms$', 
        DefinitionsView.as_view(),
        name='definition_of_terms'),
                       
    url(r'^mississippi$', MississippiView.as_view()),
    url(r'^coastal$', CoastalView.as_view()),
    url(r'^download$', DownloadView.as_view()),
    url(r'^site/(?P<site_id>\d*)/summary-report$', SiteSummaryReportView.as_view()),
    url(r'^site/(?P<site_id>\d*)/full-report$', SiteFullReportView.as_view()),
    
    url(r'^helpcontent/', include('helpcontent.urls')),
#     url(r'^index/', 'nar_ui.views.index', name='index')

)
urlpatterns += static(settings.STATIC_URL)