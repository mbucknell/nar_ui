//@requires nar.fullReport.Tree, nar.fullReport.TimeSeriesVisualizationRegistry, nar.fullReport.TimeSeriesVisualization
$(document).ready(function(){
    
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
    var startTimeIndex = 0;
    var endTimeIndex = 1;
    var tsvRegistry = nar.fullReport.TimeSeriesVisualizationRegistry;
    var successfulGetDataAvailability = function(data, textStatus, jqXHR){
        data.dataAvailability.each(function(dataAvailability){
            var observedProperty = dataAvailability.observedProperty;
            var procedure = dataAvailability.procedure;
            var timeSeriesVizId = tsvRegistry.getIdForObservedProperty(observedProperty);
            var timeSeriesViz = tsvRegistry.get(timeSeriesVizId);
            if(!timeSeriesViz){
                timeSeriesViz = nar.fullReport.TimeSeriesVisualization.fromId(timeSeriesVizId);
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
        
        var tsvController = new nar.fullReport.TimeSeriesVisualizationController();
        
        var tree = new nar.fullReport.Tree(allTimeSeriesVizualizations, tsvController);
        
        
        
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
    var selector = '#plotsWrapper';
    nar.util.assert_selector_present(selector);
    var selected = $(selector);
    selected.sortable();
    selected.disableSelection();
});