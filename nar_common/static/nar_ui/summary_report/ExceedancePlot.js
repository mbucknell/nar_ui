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

    
    
   var ExceedancePlot = function(plotEltId, seriesSpecifications, axisLabel){
       
       nar.util.assert_selector_present('#'+plotEltId);
       $.jqplot.config.enablePlugins = true;
       var data = seriesSpecifications.map(function(seriesSpec){return [seriesSpec.data, seriesSpec.constituent.name];});
       var seriesOptions = seriesSpecifications.map(function(seriesSpec){return seriesSpec.constituent.color;});
       var plot = $.jqplot(plotEltId, 
       [
        data
       ],
       {
           seriesDefaults:{
               renderer: $.jqplot.BarRenderer,
               rendererOptions: {
                   barDirection: 'horizontal',
                   varyBarColor: true,
                   barWidth: 40
               },
               pointLabels: {
                   show: true,
                   location: 'e',
                   edgeTolerance: -30
               }
           },
           seriesColors: seriesOptions,
           axes:{
               yaxis: {
                   renderer: $.jqplot.CategoryAxisRenderer,
                   tickRenderer: $.jqplot.CanvasAxisTickRenderer,
                   tickOptions:{
                       angle: -90,
                       labelPosition: 'middle',
                       showGridline: false
                   }
               },
               xaxis: {
                   //restrict to percent range
                   max: 100,
                   min: 0,
                   label: axisLabel,
                   tickOptions: {
                	   showGridline: false
                   }
                  
               }
           },
           grid: {
    		   drawGridLine: false
    	   }
       
       });
       //make plots responsive by replotting on window resize event 
       $(window).resize(function() {
           plot.replot();
       });
       //make a download button
       var plotSelector = '#'+plotEltId; 
       
       var plotExportButtonContainer = $(plotSelector).after('<div></div>').next();
       
       plotExportButtonContainer.addClass('plotExportButtonContainer')
           .append('<button>Download Plot</button>', {
                   'class': 'plotExportButton'
           }).click(function(){
               $(plotSelector).jqplotSaveImage();
           });
       return plot;
   };
    nar.fullReport.ExceedancePlot = ExceedancePlot;
}());