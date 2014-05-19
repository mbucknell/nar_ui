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

	var titleClass = ConstituentCurrentYearComparisonPlot.titleClass;
	var titleDiv = $('<div/>', {'class': titleClass });
	titleDiv.html(series.constituentName);
	var titleDivSelector = plotContainerSelector + ' .' + titleClass;
	plotContainer.append(titleDiv);
	if(!legendSelector){
		var legendClass = ConstituentCurrentYearComparisonPlot.legendClass;
		var legendDiv = $('<div/>', {'class': legendClass });
		legendSelector = plotContainerSelector + ' .' + legendClass;
		plotContainer.append(legendDiv);
	}
	
	var yearSeries = {

        data: [['2014', series.yearValue]],
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
//             tickFormatter: function(val, axis){
//                 var tickLabel = '';
//                 if(val > axis.datamax){
//                     tickLabel = '2014'
//                 }
//                 return tickLabel;
//             }
            mode: "categories",
//            ticks: [[-0.5, 'asdf'], [0.5, '2014']]
//            categories: ['2014']
//            axisLabel: '2014',
//            axisLabelUseCanvas: true,
//            axisLabelPadding: 3
                            
//            tickLength: 0
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
            container: legendSelector || null
        }
    });
    return plot;
};
ConstituentCurrentYearComparisonPlot.defaultAverageColor = '#D8DCDC';
ConstituentCurrentYearComparisonPlot.titleClass = 'currentYearComparisonTitle';
ConstituentCurrentYearComparisonPlot.legendClass = 'currentYearComparisonLegend';
ConstituentCurrentYearComparisonPlot.plotClass = 'currentYearComparisonPlot';