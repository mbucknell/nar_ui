from django.conf.urls import patterns, include, url
from django.conf.urls.static import static

from nar_ui.views import *
from helpcontent.views import DefinitionsView, AboutView, NationalFixedSiteNetworkView, NetworkSiteListView, \
    QualityControlView, PreviousNetworkInformationView, LaboratoryView, TechnicalInformationView,\
    SampleCollectionView, ConstituentView, ContactsAndCitationsView, MrbReportHelpInfoView


urlpatterns = patterns('',
    url(r'^home$', HomePageView.as_view(), name='home'),
    url(r'^sites$', SiteView.as_view(), name="site"),
    
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
    url(r'^previous_network_information$',
        PreviousNetworkInformationView.as_view(),
        name='previous_network_info'),
    url(r'sample_collection$',
        SampleCollectionView.as_view(),
        name='sample_collection'),
    url(r'^laboratory$',
        LaboratoryView.as_view(),
        name='laboratory'), 
    url(r'^technical_information$',
        TechnicalInformationView.as_view(),
        name='technical_information'),
    url(r'^constituents$',
        ConstituentView.as_view(),
        name='constituents'),
    url(r'^contacts_and_citations$',
        ContactsAndCitationsView.as_view(),
        name='contacts_and_citations'),         
    url(r'^definition_of_terms$', 
        DefinitionsView.as_view(),
        name='definition_of_terms'),
    url(r'^help$', 
        MrbReportHelpInfoView.as_view(),
        name='help'),
    url(r'^alaska_sites.sld$',
        AlaskaSldView.as_view(),
        name="alaska_sites_sld"),
    url(r'^gulf_sites.sld$',
        GulfSldView.as_view(),
        name="gulf_sites_sld"),
    url(r'^ne_sites.sld$',
        NortheastSldView.as_view(),
        name="northeast_sites_sld"),
    url(r'^southeast_sites.sld$',
        SoutheastSldView.as_view(),
        name="southeast_sites_sld"),
    url(r'^west_sites.sld$',
        WestSldView.as_view(),
        name="west_sites_sld"),
                       
    url(r'^mississippi$', MississippiView.as_view(), name="mississippi"),
    url(r'^coastal$', CoastalView.as_view(), name="coastal"),
    url(r'^coastal_region$', CoastalRegionView.as_view(), name="coastal_region"),
    url(r'^download$', DownloadView.as_view(), name="download"),
    url(r'^site/(?P<site_id>\d*)/summary-report$', SiteSummaryReportView.as_view()),
    url(r'^site/(?P<site_id>\d*)/full-report$', SiteFullReportView.as_view()),
    url(r'^nasqan_1996_stations$', Nasqan1996View.as_view(), name="nasqan_1996"),
    url(r'^nat_fact_sheet$', natFactView.as_view(), name="nat_fact"),
    url(r'^miss_fact_sheet$', missFactView.as_view(), name="miss_fact"),
    url(r'^co_fact_sheet$', coFactView.as_view(), name="co_fact"),
    url(r'^clmb_fact_sheet$', clmbFactView.as_view(), name="clmb_fact"),
    url(r'^riogrnd_fact_sheet$', riogrndFactView.as_view(), name="riogrnd_fact"),
    url(r'^nasqan_2001_stations$', Nasqan2001View.as_view(), name="nasqan_2001_stations"),
    url(r'^yukon_fact_sheet$', YukonFactView.as_view(), name="yukon_fact"),
    url(r'^representative_sampling$', representativeSamplingView.as_view(), name="representative_sampling"),
    
    url(r'^helpcontent/', include('helpcontent.urls')),
    url(r'^values/', include('nar_values.urls'))
#     url(r'^index/', 'nar_ui.views.index', name='index')

)
urlpatterns += static(settings.STATIC_URL)