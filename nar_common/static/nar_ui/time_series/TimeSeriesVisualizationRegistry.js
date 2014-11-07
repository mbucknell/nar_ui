//@requires nar.timeSeries.TimeSeriesVisualization
var nar = nar || {};

(function(){

nar.timeSeries = nar.timeSeries || {};

/**
 * @class
 * In the application, this should be used as a singleton by constructing a single instance
 * from the onready/main file.
 * 
 * In testing this can be used in non-singleton form.
 * 
 * While the first instantiation of this class proceeds without further ado,
 * a warning is printed during each subsequent instantiation.
 */

//private class variable
var alreadyBeenInstantiated = false;

nar.timeSeries.VisualizationRegistry = function(){
    if(alreadyBeenInstantiated){
    	console.warn(
			'This object should be treated as a singleton unless testing.' + 
			'You are instatiating an object that is meant to be used as a singleton, and it has already been instantiated.'+
    		'Did you mean "nar.timeSeries.VisualizationRegistryInstance" ?.'
		);
    }
    else{
    	alreadyBeenInstantiated = true;
    }
	var self = this;
    
    //registry entries, a map of string ids to instantiations of TimeSeriesVisualizations
    var entries = {};
    
    /**
     * Get the Visualization for a given id if it has already been registered. Return undefined if no such id is registered.
     * @param {string} id - the Visualization id
     * @returns {nar.timeSeries.Visualization|undefined} - undefined if not present 
     */
    self.get = function(id){
        var existingTimeSeriesViz = entries[id]; 
        return existingTimeSeriesViz;
    };
    /**
     * @param {nar.timeSeries.Visualization} timeSeriesVisualization
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
     * @returns {Array<nar.timeSeries.Visualization>}
     */
    self.getAll = function(){
      return Object.values(entries);
    };
    /**
     * Convenience method
     * @param {String} observedProperty
     * @returns {nar.timeSeries.Visualization
     */
    self.getByObservedPropertyAndProcedure = function(observedProperty, procedure){
        var vizId = self.getTimeSeriesVisualizationId(observedProperty, procedure);
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
     * Some Visualizations have just one TimeSeries. In this case, the Visualization id is the observedProperty of the TimeSeries 
     * minus self.urlPrefix.
     * Other TVisualizations have multiple TimeSeries. In that case, the Visualization id is be a string representative of 
     * the visualized time series. 
     * @param {string} observedProperty - the full uri for the SOS observedProperty
     * @param {string} procedure - the full uri for the SOS procedure
     * @returns {string} visualization id
     *  
     */
    self.getTimeSeriesVisualizationId= function(observedProperty, procedure){
        var strippedObservedProperty = self.stripUrlPrefix(observedProperty, self.urlPrefix + 'property/');
        //@todo check striped property id to see if it corresponds to a category
        //where multiple time series correspond to a single visualization
               
        //@todo failing id lookup by category, also check strippedObservedPropertyToVizIdMap to see if  
        //it maps to an id
        
        var strippedProcedure = self.stripUrlPrefix(procedure, self.urlPrefix + 'procedure/');
        
        //The sos procedure names are set up to contain underscore-delimeted tokens. The first token is timestep density,
        //one of (discrete, annual, monthly, daily). The second token is category, one of (flow, concentration).
        //The third token, if present, is a subcategory, one of (mass_L95/*, mass_U95/*, flow_weighted/*, mean/*)
        //where '*' denotes any modtype.
        var targetDelim = '/';
        var properlyDelimetedProcedure = strippedProcedure.replace('_', targetDelim).replace('_', targetDelim);
        var splitProcedure = properlyDelimetedProcedure.split(targetDelim);
        //if procedure has a modtype, remove it -- there is no modtype awareness in TsvIds
        if(splitProcedure.length === 4){
        	properlyDelimetedProcedure = splitProcedure.to(splitProcedure.length -1).join(targetDelim);
        }
        //just return this for now
        return strippedObservedProperty + '/' + properlyDelimetedProcedure;
    };
};

}());