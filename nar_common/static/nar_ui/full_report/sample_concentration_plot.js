var nar = nar || {};
nar.fullReport = nar.fullReport || {};
(function(){
    /**
     * @param {TimeSeriesVisualization} tsViz
     * returns {jquery.flot}
     */
    
    nar.fullReport.SampleConcentrationPlot = function(tsViz){
        var plotContainer = tsViz.plotContainer;
        var splitData = nar.fullReport.PlotUtils.getDataSplitIntoCurrentAndPreviousYears(tsViz);
        var previousYearsData = splitData.previousYearsData;
        var currentYearData = splitData.currentYearData;  
        var miscConstituentInfo = nar.fullReport.PlotUtils.getConstituentNameAndColors(tsViz);
        var constituentName =miscConstituentInfo.name; 
        var previousYearsColor = miscConstituentInfo.colors.previousYears;
        var currentYearColor= miscConstituentInfo.colors.currentYear;
        
        var makeSeriesConfig = function(dataSet, color){
            return {
                label: constituentName,
                data: dataSet,
                points: {
                    radius: 3,
                    show: true,
                    fill: true,
                    fillColor: color
                },
                shadowSize: 0
            };   
        };
        
        var previousYearsSeries = makeSeriesConfig(previousYearsData, previousYearsColor);
        var currentYearSeries = makeSeriesConfig(currentYearData, currentYearColor);
        var series = [
          previousYearsSeries,
          currentYearSeries
        ];
        var logBase = 10;
        var logFactor = Math.log(logBase);
        var plot = $.plot(plotContainer, series, {
            xaxis: {
                mode: 'time',
                timeformat: "%Y/%m",
                tickLength: 10,
                minTickSize: [1, 'month']
            },
            yaxis: {
                axisLabel: constituentName + " (mg/L)",
                axisLabelUseCanvas: true,
                axisLabelFontSizePixels: 12,
                axisLabelFontFamily: "Verdana, Arial, Helvetica, Tahoma, sans-serif",
                axisLabelPadding: 5,
                ticks: [0.001,0.01,0.1,1,10,100, 1000],
                tickFormatter: nar.fullReport.PlotUtils.logTickFormatter,
                tickLength: 10,
                min: 0.001,
                transform: function(value){
                    if(0 >= value){
                        return 0;
                    }
                    else{
                        return Math.log(value)/logFactor;
                    }
                },
                inverseTransform: function(value){
                    return Math.pow(logBase, value);
                } 
            },
            grid:{
                hoverable: true,
                autoHighlight: true
            },
            legend: {
                   show: false
            },
            colors:[previousYearsColor, currentYearColor]
        });
        var hoverFormatter = nar.fullReport.PlotUtils.utcDatePlotHoverFormatter;
        nar.fullReport.PlotUtils.setPlotHoverFormatter(plotContainer, hoverFormatter);
        return plot;
    };    
}());