from django.views.generic.base import TemplateView

class HomePageView(TemplateView):
    template_name = 'nar_ui/home.html'
    
    
class SiteSummaryReportView(TemplateView):
    template_name = 'nar_ui/summary.html'
    
class SiteFullReportView(TemplateView):
    template_name = 'nar_ui/full_reports.html'