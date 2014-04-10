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
		constituentName: 'myConstituentName',
		constituentUnit: '',
		yearValue: 0,
		yearColor: '#00FF00'
		averageValue: 10,
		averageColor: '#00FF00'
	}
   @param {String} legendSelector a jquery selector for the legend element
 */

var ConstituentCurrentYearComparisonPlot = function(plotContainerSelector, series){
	
	if(!$(plotContainerSelector).length){;
		throw Error('Bar Chart could not find element with jquery selector "' + plotContainerSelector + '".');
	}
	
	var plotContainer = $(plotContainerSelector);

	var plotClass= ConstituentCurrentYearComparisonPlot.plotClass;
	var plotDiv = $('<div/>', {'class': plotClass});;
	var plotDivSelector = plotContainerSelector + ' .' + plotClass;
	plotContainer.append(plotDiv);

	var titleClass = ConstituentCurrentYearComparisonPlot.titleClass;
	var titleDiv = $('<div/>', {'class': titleClass });
	titleDiv.html(series.constituentName);
	var titleDivSelector = plotContainerSelector + ' .' + titleClass;
	plotContainer.append(titleDiv);
	
	var legendClass = ConstituentCurrentYearComparisonPlot.legendClass;
	var legendDiv = $('<div/>', {'class': legendClass });
	var legendDivSelector = plotContainerSelector + ' .' + legendClass;
	plotContainer.append(legendDiv);

	
	var yearSeries = {

        data: [['', series.yearValue]],
        label: '2014',
        bars: {
                show: true,
                barWidth: 0.4,
                align: "right",
            	fillColor: series.yearColor
            }
    };
	
	var averageSeries = {
        data : [['', series.averageValue]],
		label : 'Average 1990-2013',
		bars : {
			show : true,
			barWidth : 0.4,
			align : "left",
			fillColor: series.averageColor
		}
    };
	
	var flotSeries = [yearSeries, averageSeries];

    var plot = $.plot(plotDivSelector, flotSeries, {
        series: {
            bars: {
                show: true,
                barWidth: 0.6,
                align: "center"
            }
        },
        xaxis: {
            mode: "categories",
            tickLength: 0
        },
        yaxis: {
        	axisLabel: series.constituentUnit,
        	axisLabelUseCanvas: true,
            axisLabelPadding: 3
        },
        grid: { hoverable: true, clickable: true },
        colors: [series.yearColor, series.averageColor],
        tooltip: true,
        tooltipOpts: {
        	content: '%s: %y ' + series.constituentUnit 
        },
        legend: {
        	container: legendDivSelector || null
        }
    });
    return plot;
};
ConstituentCurrentYearComparisonPlot.titleClass = 'currentYearComparisonTitle';
ConstituentCurrentYearComparisonPlot.legendClass = 'currentYearComparisonLegend';
ConstituentCurrentYearComparisonPlot.plotClass = 'currentYearComparisonPlot';