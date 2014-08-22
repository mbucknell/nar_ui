from django.conf.urls import patterns, include, url
from django.conf.urls.static import static

from nar_ui.views import *
from helpcontent.views import DefinitionsView, AboutView, NationalFixedSiteNetworkView, NetworkSiteListView 
from helpcontent.views import QualityControlView


urlpatterns = patterns('',
    url(r'^home$', HomePageView.as_view(), name='home'),
    url(r'^sites$', SiteView.as_view()),
    
    url(r'^about$', 
        AboutView.as_view(),
        name='about'),
    url(r'^national_fixed_site_network$',
        NationalFixedSiteNetworkView.as_view(),
        name='fixed_site_network'),
    url(r'^network_site_list$',
        NetworkSiteListView.as_view(),
        name='network_site_list'),
    url(r'^quality_control$',
        QualityControlView.as_view(),
        name='quality_control'),
                       
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