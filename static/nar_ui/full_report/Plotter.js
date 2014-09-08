//@requires nar.fullReport.TimeSeriesVisualization
var nar = nar || {};
nar.fullReport = nar.fullReport || {};
(function(){
   //singleton 
   nar.fullReport.Plotter = new function(){
       var self = this;
       /**
        * @param {jQuery} plotContainer
        * returns {jquery.flot}
        */
       self.plot = function(plotContainer, timeSeriesCollection, title){
           
       };
   }();
   nar.fullReport.Plotter.constructor = null;
   
}());
