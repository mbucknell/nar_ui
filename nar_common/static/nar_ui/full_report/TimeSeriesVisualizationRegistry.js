//@requires nar.fullReport.TimeSeriesVisualization
var nar = nar || {};

(function(){

nar.fullReport = nar.fullReport || {};

/**
 * @class
 */

//create a singleton using an anonymous constructor function and nulling out the constructor
nar.fullReport.TimeSeriesVisualizationRegistry = new function(){
    var self = this;
    
    //registry entries, a map of string ids to instantiations of TimeSeriesVisualizations
    var entries = {};
    
    /**
     * Get an existing TimeSeriesVisualization if it has already been instantiated,
     * otherwise return a new TimeSeriesVisualization.
     * @param {string} id - the TimeSeriesVisualization id
     * @returns {nar.fullReport.TimeSeriesVisualization|undefined} - undefined if not present 
     */
    self.get = function(id){
        var existingTimeSeriesViz = entries[id]; 
        return existingTimeSeriesViz;
    };
    /**
     * @param {nar.fullReport.TimeSeriesVisualization} timeSeriesVisualization
     * @throws Error if already registered 
     */
    self.register = function(timeSeriesVisualization){
        var id = timeSeriesVisualization.id;
        var existing = self.get(id);
        if(existing){
            throw Error('A Time Series Visualization of id "' + id + '" already exists');
        }
        else{
            entries[id] = timeSeriesVisualization;
        }
    };
    /**
     * Return all registered time series visualizations
     * @returns {Array<nar.fullReport.TimeSeriesVisualization>}
     */
    self.getAll = function(){
      return Object.values(entries);
    };
    /**
     * Convenience method
     * @param {String} observedProperty
     * @returns {nar.fullReport.TimeSeriesVisualization
     */
    self.getForObservedProperty = function(observedProperty){
        var vizId = self.getIdForObservedProperty(observedProperty);
        var viz = self.get(vizId);
        return viz;
    };
    
    
    
    var obsPropertyToVizIdMap = {
            //empty for now
    };

    /**
     * Some TimeSeriesVisualizations have just one TimeSeries. In this case, the TimeSeriesVisualization id is the observedProperty of the TimeSeries.
     * Other TimeSeriesVisualizations have multiple TimeSeries. In that case, the TimeSeriesVisualization id is a string representative of 
     * the visualized time series. 
     * @param {string} observedProperty - the full uri for the observedProperty
     * @returns {string} visualization id
     *  
     */
    self.getIdForObservedProperty = function(observedProperty){
        //@todo check observedProperty to see if it corresponds to a category
        //where multiple time series correspond to a single visualization
        
        //@todo failing id lookup by category, also check obsPropertyToVizId to see if the full 
        //observedProperty has been mapped to an id
        
        //just return itself for now
        return observedProperty;
    };
    
}();//end anonymous constructor invocation
//..and nulling out the constructor to prevent subsequent new-ing
nar.fullReport.TimeSeriesVisualizationRegistry.constructor = null;

}());