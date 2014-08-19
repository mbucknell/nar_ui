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
		var div1 = $('<div>').attr('id', 'test1').addClass('hydrograph');
		var div2 = $('<div>').attr('id', 'test2').addClass('hydrograph');
		plotContainer.append(div1).append(div2);
		var flowData = nar.fullReport.PlotUtils.getData(tsViz);
		
		var makeSeriesConfig = function(dataSet, color){
			return {
				label: '2013',
				data: dataSet,
				lines: {
					show: true,
					fill: true,
					lineWidth: 1,
					fillColor: color
				}
			};
		};
		
		var flowSeries = makeSeriesConfig(flowData, 'lightgrey');
		
		plot = $.plot(div1, [ flowSeries ], {
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