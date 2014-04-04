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
 * @param {String} selector a jquery selector
 * @param {Object} series an object of the following format:
 * {
		constituentName: 'myConstituentName',
		constituentUnit: '',
		yearValue: 0,
		yearColor: '#00FF00'
		averageValue: 10,
		averageColor: '#00FF00'
	}
 */

var ConstituentCurrentYearComparisonPlot = function(plotSelector, series, legendSelector){
	
	if(!$(plotSelector).length){;
		throw Error('Bar Chart could not find element with jquery selector "' + plotSelector + '".');
	}
	
	if(legendSelector && !$(legendSelector).length){
		throw Error('Bar Chart could not find element with jquery selector "' + legendSelector + '".');
	}
	
	var yearSeries = {
        data: [[series.constituentName, series.yearValue]],
        label: series.constituentName + ' 2014',
        bars: {
                show: true,
                barWidth: 0.4,
                align: "right",
            	fillColor: series.yearColor
            }
    };
	
	var averageSeries = {
        data : [[series.constituentName, series.averageValue]],
		label : series.constituentName + ' average 1990-2013',
		bars : {
			show : true,
			barWidth : 0.4,
			align : "left",
			fillColor: series.averageColor
		}
    };
	
	var flotSeries = [yearSeries, averageSeries];

    var plot = $.plot(plotSelector, flotSeries, {
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
            axisLabelPadding: 3
        },
        grid: { hoverable: true, clickable: true },
        colors: [series.yearColor, series.averageColor],
        tooltip: true,
        tooltipOpts: {
        	content: '%s: %y ' + series.constituentUnit 
        },
        legend: {
        	container: legendSelector || null
        }
    });
    return plot;
}