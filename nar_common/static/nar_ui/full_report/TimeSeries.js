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
};

}());
