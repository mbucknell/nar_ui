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
    /**
     * For symmetry, get the Y coord
     */
    var getYcoord = function(point) {
    	return point[1];
    };
    var log10 = function(val) {
        return Math.log(val) / Math.LN10;
    };
    
    var getPlotTooltipDiv = function() {
    	//create or obtain a div just for chart tooltips
        var toolTipId = 'flot-tooltip';
        var toolTipSelector = '#' + toolTipId;
        var toolTipSelection = $(toolTipSelector);
        var toolTipElt;
        if (0 === toolTipSelection.length) {
            toolTipElt = $('<div></div>', {'id':toolTipId});
            toolTipElt.appendTo('body');
        }
        else {
            toolTipElt = toolTipSelection[0];
        }
        return toolTipElt;
    };
    
    nar.fullReport.PlotUtils = {
        YEAR_NINETEEN_HUNDRED: Date.create('1900').getTime(),
        ONE_YEAR_IN_THE_FUTURE: Date.create().addYears(1).getTime(),
        /**
         * @param {nar.fullReport.TimeSeriesVisualization}
         * @returns {Object} - a map of the data set split into the current year's data, and the 
         * previous years' data. Previous years' data will be an empty array if last years' data does not 
         * fall on the last water year. 
         */
        getDataSplitIntoCurrentAndPreviousYears: function(timeSeriesVisualization) {
            var data = nar.fullReport.PlotUtils.getData(timeSeriesVisualization);
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
        getData: function(timeSeriesVisualization) {
        	var allData = timeSeriesVisualization.timeSeriesCollection.map(function(timeSeries){
                return timeSeries.data;
            });
            var data = allData[0];//only one time series' worth of data for now.
            data.map(function(timestep) {
                timestep[1] = parseFloat(timestep[1]);
            });
            return data;
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
            var longTermMeanColor = tinycolor.lighten(tinycolor.gray, 75).toRgbString();
            return {
                name : constituentName,
                colors:{
                    currentYear: currentYearColor,
                    previousYears: previousYearsColor,
                    longTermMean: longTermMeanColor
                }
            };
        },
        /**
         * This will probably eventually come from a service, but for now I'm just going to calculate
         */
        calculateLongTermAverage: function(timeSeriesVisualization) {
            var allData = timeSeriesVisualization.timeSeriesCollection.map(function(timeSeries){
                return timeSeries.data;
            });
            var data = allData[0];
            var avg = data.average(function(n){
                return parseFloat(getYcoord(n));
            });
            return avg;
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
            var toolTipElt = getPlotTooltipDiv();
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
        setLineHoverFormatter : function(plotContainer, yvalue, text) {
            var toolTipElt = getPlotTooltipDiv();
            var hoverThreshold = 0.05; // Arbitrary for now
            $(plotContainer).bind("plothover", function (event, pos, item) {
                if (!item) {
                    if (Math.abs(log10(pos.y) - log10(yvalue)) < hoverThreshold) {
                        $(toolTipElt).html(text)
                            .css({top: pos.pageY+5, left: pos.pageX+5})
                            .fadeIn(200);
                    }
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
        },
        /**
         * Use to format time series axis when you want the ticks to represent a year. 
         * Can be assigned to the ticks property for an axis.
         * @ return Array of utc time.
         */
        getTicksByYear : function(axis) {
        	var tFirstYear, tLastYear;
        	var thisDate, maxDate;
        	
        	var result  = axis.tickGenerator(axis);
        	if (result.length > 1) {
        		// If the number of ticks is greater than the range of years
        		// need to generate the ticks for just years.
        		tFirstYear = (new Date(result[0])).getFullYear();
        		tLastYear = (new Date(result[result.length - 1])).getFullYear();
        		
        		if (tLastYear - tFirstYear < result.length) {
        			thisDate = new Date(tFirstYear, 0, 1);
        			maxDate = new Date(axis.max);
        			
        			result = [];
        			while(thisDate < maxDate) {
        				result.push(thisDate.getTime());
        				thisDate.setFullYear(thisDate.getFullYear() + 1);
        			}
        		}
        	}
        	return result;
        }
    };
}());