var nar = nar || {};
nar.fullReport = nar.fullReport || {};
(function(){

    /**
     * @param {String} plotEltId the id where the plot will be rendered. Do not include a '#'
     * @param {Object} a series specification - an array of objects having the format
     * [
     *      {
     *          constituent: nar.Constituent.nitrogen
     *          data: [75]
     *      },
     *      {
     *          constituent: nar.Constituent.total_phosphorus
     *          data: [33]
     *      },
     *      
     * ]
     * @param {String} title - the title of the graph
     * returns {jquery.flot}
     */

    
    
   var ExceedancePlot = function(plotEltId, seriesSpecifications, title){
       
       nar.util.assert_selector_present('#'+plotEltId);
       $.jqplot.config.enablePlugins = true;
       var data = seriesSpecifications.map(function(seriesSpec){return [seriesSpec.data, seriesSpec.constituent.name];});
       data = data.concat([['', '']]);
       var seriesOptions = seriesSpecifications.map(function(seriesSpec){return {color: seriesSpec.constituent.color};});
       var plot = $.jqplot(plotEltId, 
       [
        data
       ],
       {
           title: title,
           seriesDefaults:{
               renderer: $.jqplot.BarRenderer,
               rendererOptions: {
                   barDirection: 'horizontal'
               },
               pointLabels: {
                   show: true,
                   location: 'e'
//                   edgeTolerance: -15
               }
           },
           series: seriesOptions,
           axes:{
               yaxis: {
                   renderer: $.jqplot.CategoryAxisRenderer,
//                   ticks: ticks
                   rendererOptions:{
                       angle: 45
                   }
               },
               xaxis: {
                   //restrict to percent range
                   max: 100,
                   min: 0
               }
           }
       
       });
       //make plots responsive by replotting on window resize event 
       $(window).resize(function() {
           plot.replot();
       });
       
       return plot;
   };
    nar.fullReport.ExceedancePlot = ExceedancePlot;
}());