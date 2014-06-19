//@requires nar.Constituents
var nar = nar || {};
nar.fullReport = nar.fullReport || {};
(function(){
/**
 * functionality shared between different full report plots 
 */    
    
    
    /**
     * Just to make code more readable
     * given an array representing a point, give back the x coord
     */
    var getXcoord = function(point){
        return point[0];
    };
    
    
    
    nar.fullReport.PlotUtils = {
            
        /**
         * @param {nar.fullReport.TimeSeriesVisualization}
         * @returns {Object} - a map of the data set split into the current year's data, and the 
         * previous years' data 
         */
        getDataSplitIntoCurrentAndPreviousYears: function(timeSeriesVisualization) {
            var allData = timeSeriesVisualization.timeSeriesCollection.map(function(timeSeries){
                return timeSeries.data;
            });
            var data = allData[0];//only one time series' worth of data for now.
            //assume sorted data set
            var latestPoint = data.last();
            var lastDate = new Date(getXcoord(latestPoint));
            var lastYear = lastDate.getFullYear();
            //must use string for year
            var startOfLastYear = Date.create(''+lastYear);
            var startOfLastYearTimestamp = startOfLastYear.getTime();

            var indexOfFirstDataPointInLastYear = data.findIndex(function(dataPoint){
               var timestamp = getXcoord(dataPoint);
               return timestamp >= startOfLastYearTimestamp;
            });
            var previousYearsData = data.to(indexOfFirstDataPointInLastYear);
            var currentYearData = data.from(indexOfFirstDataPointInLastYear);
            return {
                previousYearsData: previousYearsData,
                currentYearData: currentYearData
            };
        },
        /**
         * @param {nar.fullReport.TimeSeriesVisualization}
         * @returns {Object} - a map of the constituent the time series graphs, and two colors:
         * one for the current year's data, and the other for the previous years' data 
         */
        getConstituentNameAndColors: function(timeSeriesVisualization){
            var idComponents = timeSeriesVisualization.getComponentsOfId();
            var constituentId = idComponents.constituent;
            var constituentInfo = nar.Constituents[constituentId];
            var constituentName = constituentInfo.name;
            var currentYearColor = constituentInfo.color;
            var previousYearsColor = tinycolor.lighten(tinycolor(currentYearColor), 30).toRgbString();
            return {
                name : constituentName,
                colors:{
                    currentYear: currentYearColor,
                    previousYears: previousYearsColor                    
                }
            };
        }
            
    };
}());