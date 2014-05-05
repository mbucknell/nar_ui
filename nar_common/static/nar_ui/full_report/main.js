(function(){
    var getDataAvailabilityUri = CONFIG.staticUrl + 'nar_ui/full_report/mock_getDataAvailability_response.json';
    var getDataAvailabilityRequest = $.ajax(getDataAvailabilityUri);
    var startTimeIndex = 0;
    var endTimeIndex = 1;
    var tsvRegistry = nar.fullReport.TimeSeriesVisualizationRegistry;
    var successfulGetDataAvailability = function(data, textStatus, jqXHR){
        data.dataAvailability.each(function(dataAvailability){
            var observedProperty = dataAvailability.observedProperty;
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
                timeRange: timeRange
            });
            timeSeriesViz.timeSeriesCollection.addTimeSeries(timeSeries);
            //@todo: create jstree node and any corresponding parents
        });
        console.dir(tsvRegistry);
    }; 
    var failedGetDataAvailability = function(data, textStatus, jqXHR){
        var msg = 'Could not determine data availability for this site';
        //@todo make this modal dialog
        alert(msg);
        throw Error(msg);
    }; 
    $(document).ready(function(){
        $.when(getDataAvailabilityRequest).then(
            successfulGetDataAvailability,
            failedGetDataAvailability
        );
    });
    
}());