from django.conf.urls import patterns, include, url
from nar_ui.views import HomePageView
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'nar_ui.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

#     url(r'^admin/', include(admin.site.urls)),
#     url(r'.*', HomePageView.as_view(), name='home' )
    url(r'^home/$', HomePageView.as_view(), name='home_page'),
#     url(r'^index/', 'nar_ui.views.index', name='index')
)
