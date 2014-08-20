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
        var criteriaLineValue = null;
        var miscConstituentInfo = nar.fullReport.PlotUtils.getConstituentNameAndColors(tsViz);
        var constituentName =miscConstituentInfo.name; 
        var previousYearsColor = miscConstituentInfo.colors.previousYears;
        var currentYearColor= miscConstituentInfo.colors.currentYear;
        var criteriaLineColor = miscConstituentInfo.colors.criteriaLine;
        
        if (constituentName == "Total Phosphorus") {
        	var criteriaLineValue =  nar.siteHelpInfo.tp_criteria;
        } else if (constituentName == "Total Nitrogen") {
        	var criteriaLineValue =  nar.siteHelpInfo.tn_criteria;
        } 
        
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
        
        var makeCriteriaLineConfig = function(dataSet, color) {
            return {
                label: constituentName,
                data: [[nar.fullReport.PlotUtils.YEAR_NINETEEN_HUNDRED,criteriaLineValue],
                       [nar.fullReport.PlotUtils.ONE_YEAR_IN_THE_FUTURE,criteriaLineValue]],
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
        var criteriaLineSeries = makeCriteriaLineConfig(tsViz, criteriaLineColor);
        
        var series = [
          previousYearsSeries,
          currentYearSeries,
          criteriaLineSeries
        ];
        var logBase = 10;
        var logFactor = Math.log(logBase);
        var plot = $.plot(plotContainer, series, {
            xaxis: {
                mode: 'time',
                timeformat: "%m/%Y",
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
            colors:[previousYearsColor, currentYearColor, criteriaLineColor]
        });
        var hoverFormatter = nar.fullReport.PlotUtils.utcDatePlotHoverFormatter;
        nar.fullReport.PlotUtils.setPlotHoverFormatter(plotContainer, hoverFormatter);
        nar.fullReport.PlotUtils.setLineHoverFormatter(plotContainer, criteriaLineValue, nar.definitions.longTermMean.short_definition)
        return plot;
    };    
}());