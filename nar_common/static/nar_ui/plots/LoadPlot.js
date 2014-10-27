var nar = nar || {};
nar.plots = nar.plots || {};
(function(){

    /**
     * @param {TimeSeriesVisualization} tsViz
     * returns {jquery.flot}
     */

	nar.plots.LoadPlot = function(tsViz){
        var plotContainer = tsViz.plotContainer;
        var splitData = nar.plots.PlotUtils.getDataSplitIntoCurrentAndPreviousYears(tsViz);
        var previousYearsData = splitData.previousYearsData;
        var currentYearData = splitData.currentYearData;
        var longTermMean = nar.plots.PlotUtils.calculateLongTermAverage(tsViz);
        var miscConstituentInfo = nar.plots.PlotUtils.getConstituentNameAndColors(tsViz);
        var constituentName = miscConstituentInfo.name; 
        var previousYearsColor = miscConstituentInfo.colors.previousYears;
        var currentYearColor= miscConstituentInfo.colors.currentYear;
        var longTermMeanColor = miscConstituentInfo.colors.longTermMean;
        
        var baselineColor = miscConstituentInfo.colors.baselineColor;
        var targetColor = miscConstituentInfo.colors.targetColor;
        var movingAveColor = miscConstituentInfo.colors.movingAveColor;
        var hypoxicExtentColor = miscConstituentInfo.colors.hypoxicExtentColor;
        
        var makeSeriesConfig = function(dataSet, color){
            return {
                label: constituentName,
                data: dataSet,
                bars: {
                    barWidth: 1e10,
                    align: 'center',
                    show: true,
                    fill: true,
                    fillColor: color
                },
                yaxis : 1
              };
        };
        
        var makeLongTermMeanConfig = function(dataSet, color) {
            return {
                label: constituentName,
                data: [[nar.plots.PlotUtils.YEAR_NINETEEN_HUNDRED,longTermMean],
                       [nar.plots.PlotUtils.ONE_YEAR_IN_THE_FUTURE,longTermMean]],
                lines: {
                    show: true,
                    fillColor: color,
                    lineWidth: 1
                },
                shadowSize: 0,
                yaxis : 1
            };
        };
        
        var makeBaselineConfig = function(startDate, mean) {
            return {
                label : 'Baseline Average ',
                lines: {
                    show: true,
                    fillColor: baselineColor,
                    lineWidth: 1
                },
                shadowSize : 0,
                data : [[startDate, mean], [Date.create('1996').getTime(), mean]],
                yaxis : 1
            };
        };
        
        var makeTargetConfig = function(endDate, target) {
            return {
                label : '45% target reduction',
                dashes: {
                    show : true,
                    dashLength : [15, 15]
                },
                lines : {
                    show: true,
                    fillColor: targetColor,
                    lineWidth: 0
                },
                shadowSize : 0,
                data : [[Date.create('1997').getTime(), target], [endDate, target]],
                yaxis : 1
            };
        };
        
        var makeMovingAveConfig = function(movingAverage) {
            var data = [];
            var i;
            for (i = 0; i < movingAverage.length; i++) {
                data.push([Date.create(movingAverage[i].waterYear, 0, 1).getTime(), movingAverage[i].ave]);
            }
            
            return {
                label : '5-year moving average',
                dashes: {
                    show : true,
                    dashLength: [5, 5]
                },
                lines : {
                    show: true,
                    fillColor: movingAveColor,
                    lineWidth: 0
                },
                shadowSize: 0,
                data : data,
                yaxis : 1
            };
        };
        
        var makeHypoxicExtentConfig = function(extent) {
			var data = [];
			var i;
			for (i = 0; i < extent.length; i++) {
				data.push([Date.create(extent[i].water_year, 0, 1).getTime(), extent[i].area_sqkm]);
			}
			return {
				label : 'Gulf Hypoxic Extent',
				dashes : {
					show : true,
					dashLength : [5, 5]
				},
				line : {
					show : true,
					fillColor : hypoxicExtentColor,
					lineWidth : 0
				},
				shadowSize : 0,
				data : data,
				yaxis : 2
			};
		};
        
        var previousYearsSeries = makeSeriesConfig(previousYearsData, previousYearsColor);
        var currentYearSeries = makeSeriesConfig(currentYearData, currentYearColor);
        var longTermMeanSeries = makeLongTermMeanConfig(tsViz, longTermMeanColor);
        
        var series = [
          previousYearsSeries,
          currentYearSeries,
          longTermMeanSeries
        ];
		var yaxes = [{
			axisLabel: constituentName + " load,<br />in thousands of tons",
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

        if (Object.has(tsViz, 'auxData')) {
			if (Object.has(tsViz.auxData, 'mean')) {
				series = series.concat(makeBaselineConfig(previousYearsSeries.data.first()[0], tsViz.auxData.mean));
			}
			if (Object.has(tsViz.auxData, 'target')) {
				series = series.concat(makeTargetConfig(previousYearsSeries.data.last()[0], tsViz.auxData.target));
			}
			if (Object.has(tsViz.auxData, 'movingAverage') && tsViz.auxData.movingAverage.length > 0) {
				series = series.concat(makeMovingAveConfig(tsViz.auxData.movingAverage));
			}
			if (Object.has(tsViz.auxData, 'gulfHypoxicExtent')) {
				series = series.concat(makeHypoxicExtentConfig(tsViz.auxData.gulfHypoxicExtent)); 
				yaxes.push({
					position : 'right',
					axisLabel: 'Observed total hypoxic area, <br/> in thousands of square <br/>kilometers',
					axisLabelFontSizePixels: 10,
					axisLabelFontFamily: "Verdana, Arial, Helvetica, Tahoma, sans-serif",
					axisLabelPadding: 10,
					tickLength: 10,
					tickFormatter : function(val) {
						return val / 1000;
					}
				});
			}
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
            colors:[previousYearsColor, currentYearColor, longTermMeanColor, baselineColor, targetColor, movingAveColor] 
        });
        var hoverFormatter = nar.plots.PlotUtils.utcDatePlotHoverFormatter;
        nar.plots.PlotUtils.setPlotHoverFormatter(plotContainer, hoverFormatter);
        nar.plots.PlotUtils.setLineHoverFormatter(plotContainer, longTermMean, nar.definitions.longTermMean.short_definition);
        return plot;
    };    
}());