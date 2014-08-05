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
            var longTermMeanColor = tinycolor.lighten(tinycolor(currentYearColor), 15).toRgbString();
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
        }
    };
}());