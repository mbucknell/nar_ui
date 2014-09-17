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
              };
        };
        
        var makeLongTermMeanConfig = function(dataSet, color) {
            return {
                label: constituentName,
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
        
        var previousYearsSeries = makeSeriesConfig(previousYearsData, previousYearsColor);
        var currentYearSeries = makeSeriesConfig(currentYearData, currentYearColor);
        var longTermMeanSeries = makeLongTermMeanConfig(tsViz, longTermMeanColor);
        
        var series = [
          previousYearsSeries,
          currentYearSeries,
          longTermMeanSeries
        ];
        
        var plot = $.plot(plotContainer, series, {
            xaxis: {
                mode: 'time',
                timeformat: "%Y",
                tickLength: 10,
                ticks : nar.fullReport.PlotUtils.getTicksByYear
            },
            yaxis: {
                axisLabel: constituentName + " load (kg*10^6)",
                axisLabelUseCanvas: true,
                axisLabelFontSizePixels: 10,
                axisLabelFontFamily: "Verdana, Arial, Helvetica, Tahoma, sans-serif",
                axisLabelPadding: 40,
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
            colors:[previousYearsColor, currentYearColor, longTermMeanColor] 
        });
        var hoverFormatter = nar.fullReport.PlotUtils.utcDatePlotHoverFormatter;
        nar.fullReport.PlotUtils.setPlotHoverFormatter(plotContainer, hoverFormatter);
        nar.fullReport.PlotUtils.setLineHoverFormatter(plotContainer, longTermMean, nar.definitions.longTermMean.short_definition)
        return plot;
    };    
}());