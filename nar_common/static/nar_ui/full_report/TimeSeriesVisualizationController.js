//@requires nar.fullReport.TimeSeriesVisualization, nar.fullReport.TimeSlider
var nar = nar || {};

(function(){

nar.fullReport = nar.fullReport || {};
/**
 * 
 * This class handles updating the time slider when 
 * time series are added or removed from view. 
 * 
 * @class
 * @param {nar.fullReport.TimeSlider}
 */
nar.fullReport.TimeSeriesVisualizationController = function(timeSlider){
    var self = this;
    self.timeSlider = timeSlider;

    //force everyone to use the accessors and getters, (including class members)
    //by hiding the inner variable using closures, function-scoping
    (function(){
        var currentlyVisibleTimeRange;
        
        /**
         * @returns {nar.fullReport.TimeRange} a copy of the currently visible time range,
         * or undefined
         */
        self.getCurrentlyVisibleTimeRange = function(){
            if(currentlyVisibleTimeRange){
                return currentlyVisibleTimeRange.clone();
            }
        };
        /**
         * Sets the currently visible time range to a copy of the time range passed in
         * @param {nar.fullReport.TimeRange} timeRange
         * 
         */
        self.setCurrentlyVisibleTimeRange = function(timeRange){
            self.timeSlider.slider('option', 'disabled', false);
            self.timeSlider.slider('option', 'min', timeRange.startTime);
            self.timeSlider.slider('option', 'max', timeRange.endTime);
            self.timeSlider.slider('option', 'values', [timeRange.startTime, timeRange.endTime]);
            currentlyVisibleTimeRange = timeRange.clone();
        };
    }());
       
    /*
     * Map<String, TimeSeriesVisualizations>
     */
    self.currentlyVisibleTimeSeriesVisualizations = {};
    /**
     * @param {array<TimeSeriesVisualization>} tsvsToVisualize 
     */
    self.visualizeAll = function(tsvsToVisualize){
        var incomingTimeRanges = tsvsToVisualize.map(function(tsv){return tsv.timeSeriesCollection.getTimeRange();});
        var timeRangesToSearch;
        var currentlyVisibleTimeRange = self.getCurrentlyVisibleTimeRange();
        if(currentlyVisibleTimeRange){
            timeRangesToSearch = incomingTimeRanges.concat(currentlyVisibleTimeRange);
        }
        else{
            timeRangesToSearch = incomingTimeRanges;
        }
        var aggregateTimeRange = nar.fullReport.TimeRange.ofAll(timeRangesToSearch);
        self.setCurrentlyVisibleTimeRange(aggregateTimeRange);
        tsvsToVisualize.each(function(tsv){
            self.currentlyVisibleTimeSeriesVisualizations[tsv.id] = tsv;
            tsv.visualize();
        });
    };
    
    /**
     * @param {array<TimeSeriesVisualization>} tsvsToVisualize 
     */
    self.removeAll = function(tsvsToRemove){
        tsvsToRemove.each(function(tsv){
            tsv.remove();
            delete self.currentlyVisibleTimeSeriesVisualizations[tsv.id];
        });
        
        var remainingTimeRanges = [];
        Object.values(
            self.currentlyVisibleTimeSeriesVisualizations, 
            function(tsv){
                remainingTimeRanges.push(tsv.timeSeriesCollection.getTimeRange());
            }
        );
        var aggregateTimeRange = nar.fullReport.TimeRange.ofAll(remainingTimeRanges);
        self.setCurrentlyVisibleTimeRange(aggregateTimeRange);
    };   
};

}());
