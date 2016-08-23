var nar = nar || {};
nar.plots = nar.plots || {};
(function() {
	/**
	 * @param {nar.pestTimeSeries.Visualization} tsViz
	 * returns {jquery.flot}
	 */
	nar.plots.SampleConcentrationComparisonPlot = function(tsViz) {
		var CENSOR_TYPE = {
			NON : "",
			GREATERTHAN : ">",
			LESSTHAN : "<"
		};

		var plotContainer = tsViz.plotContainer;
		var allData = tsViz.timeSeriesCollection.getDataMerged();
		var splitData = nar.plots.PlotUtils.getDataSplitIntoCurrentAndPreviousYears(allData);
		var censoredSplitData = nar.plots.PlotUtils.getDataSplitByCensored(splitData);
		
		var constituentName = tsViz.metadata.constit;
		var currentYearColor = '#e87928';
		var previousYearsColor = tinycolor.lighten(tinycolor(currentYearColor), 30).toRgbString();
		var longTermMeanColor = tinycolor.lighten(tinycolor.gray, 75).toRgbString();
		var criteriaLineColor = tinycolor.lighten(tinycolor.gray, 75).toRgbString();

		var constituentId = tsViz.metadata.constit;
		// We only show a criteria line on sample reports if the constituent is Nitrate
		var useBenchmarkLines = 'HUMAN_HEALTH' === tsViz.metadata.comparisonCategorization || 'AQUATIC_LIFE' === tsViz.metadata.comparisonCategorization; 
		var constituentToCriteria;

		var makeSeriesConfig = function(dataSet, color, censorType) {
			var fill = (censorType === CENSOR_TYPE.NON);
			return {
				label : constituentName,
				data : dataSet,
				color : color,
				points : {
					radius : 3,
					show : true,
					fill : fill,
					fillColor : color
				},
				shadowSize : 0,
				censorLabel : censorType
			};
		};

		var previousYearsSeriesNoncensored = makeSeriesConfig(
				censoredSplitData.previousYearsData.noncensored,
				previousYearsColor, CENSOR_TYPE.NON);
		var previousYearsSeriesLessThan = makeSeriesConfig(
				censoredSplitData.previousYearsData.lessThan,
				previousYearsColor, CENSOR_TYPE.LESSTHAN);
		var previousYearsSeriesGreaterThan = makeSeriesConfig(
				censoredSplitData.previousYearsData.greaterThan,
				previousYearsColor, CENSOR_TYPE.GREATERTHAN);
		var currentYearSeriesNoncensored = makeSeriesConfig(
				censoredSplitData.currentYearData.noncensored,
				currentYearColor, CENSOR_TYPE.NON);
		var currentYearSeriesLessThan = makeSeriesConfig(
				censoredSplitData.currentYearData.lessThan, currentYearColor,
				CENSOR_TYPE.LESSTHAN);
		var currentYearSeriesGreaterThan = makeSeriesConfig(
				censoredSplitData.currentYearData.greaterThan,
				currentYearColor, CENSOR_TYPE.GREATERTHAN);
		var series = [ previousYearsSeriesNoncensored,
				previousYearsSeriesLessThan, previousYearsSeriesGreaterThan,
				currentYearSeriesNoncensored, currentYearSeriesLessThan,
				currentYearSeriesGreaterThan ];

		if (useBenchmarkLines) {
			var criteriaLineValue = allData[0][2];
			var criteriaLineSeries = {
				label : constituentName,
				data : [
							[ nar.plots.PlotUtils.YEAR_NINETEEN_HUNDRED,
								criteriaLineValue ],
							[ nar.plots.PlotUtils.ONE_YEAR_IN_THE_FUTURE,
								criteriaLineValue ]
						],
				color : criteriaLineColor,
				lines : {
					show : true,
					fillColor : criteriaLineColor,
					lineWidth : 1
				},
				shadowSize : 0
			};

			series.add(criteriaLineSeries);
		}

		var logBase = 10;
		var logFactor = Math.log(logBase);
		
		series.each(function(siri){
		    siri.data.each(function(datum){
		         console.log(datum[0] + ',' + datum[1]);
		    });
		});
		
		var plot = $
				.plot(
						plotContainer,
						series,
						{
							xaxis : {
								mode : 'time',
								timeformat : "%m/%Y",
								tickLength : 10,
								minTickSize : [ 1, 'month' ]
							},
							yaxis : {
								axisLabel : constituentName
										+ ",<br /> in milligrams per liter",
								axisLabelFontSizePixels : 10,
								axisLabelFontFamily : "Verdana, Arial, Helvetica, Tahoma, sans-serif",
								axisLabelPadding : 5,
								ticks : function(axis) {
									return nar.plots.PlotUtils.logTicks(axis,
											-3);
								},
								tickLength : 10,
								transform : function(value) {
									if (0 >= value) {
										return 0;
									} else {
										return Math.log(value) / logFactor;
									}
								},
								inverseTransform : function(value) {
									return Math.pow(logBase, value);
								}
							},
							grid : {
								hoverable : true,
								autoHighlight : true
							},
							legend : {
								show : false
							},
							grid : {
								hoverable : true
							}
						});

		var hoverFormatter = nar.plots.PlotUtils.utcDatePlotHoverFormatter;
		nar.plots.PlotUtils.setPlotHoverFormatter(plotContainer, hoverFormatter);

		if (useCriteriaLine && criteriaLineValue) {
			var criteriaLineDescription = 'EPA MCL = '
					+ constituentToCriteria[constituentId]
					+ ' mg/L as N. See technical information for details.';
			nar.plots.PlotUtils.setLineHoverFormatter(plotContainer, criteriaLineValue, criteriaLineDescription);
		}

		return plot;
	};
}());