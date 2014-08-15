from django.conf.urls import patterns, url

import views

urlpatterns= patterns("",
    url(r'^definitions/$',
        views.DefinitionsJsonView.as_view(),
        name='helpcontent-definitions'),
)