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
    var log10 = function(val) {
        return Math.log(val) / Math.LN10;
    };
    
    
    nar.fullReport.PlotUtils = {
            
        /**
         * @param {nar.fullReport.TimeSeriesVisualization}
         * @returns {Object} - a map of the data set split into the current year's data, and the 
         * previous years' data. Previous years' data will be null if last years' data does not 
         * fall on the last water year. 
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
            var lastCurrentDateWaterYear = nar.WaterYearUtils.convertDateToWaterYear() - 1;
            var lastDateWaterYear = nar.WaterYearUtils.convertDateToWaterYear(lastDate.format('{yyyy}/{MM}/{dd}'));
            
            //must use string for year
            var startOfLastYear = Date.create(''+lastYear);
            var startOfLastYearTimestamp = startOfLastYear.getTime();

            var indexOfFirstDataPointInLastYear = data.findIndex(function(dataPoint){
               var timestamp = getXcoord(dataPoint);
               return timestamp >= startOfLastYearTimestamp;
            });
            
            var result = {
				previousYearsData : [],
				currentYearData : []
			};
            
            // If the last water year in not the data set is the actual last water year,
            // don't put anything into the currentYearData array and put everything into
            // previousYearsData array. Otherwise, include just the last item in the array
            // into currentYearData
            if (lastDateWaterYear !== lastCurrentDateWaterYear) {
        		result.previousYearsData = data;
			} else {
				result.previousYearsData = data.to(indexOfFirstDataPointInLastYear);
				result.currentYearData = data.from(indexOfFirstDataPointInLastYear);
			}
            
            return result;
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
        },
        /**
         * @callback plotHoverFormatter
         * @param x
         * @param y
         * @returns {string} - The text to be displayed in the hover element
         */
        /**
         * Sets the given formatter handler on the specified flotchart plot.
         * Note that the flotchart must have 'grid{hoverable:true}' in order for this to work.
         * 
         * @param {HTMLElement|string} - Either an element or a valid string jquery selector
         * @param {plotHoverFormatter} - the callback that formats the raw data into human-readable hover text
         */
        setPlotHoverFormatter : function(plotContainer, formatter){
            //create or obtain a div just for chart tooltips
            var toolTipId = 'flot-tooltip';
            var toolTipSelector = '#' + toolTipId;
            var toolTipSelection = $(toolTipSelector);
            var toolTipElt;
            if(0 === toolTipSelection.length){
                toolTipElt = $('<div></div>', {'id':toolTipId});
                toolTipElt.appendTo('body');
            }
            else{
                toolTipElt = toolTipSelection[0];
            }
            $(plotContainer).bind("plothover", function (event, pos, item) {
                if (item) {
                    var x = item.datapoint[0],
                        y = item.datapoint[1];
                    var hoverText = formatter(x, y);
                    
                    $(toolTipElt).html(hoverText)
                        .css({top: item.pageY+5, left: item.pageX+5})
                        .fadeIn(200);
                } else {
                    $(toolTipElt).hide();
                }
            });
            
        },
        /**
         * This is a commonly-used {plotHoverFormatter}.
         * @param x
         * @param y
         * returns {string}
         */
        utcDatePlotHoverFormatter: function(x, y){
            //use utc(true) to prevent timezone offset from modifying date
            var date = Date.create(x).utc(true);
            var dateStr = date.format(Date.ISO8601_DATE);
            var formatted = dateStr + " : " + y;
            return formatted;
        },
        /**
         * Pulling out tick formatter for testing it
         * Note, only works for powers of 10
         * @param val value to format
         * @param axis axis being formatted (not used currently)
         * returns format for which tick should be formatted
         */
        logTickFormatter: function(val, axis) {
            var roundedLog = Math.round(log10(val));
            var tickDecimals = (roundedLog > 0) ? 0 : -roundedLog;
            return val.toFixed(tickDecimals);
        }
    };
}());