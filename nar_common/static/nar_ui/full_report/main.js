//@requires nar.fullReport.Tree, nar.fullReport.TimeSeriesVisualizationRegistry, nar.fullReport.TimeSeriesVisualization
$(document).ready(function(){

    var selectorElementPair = function(selector){
        var jqElt = $(selector);
        nar.util.assert_selector_present(jqElt);
        return {
            selector: selector,
            element: jqElt
        };
    };
    
    //dom setup
    var selectorElementPairs = {
        instructions : selectorElementPair('#instructions'),
        allPlotsWrapper : selectorElementPair('#plotsWrapper'),
        timeSlider : selectorElementPair('#timeSlider'),
        graphToggle : selectorElementPair('#plotToggleTree')
    };
    nar.fullReport.TimeSeriesVisualizationRegistryInstance = new nar.fullReport.TimeSeriesVisualizationRegistry();
    
    var getDataAvailabilityUri = CONFIG.endpoint.sos + '/json';
    var getDataAvailabilityParams = {
        "request": "GetDataAvailability",
        "service": "SOS",
        "version": "2.0.0",
        "featureOfInterest": PARAMS.siteId
    };
    
    var getDataAvailabilityRequest = $.ajax({
        url:getDataAvailabilityUri,
        data: JSON.stringify(getDataAvailabilityParams),
        type: 'POST',
        contentType:'application/json'
        
    });
    
    // Wait for definitions to load
    $.when(nar.definitions_promise).done(function() { return; });
    
    var startTimeIndex = 0;
    var endTimeIndex = 1;
    var tsvRegistry = nar.fullReport.TimeSeriesVisualizationRegistryInstance;
    var successfulGetDataAvailability = function(data, textStatus, jqXHR){
        data.dataAvailability.each(function(dataAvailability){
            var observedProperty = dataAvailability.observedProperty;
            var procedure = dataAvailability.procedure;
            var timeSeriesVizId = tsvRegistry.getIdForObservedProperty(observedProperty);
            var timeSeriesViz = tsvRegistry.get(timeSeriesVizId);
            if(!timeSeriesViz){
                timeSeriesViz = new nar.fullReport.TimeSeriesVisualization({
                    id: timeSeriesVizId,
                    instructionsElt: selectorElementPairs.instructions.element,
                    allPlotsWrapperElt: selectorElementPairs.allPlotsWrapper.element,
                    timeSeriesCollection: new nar.fullReport.TimeSeriesCollection(),
                    plotter: function(){
                        throw Error('not implemented yet');
                    }
                });
                tsvRegistry.register(timeSeriesViz);
            }
            var timeRange = new nar.fullReport.TimeRange(
                    dataAvailability.phenomenonTime[startTimeIndex], 
                    dataAvailability.phenomenonTime[endTimeIndex]
            );
            
            var timeSeries = new nar.fullReport.TimeSeries({
                observedProperty: observedProperty,
                timeRange: timeRange,
                procedure: procedure
            });
            timeSeriesViz.timeSeriesCollection.add(timeSeries);
        });
        var allTimeSeriesVizualizations = tsvRegistry.getAll();
        var timeSlider = nar.fullReport.TimeSlider(selectorElementPairs.timeSlider.element);
        var tsvController = new nar.fullReport.TimeSeriesVisualizationController(timeSlider);
        
        var tree = new nar.fullReport.Tree(allTimeSeriesVizualizations, tsvController, selectorElementPairs.graphToggle.element);
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
    
    selectorElementPairs.allPlotsWrapper.element.sortable();
    selectorElementPairs.allPlotsWrapper.element.disableSelection();
});