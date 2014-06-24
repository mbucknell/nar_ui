var nar = nar || {};
nar.fullReport = nar.fullReport || {};
(function(){

    /**
     * @param {TimeSeriesVisualization} tsViz
     * returns {jquery.flot}
     */

    
    
   var ExceedancePlot = function(plotEltId, data, title){
       nar.util.assert_selector_present('#'+plotEltId);
       $.jqplot.config.enablePlugins = true;
       data = [1, 2, 3, 4];
       var ticks = ['nitrate', 'phosphorous', 'total nitrogen', 'orthphosphate'];
       var plot = $.jqplot(plotEltId, 
       [data],
       {
           title: title,
           series: [{
               renderer: $.jqplot.BarRenderer,
               rendererOptions: {
                   barDirection: 'horizontal'
               }
           }],
           axes:{
               yaxis: {
                   renderer: $.jqplot.CategoryAxisRenderer,
                   ticks: ticks
               }
           }
       });
       
       return plot;
   };
    nar.fullReport.ExceedancePlot = ExceedancePlot;
}());