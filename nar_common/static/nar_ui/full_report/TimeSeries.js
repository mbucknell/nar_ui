//@requires nar.fullReport.Plot, nar.util
var nar = nar || {};
(function(){
nar.fullReport = nar.fullReport || {};

/**
 * @typedef nar.fullReport.TimeSeriesConfig
 * @property {String} observedProperty - a full url identifier for an SOS observedProperty
 * @property {nar.fullReport.TimeRange} timeRange
 */

/**
 * @class
 * @param {nar.fullReport.TimeSeriesConfig} config
 */
nar.fullReport.TimeSeries = function(config){
    var self = this;
    
    self.observedProperty = config.observedProperty;
    self.timeRange = config.timeRange;
    
    self.data = undefined;
    
    /**
     * Retrieve data and run callback. Does not check to see if data is already present.
     * @returns {jQuery.promise} -- the promise callbacks are called with this TimeSeries
     */
    self.retrieveData = function(){
        //@todo - incorporate self.observedProperty into the call
        //@todo - point at a real SOS endpoint
        var deferred = $.Deferred();
        var zeroOrOne = self.observedProperty.length % 2;
        var dataRetrieval = $.ajax(CONFIG.staticUrl + 'nar_ui/full_report/mock_data_' + zeroOrOne +'.json')
            .success(function(response, textStatus, jqXHR){
                //@todo: handle exception text
                self.data = response.data;
                //pass this entire object to the callback 
                deferred.resolve(self);
            })
            .fail(function(data, textStatus, jqXHR){
                deferred.reject(parameters);
            });
        var promise = deferred.promise();
        return promise;
    };
    
};

/**
 * @class
 * @param {Date|String|Number} startTime - A valid Date Object, an ISO-8601 date string, or a Number timestamp
 * @param {Date|String|Number} endTime -  A valid Date Object, an ISO-8601 date string, or a Number timestamp
 */
nar.fullReport.TimeRange = function(startTime, endTime){
  var self = this;
  self.startTime = nar.util.getTimeStamp(startTime);
  self.endTime = nar.util.getTimeStamp(endTime);
};



//private 
/**
 * @param {nar.fullReport.TimeRange} init
 * @param {nar.fullReport.TimeRange} current the current element of iteration
 */
var timeExtentExtremityFinder = function(init, current){
    init.startTime = Math.min(init.startTime, current.startTime);
    init.endTime = Math.max(init.endTime, current.endTime);
    return init;
};

//public static methods

/**
 * Given a collection of TimeRanges, produce an aggregate TimeRange 
 * whose startTime is the smallest startTime of timeRanges
 * and whose endTime is the largest endTime of timeRanges
 *  
 * @param {array<TimeRange>} timeRanges
 * @returns {TimeRange}
 */
nar.fullReport.TimeRange.ofAll = function(timeRanges){
    var biggestPossibleTimeExtent = new TimeRange(Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY);
    var extent = timeRanges.reduce(timeExtentExtremityFinder, biggestPossibleTimeExtent);
    return extent;
};

}());
