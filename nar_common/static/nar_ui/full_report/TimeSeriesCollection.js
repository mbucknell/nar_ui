//@requires nar.fullReport.TimeSeries
var nar = nar || {};
nar.fullReport = nar.fullReport || {};
/**
 * @class
 */
nar.fullReport.TimeSeriesCollection = function(){
    var self = this;
    var timeSeries = [];

    //date range is calculated when dirty (after adding new time series)
    var dirty = true;
    /**
     * 
     * @param {nar.fullReport.TimeSeries} aTimeSeries
     */
    self.addTimeSeries = function(aTimeSeries){
        timeSeries.push(aTimeSeries);
        dirty = true;
    };
    var cachedTimeRange;
    /**
     * Returns the time range for a collection of time series.
     * 
     * If no time series have been added since the last time range
     * calculation, it returns the cached time range.
     * If time series have been added since the last time range
     * calculation, it calculates the new time range and caches the
     * result.
     * 
     * @returns {nar.fullReport.DateRange}
     */
    self.getTimeRange = function(){
        if(dirty && 0 !== timeSeries.length){
            var firstTimeSeriesTimeRange = timeSeries.first().timeRange;
            var minStartTime=firstTimeSeriesTimeRange.startTime;
            var maxEndTime=firstTimeSeriesTimeRange.endTime;

            //compare timestamps from the first TimeSeries with the subsequent TimeSeries in the array. 
            timeSeries.from(1).each(function(aTimeSeries){
                minStartTime = aTimeSeries.startTime < minStartTime ? aTimeSeries.startTime : minStartTime;
                maxEndTime = aTimeSeries.endTime < maxEndTime ? aTimeSeries.endTime : maxEndTime;
            });
            
            cachedTimeRange = new TimeRange(minStartTime, maxEndTime);
            dirty=false;
        }
        return cachedTimeRange;
    };
    
    /**
     * @param {string} observedProperty
     * @returns {nar.fullReport.TimeSeries}
     */
    self.getTimeSeriesByObservedProperty = function(observedProperty){
        var targetTimeSeries = timeSeries.find(function(potentialTimeSeries){
            return potentialTimeSeries.observedProperty === observedProperty;
        });
        return targetTimeSeries;
    };
};