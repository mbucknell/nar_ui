from django.views.generic.base import TemplateView

class HomePageView(TemplateView):
    template_name = 'nar_ui/home.html'
    
    
class SiteSummaryReportView(TemplateView):
    template_name = 'nar_ui/summary.html'