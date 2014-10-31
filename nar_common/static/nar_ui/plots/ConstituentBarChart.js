var nar = nar || {};
nar.plots = nar.plots || {};

(function() {
	/**
	 * 
	 * @typedef nar.plot.ConstituentBarChartConfig
	 * @property {String} yaxisLabel - 
	 * @property {Boolean} showLongTermMean
	 * @property {Array of data series Object} auxData - for each series, should set yaxis to 1 if plotted on the same access as the
	 * 		timeSeries data or 2 if plotted on a separate axis
	 * @property {jqueryFlot axis } secondaryYaxis - Only used if auxData is defined
	 * 
	 * @param {TimeSeriesVisualization} tsViz
	 * @param {nar.plotConstituentBarChartConfig} config
	 */
	nar.plots.createConstituentBarChart = function(tsViz, config) {
		var plotContainer = tsViz.plotContainer;
		
        var splitData = nar.plots.PlotUtils.getDataSplitIntoCurrentAndPreviousYears(tsViz);
        var previousYearsData = splitData.previousYearsData;
        var currentYearData = splitData.currentYearData;
        
        var constituentInfo = nar.plots.PlotUtils.getConstituentNameAndColors(tsViz);
        
        var yaxes = [{
			axisLabel: config.yaxisLabel,
			axisLabelFontSizePixels: 10,
			axisLabelFontFamily: "Verdana, Arial, Helvetica, Tahoma, sans-serif",
			axisLabelPadding: 10,
			tickLength: 10,
			tickFormatter : function(val) {
				// Use Sugar to properly format numbers with commas
				// http://sugarjs.com/api/Number/format
				return (val).format();
			}
		}];
        
        var makeBarChartSeries = function(dataSet, color, label) {
			return {
				label: label || '',
				data: dataSet,
				bars: {
					barWidth: 1e10,
					align: 'center',
					show: true,
					fill: true,
					fillColor: color
				},
				yaxis : 1,
				color : color
			};
        };
        
        var makeLongTermMeanSeries = function(mean, color, label) {
			return {
				label : label || '',
				data : [ [ nar.plots.PlotUtils.YEAR_NINETEEN_HUNDRED, mean ],
						[ nar.plots.PlotUtils.ONE_YEAR_IN_THE_FUTURE, mean ] ],
				lines : {
					show : true,
					fillColor : color,
					lineWidth : 1
				},
				shadowSize : 0,
				yaxis : 1, 
				color : color
			};
		};
	
		var previousYearsSeries = makeBarChartSeries(previousYearsData, constituentInfo.colors.previousYears);
		var currentYearSeries = makeBarChartSeries(currentYearData, constituentInfo.colors.currentYear);
		var longTermMean;
		
		var series = [previousYearsSeries, currentYearSeries];
		if (config.showLongTermMean) {
			longTermMean = nar.plots.PlotUtils.calculateLongTermAverage(tsViz);
			series.push(makeLongTermMeanSeries(longTermMean, constituentInfo.colors.longTermMean));
		}
		
		if (config.auxData) {
			series = series.concat(config.auxData);
		}
		
		if (config.secondaryYaxis) {
			yaxes.push(config.secondardYaxis);
		}
		
		var plot = $.plot(plotContainer, series, {
            xaxis: {
                mode: 'time',
                timeformat: "%Y",
                tickLength: 10,
                ticks : nar.plots.PlotUtils.getTicksByYear
            },
            yaxes : yaxes,
            legend: {
                show: false
            },
            grid:{
                hoverable: true
            },
//            colors:[previousYearsColor, currentYearColor, longTermMeanColor, baselineColor, targetColor, movingAveColor] 
        });
		
		var hoverFormatter = nar.plots.PlotUtils.utcDatePlotHoverFormatter;
        nar.plots.PlotUtils.setPlotHoverFormatter(plotContainer, hoverFormatter);
        if (config.showLongTermMean) {
			nar.plots.PlotUtils.setLineHoverFormatter(plotContainer, longTermMean, nar.definitions.longTermMean.short_definition);
        }
        
        return plot;
	};
}());