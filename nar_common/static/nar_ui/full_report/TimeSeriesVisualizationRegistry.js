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
     * Get the TimeSeriesVisualization for a given id if it has already been registered. Return undefined if no such id is registered.
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
    self.getByObservedProperty = function(observedProperty){
        var vizId = self.getIdForObservedProperty(observedProperty);
        var viz = self.get(vizId);
        return viz;
    };
    
    
    
    var strippedObservedPropertyToVizIdMap = {
            //empty for now
    };
    self.urlPrefix = 'http://cida.usgs.gov/def/NAR/';
    self.stripUrlPrefix = function(url, urlPrefix){
        return url.replace(urlPrefix, '');
    };
    /**
     * Some TimeSeriesVisualizations have just one TimeSeries. In this case, the TimeSeriesVisualization id is the observedProperty of the TimeSeries 
     * minus self.urlPrefix.
     * Other TimeSeriesVisualizations have multiple TimeSeries. In that case, the TimeSeriesVisualization id is be a string representative of 
     * the visualized time series. 
     * @param {string} observedProperty - the full uri for the observedProperty
     * @returns {string} visualization id
     *  
     */
    self.getIdForObservedProperty = function(observedProperty){
        var strippedObservedProperty = self.stripUrlPrefix(observedProperty, self.urlPrefix + 'property/');
        //@todo check striped property id to see if it corresponds to a category
        //where multiple time series correspond to a single visualization
        
        //@todo failing id lookup by category, also check strippedObservedPropertyToVizIdMap to see if  
        //it maps to an id
        
        //just return itself for now
        return strippedObservedProperty;
    };
    
}();//end anonymous constructor invocation
//..and nulling out the constructor to prevent subsequent new-ing
nar.fullReport.TimeSeriesVisualizationRegistry.constructor = null;

}());