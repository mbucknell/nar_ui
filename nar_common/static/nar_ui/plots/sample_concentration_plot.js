var nar = nar || {};
nar.plots = nar.plots || {};
(function(){
    /**
     * @param {TimeSeriesVisualization} tsViz
     * returns {jquery.flot}
     */
    
    nar.plots.SampleConcentrationPlot = function(tsViz){
        var plotContainer = tsViz.plotContainer;
        var splitData = nar.plots.PlotUtils.getDataSplitIntoCurrentAndPreviousYears(tsViz.timeSeriesCollection.getDataMerged());
        var previousYearsData = splitData.previousYearsData;
        var currentYearData = splitData.currentYearData;  
        var miscConstituentInfo = nar.plots.PlotUtils.getConstituentNameAndColors(tsViz);
        var constituentName =miscConstituentInfo.name; 
        var previousYearsColor = miscConstituentInfo.colors.previousYears;
        var currentYearColor= miscConstituentInfo.colors.currentYear;
        var criteriaLineColor = miscConstituentInfo.colors.criteriaLine;
        var constituentId = tsViz.getComponentsOfId().constituent;
        // We only show a criteria line on sample reports if the constituent is Nitrate
        var useCriteriaLine = constituentId === 'nitrate';
        var constituentToCriteria;
        
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
        
        if (useCriteriaLine) {
        	constituentToCriteria = {
    			nitrogen : nar.siteHelpInfo.tn_criteria,
    			phosphorus : nar.siteHelpInfo.tp_criteria,
    			nitrate : 10
    		};
        	var criteriaLineValue = constituentToCriteria[constituentId] || null;
        	var criteriaLineSeries = {
                    label: constituentName,
                    data: [[nar.plots.PlotUtils.YEAR_NINETEEN_HUNDRED,criteriaLineValue],
                           [nar.plots.PlotUtils.ONE_YEAR_IN_THE_FUTURE,criteriaLineValue]],
                    lines: {
                        show: true,
                        fillColor: criteriaLineColor,
                        lineWidth: 1
                    },
                    shadowSize: 0
                };
        	
        	series.add(criteriaLineSeries);
        }
        
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
                axisLabel: constituentName + ",<br /> in milligrams per liter",
                axisLabelFontSizePixels: 10,
                axisLabelFontFamily: "Verdana, Arial, Helvetica, Tahoma, sans-serif",
                axisLabelPadding: 5,
                ticks: [0.001,0.01,0.1,1,10,100, 1000],
                tickFormatter: nar.plots.PlotUtils.logTickFormatter,
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
        
        if (useCriteriaLine) {
			var criteriaLineDescription = 'EPA MCL = ' +
					constituentToCriteria[constituentId] +
					' mg/L as N. See technical information for details.';

			nar.plots.PlotUtils.setPlotHoverFormatter(plotContainer, nar.plots.PlotUtils.utcDatePlotHoverFormatter);
			nar.plots.PlotUtils.setLineHoverFormatter(plotContainer, criteriaLineValue, criteriaLineDescription);
		}
        
        return plot;
    };    
}());