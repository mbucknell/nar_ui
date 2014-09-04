from django.conf.urls import patterns, url

import views

urlpatterns= patterns("",
    url(r'^mrbSubBasinContributions/$',
        views.MrbSubBasinContributionsJsonView.as_view(),
        name='nar_values-mrbSubBasinContributions'),
)