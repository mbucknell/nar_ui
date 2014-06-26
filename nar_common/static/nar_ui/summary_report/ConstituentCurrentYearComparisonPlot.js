/**
 * This file depends on:
 * jquery.flot.js
 * jquery.flot.resize.js
 * jquery.flot.categories.js
 * 
 * plugin: jquery.flot.axislabels.js
 * plugin: jquery.flot.tooltip.js
 * 
 */

/**
 * Do not invoke as a constructor (with the 'new' keyword).
 * 
 * @param {String} selector a jquery selector for the plot element
 * @param {Object} series an object of the following format:
 * {
		constituentName: 'Nitrate',
		constituentUnit: 'Million kg',
		displayUnitOnYAxis: true, //optional -- defaults to false
		yearValue: 0,
		yearColor: '#00FF00',
		averageName: 'Average 1990-2000',
		averageValue: 10,
		averageColor: '#FF' //optional -- defaults to ConstituentCurrentYearComparisonPlot.defalutAverageColor
	}
   @param {String} legendSelector a jquery selector for the legend element
 */
var nar = nar || {};
nar.fullReport = nar.fullReport || {};
(function(){
    
var ConstituentCurrentYearComparisonPlot = function(plotContainerSelector, series, legendSelector){

	nar.util.assert_selector_present(plotContainerSelector);
	if(legendSelector){
		nar.util.assert_selector_present(legendSelector);
	}
	
	var averageColor = series.averageColor || ConstituentCurrentYearComparisonPlot.defaultAverageColor;
	
	var plotContainer = $(plotContainerSelector);

	var plotClass= ConstituentCurrentYearComparisonPlot.plotClass;
	var plotDiv = $('<div/>', {'class': plotClass});
	var plotDivSelector = plotContainerSelector + ' .' + plotClass;
	plotContainer.append(plotDiv);
	
	
	var legendElt = $('<div/>', {'class': ConstituentCurrentYearComparisonPlot.legendClass});
	var yearLegendClass = ConstituentCurrentYearComparisonPlot.yearLegendClass;
    var yearLegendElt = $('<span/>', {'class': yearLegendClass });
    yearLegendElt.html('2014');
    var yearLegendEltSelector = plotContainerSelector + ' .' + yearLegendClass;
    
    var averageLegendClass = ConstituentCurrentYearComparisonPlot.averageLegendClass;
    var averageLegendElt = $('<span/>', {'class': averageLegendClass });
    averageLegendElt.html('Avg');
    legendElt.append(averageLegendElt);
    legendElt.append(yearLegendElt);
    plotContainer.append(legendElt);
	
	var titleClass = ConstituentCurrentYearComparisonPlot.titleClass;
	var titleDiv = $('<div/>', {'class': titleClass });
	titleDiv.html(series.constituentName);
	var titleDivSelector = plotContainerSelector + ' .' + titleClass;
	plotContainer.append(titleDiv);
	
	var yearSeries = {

        data: [['', series.yearValue]],
        label: '2014',
        bars: {
                show: true,
                barWidth: 4,
                align: "left",
                fillColor: series.yearColor
            }
    };
	
	var averageSeries = {
        data : [['', series.averageValue]],
		label : series.averageName,
		bars : {
			show : true,
			barWidth : 4,
			align : "right",
			fillColor: averageColor
		}
    };
	
	var flotSeries = [averageSeries, yearSeries];

    var plot = $.plot(plotDivSelector, flotSeries, {
        xaxis: {
            mode: "categories",
        },
        yaxis: {
            axisLabel: series.displayUnitOnYAxis ? series.constituentUnit : null,
            axisLabelUseCanvas: true,
            axisLabelPadding: 3
        },
        grid: { hoverable: true, clickable: true },
        colors: [averageColor, series.yearColor],
        tooltip: true,
        tooltipOpts: {
            content: '%s: %y ' + series.constituentUnit 
        },
        legend: {
            show: false
        }
    });
    return plot;
};
ConstituentCurrentYearComparisonPlot.defaultAverageColor = '#D8DCDC';
ConstituentCurrentYearComparisonPlot.titleClass = 'currentYearComparisonTitle';
ConstituentCurrentYearComparisonPlot.yearLegendClass = 'currentYearComparisonYearLegend';
ConstituentCurrentYearComparisonPlot.averageLegendClass = 'currentYearComparisonAverageLegend';
ConstituentCurrentYearComparisonPlot.legendClass = 'comparisonLegend';
ConstituentCurrentYearComparisonPlot.plotClass = 'currentYearComparisonPlot';

nar.fullReport.ConstituentCurrentYearComparisonPlot = ConstituentCurrentYearComparisonPlot;

}());