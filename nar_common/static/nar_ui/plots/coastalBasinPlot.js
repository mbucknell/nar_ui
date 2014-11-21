var nar = nar || {};
nar.plots = nar.plots || {};

/*
 * @param {String} plotDivId - id of div to create plot
 * @param {Array of TimeSeries.Collection} tsCollections
 * @param {Array of WFS features} basinFeatures - Each element in basinFeatures is represented by matching element in tsCollections
 * @return jqplot
 */
nar.plots.createCoastalBasinPlot = function (plotDivId, tsCollections, basinFeatures, yaxisLabel, title){
	var avgData = [];
	var currentYearData = [];
	
	var dataValue = function(dataPoint) {
		return parseFloat(dataPoint[1]);
	};
	
	tsCollections.forEach(function(tsC) {
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
	
	var ticks = basinFeatures.map(function(feature) {
		return feature.attributes.STANAME.first(15); //TODO use new attribute from shapefile
	});
	
	var plot = $.jqplot(plotDivId, [avgData, currentYearData], {
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
		         {label : 'Average', color : "#A0A0A0"},
		         {label : CONFIG.currentWaterYear, color: nar.Constituents.nitrate.color}
		],
		legend: {
			show: true,
			placement: 'insideGrid',
			location : 'nw'
		},
		title: {
			text: title,
			show : true
		},
		grid: {
			drawGridlines : false
		},
		axes : {
			xaxis: {
				renderer: $.jqplot.CategoryAxisRenderer,
				ticks: ticks,
			},
			yaxis: {
				label : yaxisLabel,
				showLabel : true,
				labelRenderer : $.jqplot.CanvasAxisLabelRenderer,
				tickOptions : {
					formatter : function(format, value) {
						return value.format();
					}
				}
			}
		},
		highlighter : {
			show : true,
			showMarker: false,
			showToolTip : true,
			tooltipLocation : 'n',
			tooltipAxes : 'y'
		}
		
	});
	
	return plot;
};
