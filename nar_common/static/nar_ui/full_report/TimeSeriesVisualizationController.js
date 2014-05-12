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
 * @param {array<TimeSeriesVisualization>} allPossibleTsvs
 * @param {nar.fullReport.TimeSlider}
 */
nar.fullReport.TimeSeriesVisualizationController = function(timeSlider){
    var self = this;
    self.timeSlider = timeSlider;

    //force everyone to use the accessors and getters, (including class members)
    //by hiding the inner variable using closures, function-scoping
    (function(){
        var currentlyVisibleTimeRange;
        self.getCurrentlyVisibleTimeRange = function(){
            return Object.clone(currentlyVisibleTimeRange);
        };
        self.setCurrentlyVisibleTimeRange = function(timeRange){
            currentlyVisibleTimeRange = Object.clone(timeRange);
            
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
        var incomingTimeRanges = tsvsToVisualize.map(function(tsv){return tsv.getTimeRange();});
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
            currentlyVisibleTimeSeriesVisualizations[tsv.id] = tsv;
            tsv.visualize();
        });
    };
    
    /**
     * @param {array<TimeSeriesVisualization>} tsvsToVisualize 
     */
    self.removeAll = function(tsvsToRemove){
        tsvsToRemove.each(function(tsv){
            tsv.remove();
            delete currentlyVisibleTimeSeriesVisualizations[tsv.id];
        });
        
        var remainingTimeRanges = [];
        Object.values(
            self.currentlyVisibleTimeSeriesVisualizations, 
            function(tsv){
                remainingTimeRanges.push(tsv.getTimeRange());
            }
        );
        var aggregateTimeRange = nar.fullReport.TimeRange.ofAll(remainingTimeRanges);
        self.setCurrentlyVisibleTimeRange(aggregateTimeRange);
    };   
};

}());
