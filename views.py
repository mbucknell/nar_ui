from django.views.generic.base import TemplateView

class HomePageView(TemplateView):
    template_name = 'nar_ui/home.html'
    