var nar = nar || {};
nar.fullReport = nar.fullReport || {};
(function(){

    /**
     * @param {TimeSeriesVisualization} tsViz
     * returns {jquery.flot}
     */

   var ExceedancePlot = function(plotContainerSelector, data){
       nar.util.assert_selector_present(plotContainerSelector);
       var plotContainer = $(plotContainerSelector);
       
       var plot = $.plot(plotContainer, data, {
           series: {
               bars : {
                   show: true
               }
           },
           bars: {
               barWidth: 0.6,
               align:'center',
           },
           xaxis: {
               mode : 'categories',
               tickLength: 0
           },
           yaxis: {
               min: 0,
               max: 100
           }
        }
       );
    return plot;
    };
    
    nar.fullReport.ExceedancePlot = ExceedancePlot;
}());