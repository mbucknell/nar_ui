var nar = nar || {};
nar.plots = nar.plots || {};

/* @typedef config
 * @property {String} plotDivId - id of div to create plot
 * @property {Array of TimeSeries.Collection} tsCollections
 * @property {Array of WFS features} basinFeatures - Each element in basinFeatures is represented by matching element in tsCollections
 * @property {String} yaxisLabel (optional)
 * @property {String} title (optional)
 * @property {Function} yaxisFormatter (optional) - function takes a floating point number and returns a string.
 * 
 * @return jqplot
 */
nar.plots.createCoastalBasinPlot = function (config){
	var avgData = [];
	var currentYearData = [];
	
	var dataValue = function(dataPoint) {
		return parseFloat(dataPoint[1]);
	};
	
	var ticks = config.basinFeatures.map(function(feature) {
		return feature.attributes.STANAME.first(15); //TODO use new attribute from shapefile when available
	});
	
	var yTickOptions = {};
	
	if (Object.has(config, 'yaxisFormatter')) {
		yTickOptions.formatter = config.yaxisFormatter;
	}
	
	// Create data series for each collection for the avg up to the current water year and the current year.
	config.tsCollections.forEach(function(tsC) {
		var sortedData = tsC.getDataMerged();
		var splitData = nar.plots.PlotUtils.getDataSplitIntoCurrentAndPreviousYears(sortedData);
		
		if (splitData.previousYearsData.length === 0) {
			avgData.push(0);
		}
		else {
			avgData.push(splitData.previousYearsData.average(dataValue));
		}
		if (splitData.currentYearData.length === 0) {
			currentYearData.push(0);
		}
		else {
			currentYearData.push(dataValue(splitData.currentYearData.first()));
		}
	});
	
	// Create bar plot
	$.jqplot(config.plotDivId, [avgData, currentYearData], {
		seriesDefaults : {
			renderer: $.jqplot.BarRenderer,
			rendererOptions :  {
				barPadding: 0,
				barMargin: 20,
				barDirection: 'vertical'
			},
			shadow : false
		},
		series: [
		         {label : 'Average: ' + CONFIG.startWaterYear + '-' + (CONFIG.currentWaterYear - 1), color : "#A0A0A0"},
		         {label : CONFIG.currentWaterYear, color: nar.Constituents.nitrate.color}
		],
		legend: {
			show: true,
			placement: 'insideGrid',
			location : 'nw'
		},
		title: {
			text: config.title,
			show : Object.has(config, 'title')
		},
		grid: {
			drawGridlines : false,
			shadow : false
		},
		axes : {
			xaxis: {
				renderer: $.jqplot.CategoryAxisRenderer,
				ticks: ticks,
			},
			yaxis: {
				label : config.yaxisLabel,
				showLabel : Object.has(config, 'yaxisLabel'),
				labelRenderer : $.jqplot.CanvasAxisLabelRenderer,
				tickOptions : yTickOptions
			}
		},
		highlighter : {
			show : true,
			showMarker: false,
			showToolTip : true,
			tooltipLocation : 'n',
			tooltipAxes : 'y',
		}
		
	});
};
