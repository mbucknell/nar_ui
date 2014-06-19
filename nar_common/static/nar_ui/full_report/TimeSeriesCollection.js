//@requires nar.fullReport.TimeSeries
var nar = nar || {};
nar.fullReport = nar.fullReport || {};
/**
 * @class
 */
nar.fullReport.TimeSeriesCollection = function(){
    var self = this;
    var timeSeries = [];
    
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
    
    self.getAll = function(){
        return timeSeries;
    };
    /**
     * 
     * @param {nar.fullReport.TimeSeries} aTimeSeries
     */
    self.add = function(aTimeSeries){
        timeSeries.push(aTimeSeries);
    };
    /**
     * Returns the aggregate time range for a collection of time series.
     * @returns {nar.fullReport.DateRange | undefined} undefined if no time series are present 
     */
    self.getTimeRange = function(){
        var aggregateTimeRange = undefined;
        if(0 !== timeSeries.length){
            var timeRanges = timeSeries.map(function(aTimeSeries){return aTimeSeries.timeRange;});
            aggregateTimeRange = nar.fullReport.TimeRange.ofAll(timeRanges); 
        }
        return aggregateTimeRange ;
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