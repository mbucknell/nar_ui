var nar = nar || {};
nar.fullReport = nar.fullReport || {};
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
		
		var flowSeries = {
			label: '2013',
			data: flowData[0],
			lines: {
				show: true,
				fill: true,
				lineWidth: 1,
				fillColor: 'lightgrey'
			}
		};
		
		var tnData = nar.fullReport.PlotUtils.createPinnedPointData(flowData[1], flowData[0]);
		
		var tnSeries = {
			data: tnData,
			points: {
				show: true,
				fill: true,
				fillColor: nar.Constituents.nitrogen.color,
				radius: 3,
				symbol: 'triangle'
			}
		};
		
		plot = $.plot(hydrographDiv, [ flowSeries, tnSeries ], {
			xaxis : {
				mode : 'time',
				timeformat : "%b",
				tickLength : 10,
				minTickSize : [ 1, 'month' ]
			},
			yaxis : {
				axisLabel : 'cfs',
				axisLabelUseCanvas : true,
				axisLabelFontSizePixels : 12,
				axisLabelFontFamily : "Verdana, Arial, Helvetica, Tahoma, sans-serif",
				axisLabelPadding : 5,
				tickLength : 10
			},
			grid : {
				hoverable : true,
				autoHighlight : true
			},
			legend : {
				show : false
			},
			colors: ['black']
		});
		var hoverFormatter = nar.fullReport.PlotUtils.utcDatePlotHoverFormatter;
		nar.fullReport.PlotUtils.setPlotHoverFormatter(plotContainer, hoverFormatter);
		
		return plot;
	};
})();