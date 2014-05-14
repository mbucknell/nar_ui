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
        var monthlyOrAnnual;
        if(self.observedProperty.has('sample')){
            monthlyOrAnnual = 'monthly';            
        }
        else{
            monthlyOrAnnual = 'annual';
        }
         
        var dataRetrieval = $.ajax(CONFIG.staticUrl + 'nar_ui/full_report/mock_'+ monthlyOrAnnual +'_data_' + zeroOrOne +'.json')
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
  self.clone = function(){
      return nar.fullReport.TimeRange.clone(self);
  };
  self.equals = function(otherTimeRange){
      return nar.fullReport.TimeRange.equals(self, otherTimeRange);
  };
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
 * Clones the specified time range
 * @param {nar.fullReport.TimeRange} timeRange
 */
nar.fullReport.TimeRange.clone = function(timeRange){
    return new nar.fullReport.TimeRange(timeRange.startTime,timeRange.endTime);
};
nar.fullReport.TimeRange.equals = function(timeRangeA, timeRangeB){
    var equal = false;
    if(undefined !== timeRangeA && undefined !== timeRangeB){
        if(timeRangeA.constructor === nar.fullReport.TimeRange &&
           timeRangeB.constructor === nar.fullReport.TimeRange){
            
            equal = timeRangeA.startTime === timeRangeB.startTime &&
                   timeRangeA.endTime === timeRangeB.endTime;
        }
    }
    return equal;
};

/**
 * Given a collection of TimeRanges, produce an aggregate TimeRange 
 * whose startTime is the smallest startTime of timeRanges
 * and whose endTime is the largest endTime of timeRanges
 *  
 * @param {array<TimeRange>} timeRanges
 * @returns {TimeRange}
 */
nar.fullReport.TimeRange.ofAll = function(timeRanges){
    var firstTimeRange = timeRanges.first();
    if(firstTimeRange){
        //since reduce modifies the init value, we must create a copy to avoid modifying the
        //original while searching
        var initValue = firstTimeRange.clone();
        var maxExtent = timeRanges.reduce(timeExtentExtremityFinder, initValue);
        return maxExtent;
    }
};
}());
