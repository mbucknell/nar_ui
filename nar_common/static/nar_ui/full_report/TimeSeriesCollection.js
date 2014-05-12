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
     * A wrapper around sugarjs' map function
     */
    self.map = function(customFunction){
        return timeSeries.map(customFunction);
    };
    /**
     * Asynchronously retrieves the data for all time series
     * and passes all time series objects to the success callback.
     * 
     * @returns {array<jQuery.Promise>}
     * @see http://api.jquery.com/jquery.when/
     * @see https://api.jquery.com/jQuery.deferred/
     */
    self.retrieveData = function(){
        retrievalPromises = self.map(function(timeSeries){
            return timeSeries.retrieveData();
        });
        return retrievalPromises;
    };
    
    /**
     * WARNING - Do not add elements to the returned array
     * If you do, getTimeRange will not behave properly.
     * To add elements, use self.add
     */
    self.getAll = function(){
        return timeSeries;
    };
    /**
     * 
     * @param {nar.fullReport.TimeSeries} aTimeSeries
     */
    self.add = function(aTimeSeries){
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
            
            cachedTimeRange = new nar.fullReport.TimeRange(minStartTime, maxEndTime);
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