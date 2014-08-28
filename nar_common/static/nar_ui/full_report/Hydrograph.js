var nar = nar || {};
nar.fullReport = nar.fullReport || {};
nar.fullReport.canvases = nar.fullReport.canvases || [];
(function() {

	/**
	 * @param {TimeSeriesVisualization}
	 *   tsViz returns {jqPlot}
	 */
	nar.fullReport.Hydrograph = function(tsViz) {
		
		var plot;
		var plotContainer = tsViz.plotContainer;
		// going to cheat for now and make two divs at 50% width
		var hydrographDiv = $('<div>').attr('id', 'hydrograph').addClass('hydrograph');
		var flowDurationDiv = $('<div>').attr('id', 'flowDuration').addClass('hydrograph');
		plotContainer.append(hydrographDiv).append(flowDurationDiv);
		var flowData = nar.fullReport.PlotUtils.getData(tsViz);
		// get the last x value from hydrograph data as year
		var waterYear = Date.create(flowData[0].last()[0]).getFullYear();
		
		var flowSeries = {
			data: flowData[0],
			color: 'black',
			lines: {
				show: true,
				fill: true,
				lineWidth: 1,
				fillColor: 'lightgrey'
			}
		};
		
		var sampleDates = nar.fullReport.PlotUtils.createPinnedPointData(flowData[1], flowData[0]);
		
		var tnSeries = {
			label: 'Water-quality sample',
			data: sampleDates,
			color: 'red',
			points: {
				show: true,
				fill: true,
				fillColor: 'red',
				radius: 3,
				symbol: 'triangle'
			}
		};
		
		plot = $.plot(hydrographDiv, [ flowSeries, tnSeries ], {
			canvas : true,
			xaxis : {
				axisLabel : waterYear,
				axisLabelUseCanvas : true,
				axisLabelFontSizePixels : 12,
				axisLabelFontFamily : "Verdana, Arial, Helvetica, Tahoma, sans-serif",
				axisLabelPadding : 5,
				mode : 'time',
				timeformat : "%b",
				tickLength : 10,
				minTickSize : [ 1, 'month' ]
			},
			yaxis : {
				axisLabel : 'Daily mean streamflow, in cubic feet per second',
				axisLabelUseCanvas : true,
				axisLabelFontSizePixels : 10,
				axisLabelFontFamily : "Verdana, Arial, Helvetica, Tahoma, sans-serif",
				axisLabelPadding : 5,
				tickLength : 10
			},
			grid : {
				hoverable : true,
				autoHighlight : true
			},
			legend : {
				show : true,
				canvas : true
			}
		});
		var hoverFormatter = nar.fullReport.PlotUtils.utcDatePlotHoverFormatter;
		nar.fullReport.PlotUtils.setPlotHoverFormatter(plotContainer, hoverFormatter);
		
		nar.fullReport.canvases.push(plot.getCanvas());
		
		return plot;
	};
})();