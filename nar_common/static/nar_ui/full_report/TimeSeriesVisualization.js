//@requires nar.fullReport.TimeSeriesCollection
var nar = nar || {};
nar.fullReport = nar.fullReport || {};
(function(){
/**
 * @typedef nar.fullReport.TimeSeriesVisualizationConfig
 * @property {string} id
 * @property {Function} plotConstructor
 * @property {nar.fullReport.TimeSeriesCollection} timeSeriesCollection
 */

/**
 * @class
 * @param {nar.fullReport.TimeSeriesVisualizationConfig} config
 */
nar.fullReport.TimeSeriesVisualization = function(config){
    var self = this;
    self.id = config.id;
    self.timeSeriesCollection = config.timeSeriesCollection;
    self.plotConstructor = config.plotConstructor;
    self.plot = undefined;   
};


// static methods:

nar.fullReport.TimeSeriesVisualization.fromId = function(id){
    
    //@todo: select plot constructor based on id
    
    return new nar.fullReport.TimeSeriesVisualization({
        id: id,
        plotConstructor: function(){
            throw Error('not implemented yet');
        },
        timeSeriesCollection: new nar.fullReport.TimeSeriesCollection()
    }); 
};
}());