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
     * @param {nar.fullReport.TimeSeries~successfulCallback}
     * @param {nar.fullReport.TimeSeries~failedCallback}
     * @param {Object} extraArgs - any extra arguments you want your callbacks called with
     */
    self.retrieveData = function(successfulCallback, failedCallback, extraArgs){
        
        var failedCallbackWrapper = function(){
            var newArgs = Array.create(arguments).concat(extraArgs);
            failedCallback.apply(newArgs);
        };
        
        var dataRetrieval = $.ajax(CONFIG.staticUrl + 'nar_ui/full_report/mock_data_0.json');
        $.when(dataRetrieval).then(
            function(data, textStatus, jqXHR){
                try{
                    var realData = data.data; //it is nested inside the 'data' property of the response
                    self.data = realData;
                    successfulCallback.call(realData, extraArgs);
                }
                catch(e){
                    failedCallbackWrapper.apply(arguments);
                }
            },
            failedCallbackWrapper
        );
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

}());
