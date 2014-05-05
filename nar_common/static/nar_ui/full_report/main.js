(function(){
    var getDataAvailabilityUri = CONFIG.staticUrl + 'nar_ui/full_report/mock_getDataAvailability_response.json';
    var getDataAvailabilityRequest = $.ajax(getDataAvailabilityUri);
    var startTimeIndex = 0;
    var endTimeIndex = 1;
    var successfulGetDataAvailability = function(data, textStatus, jqXHR){
        data.dataAvailability.each(function(dataAvailability){
            var observedProperty = dataAvailability.observedProperty;
            var timeSeriesViz = getTimeSeriesVisualizationForObservedProperty(observedProperty);
            var timeSeries = new nar.fullReport.TimeSeries({
                observedProperty: observedProperty,
                startTime: phenomenonTime[startTimeIndex],
                endTime: phenomenonTime[endTimeIndex]
            });
            timeSeriesViz.timeSeriesCollection.addTimeSeries(timeSeries);
            //@todo: create jstree node and any corresponding parents
        });
        console.dir(TimeSeriesVisualizationRegistry);
    }; 
    var failedGetDataAvailability = function(data, textStatus, jqXHR){
        var msg = 'Could not determine data availability for this site';
        //@todo make this modal dialog
        alert(msg);
        throw Error(msg);
    }; 
    
    $.when(getDataAvailabilityRequest).then(
        successfulGetDataAvailability,
        failedGetDataAvailability
    );
    
    /**
     * Some TimeSeriesVisualizations have just one TimeSeries. In this case, the TimeSeriesVisualization id is the observedProperty of the TimeSeries.
     * Other TimeSeriesVisualizations have multiple TimeSeries. In that case, the TimeSeriesVisualization id is a string representative of 
     * the visualized time series. 
     * @param {string} observedProperty - the full uri for the observedProperty
     * @returns {string} visualization id
     *  
     */
    var getVisualizationIdForObservedProperty = function(observedProperty){
        //@todo check observedProperty to see if it corresponds to a category
        //where multiple time series correspond to a single visualization
        
        //@todo failing id lookup by category, also check to see if the full 
        //observedProperty has been mapped to an id
        
        var obsPropertyToVizIdMap = {
            //empty for now
        };
        
        //just return itself for now
        return observedProperty;
    };
    
    //map of string ids to instantiations of TimeSeriesVisualizations
    var TimeSeriesVisualizationRegistry = {};
    
    /**
     * Get an existing TimeSeriesVisualization if it has already been instantiated,
     * otherwise return a new TimeSeriesVisualization.
     * @param {string} id - the TimeSeriesVisualization id
     * @returns {TimeSeriesVisualization}
     */
    var getTimeSeriesVisualizationForId = function(id){
        var existingTimeSeriesViz = TimeSeriesVisualizationRegistry[id]; 
        if(!existingTimeSeriesViz){
            var newTimeSeriesViz = new TimeSeriesVisualization({id: id});
            TimeSeriesVisualizationRegistry[id] = newTimeSeriesViz;
            existingTimeSeries = newTimeSeriesViz;
        }
        return existingTimeSeries;
    };
    
    var getTimeSeriesVisualizationForObservedProperty = function(observedProperty){
        var vizId = getVisualizationIdForObservedProperty(observedProperty);
        var viz = getTimeSeriesVisualizationForId(vizId);
        return viz;
    };
    
    
}());