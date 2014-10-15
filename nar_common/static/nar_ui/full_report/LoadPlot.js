var nar = nar || {};
nar.fullReport = nar.fullReport || {};
(function(){

    /**
     * @param {TimeSeriesVisualization} tsViz
     * returns {jquery.flot}
     */

    nar.fullReport.LoadPlot = function(tsViz){
        var plotContainer = tsViz.plotContainer;
        var splitData = nar.fullReport.PlotUtils.getDataSplitIntoCurrentAndPreviousYears(tsViz);
        var previousYearsData = splitData.previousYearsData;
        var currentYearData = splitData.currentYearData;
        var longTermMean = nar.fullReport.PlotUtils.calculateLongTermAverage(tsViz);
        var miscConstituentInfo = nar.fullReport.PlotUtils.getConstituentNameAndColors(tsViz);
        var constituentName = miscConstituentInfo.name; 
        var previousYearsColor = miscConstituentInfo.colors.previousYears;
        var currentYearColor= miscConstituentInfo.colors.currentYear;
        var longTermMeanColor = miscConstituentInfo.colors.longTermMean;
        
        var baselineColor = miscConstituentInfo.colors.baselineColor;
        var targetColor = miscConstituentInfo.colors.targetColor;
        var movingAveColor = miscConstituentInfo.colors.movingAveColor;
        
        var makeSeriesConfig = function(dataSet, color){
            return {
//                label: constituentName,
                data: dataSet,
                bars: {
                    barWidth: 1e10,
                    align: 'center',
                    show: true,
                    fill: true,
                    fillColor: color
                },
              };
        };
        
        var makeLongTermMeanConfig = function(dataSet, color) {
            return {
 //               label: constituentName,
                data: [[nar.fullReport.PlotUtils.YEAR_NINETEEN_HUNDRED,longTermMean],
                       [nar.fullReport.PlotUtils.ONE_YEAR_IN_THE_FUTURE,longTermMean]],
                lines: {
                    show: true,
                    fillColor: color,
                    lineWidth: 1
                },
                shadowSize: 0
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
                data : [[startDate, mean], [Date.create('1996').getTime(), mean]]
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
                data : [[Date.create('1997').getTime(), target], [endDate, target]]
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
                data : data
            };
        }
        
        var previousYearsSeries = makeSeriesConfig(previousYearsData, previousYearsColor);
        var currentYearSeries = makeSeriesConfig(currentYearData, currentYearColor);
        var longTermMeanSeries = makeLongTermMeanConfig(tsViz, longTermMeanColor);
        
        var series = [
          previousYearsSeries,
          currentYearSeries,
          longTermMeanSeries,
        ];
        if (Object.has(tsViz,'averagesAndTargets') && tsViz.averagesAndTargets !== {}) {
            if (tsViz.averagesAndTargets.mean) {
                series = series.concat(makeBaselineConfig(previousYearsSeries.data.first()[0], tsViz.averagesAndTargets.mean));
            }
            if (tsViz.averagesAndTargets.target) {
                series = series.concat(makeTargetConfig(previousYearsSeries.data.last()[0], tsViz.averagesAndTargets.target));
            }
            if (tsViz.averagesAndTargets.movingAverage && tsViz.averagesAndTargets.movingAverage.length > 0) {
                series = series.concat(makeMovingAveConfig(tsViz.averagesAndTargets.movingAverage));
            }
        }
        
        var plot = $.plot(plotContainer, series, {
            xaxis: {
                mode: 'time',
                timeformat: "%Y",
                tickLength: 10,
                ticks : nar.fullReport.PlotUtils.getTicksByYear
            },
            yaxis: {
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
            },
            legend: {
                show: false
            },
            grid:{
                hoverable: true
            },
            colors:[previousYearsColor, currentYearColor, longTermMeanColor, baselineColor, targetColor, movingAveColor] 
        });
        var hoverFormatter = nar.fullReport.PlotUtils.utcDatePlotHoverFormatter;
        nar.fullReport.PlotUtils.setPlotHoverFormatter(plotContainer, hoverFormatter);
        nar.fullReport.PlotUtils.setLineHoverFormatter(plotContainer, longTermMean, nar.definitions.longTermMean.short_definition)
        return plot;
    };    
}());