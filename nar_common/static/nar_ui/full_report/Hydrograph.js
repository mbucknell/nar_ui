var nar = nar || {};
nar.fullReport = nar.fullReport || {};
(function() {

	var FLOW_DATA_CLASS = 'flow_data_inner_plot';
	var HYDROGRAPH_ID = 'hydrograph';
	var FLOW_DURATION_ID = 'flowDuration';
	
	var sharedFlowData;
	
	nar.fullReport.FlowWrapper = function(tsViz) {
		var plotContainer = tsViz.plotContainer;
		var displayedPlots = 
			[
				nar.fullReport.Hydrograph(tsViz),
				nar.fullReport.FlowDuration(tsViz)
			];
		var remove = function() {
			displayedPlots.each(function(plot) {
				plot.remove();
			});
		};
		var shutdown = function() {
			displayedPlots.each(function(plot) {
				plot.shutdown();
			});
		};
		var getOptions = function() {
			// no modifying options from outside
			return undefined;
		};
		var setupGrid = function() {
			displayedPlots.each(function(plot) {
				plot.setupGrid();
			});
		};
		var draw = function() {
			displayedPlots.each(function(plot) {
				plot.draw();
			});
		};
		return {
			getOptions : getOptions,
			setupGrid : setupGrid,
			draw : draw,
			remove : remove,
			shutdown : shutdown
		};
	};

	/**
	 * @param {TimeSeriesVisualization}
	 *   tsViz returns {jqPlot}
	 */
	nar.fullReport.Hydrograph = function(tsViz) {
		
		var plot;
		var plotContainer = tsViz.plotContainer;
		var hydrographDiv = $('#' + HYDROGRAPH_ID);
		if (hydrographDiv.length == 0) {
			hydrographDiv = $('<div>').attr('id', HYDROGRAPH_ID).addClass(FLOW_DATA_CLASS);
			plotContainer.append(hydrographDiv);
		}
		sharedFlowData = sharedFlowData || nar.fullReport.PlotUtils.getData(tsViz);
		// get the last x value from hydrograph data as year
		var waterYear = Date.create(sharedFlowData[0].last()[0]).getFullYear();
		
		var flowSeries = {
			data: sharedFlowData[0],
			color: 'black',
			lines: {
				show: true,
				fill: true,
				lineWidth: 1,
				fillColor: 'lightgrey'
			}
		};
		
		var sampleDates = nar.fullReport.PlotUtils.createPinnedPointData(sharedFlowData[1], sharedFlowData[0]);
		
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
		nar.fullReport.PlotUtils.setPlotHoverFormatter(hydrographDiv, hoverFormatter);
		
		return plot;
	};
	
	nar.fullReport.FlowDuration = function(tsViz) {
		var plot;
		var plotContainer = tsViz.plotContainer;
		var flowDurationDiv = $('#' + FLOW_DURATION_ID);
		if (flowDurationDiv.length == 0) {
			flowDurationDiv = $('<div>').attr('id', FLOW_DURATION_ID).addClass(FLOW_DATA_CLASS);
			plotContainer.append(flowDurationDiv);
		}
		
		sharedFlowData = sharedFlowData || nar.fullReport.PlotUtils.getData(tsViz);
		
		var sortedFlowData = sharedFlowData[0].sortBy(function(point) {
			return point[1];
		}, true);
		
		var exceedanceWithDates = sortedFlowData.map(function(point, index) {
			var exceedance = 100 * ((index + 1) / sortedFlowData.length);
			return [exceedance, point[1], point[0]];
		});
		
		var swappedSampleDates = sharedFlowData[1].map(function(point) {
			return [nar.fullReport.PlotUtils.findNearestYValueAtX(exceedanceWithDates, point[0], 2, 0), point[1]];
		});
		
		var exceedanceDatesRemoved = exceedanceWithDates.map(function(point) {
			return [point[0], point[1]];
		});
		
		var sampleDates = nar.fullReport.PlotUtils.createPinnedPointData(swappedSampleDates, exceedanceDatesRemoved);
		
		var flowSeries = {
			data: exceedanceDatesRemoved,
			color: 'black',
			lines: {
				show: true,
				lineWidth: 1
			}
		};

		var sampleSeries = {
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
		
		plot = $.plot(flowDurationDiv, [ flowSeries, sampleSeries ], {
			canvas : true,
			xaxis : {
				axisLabel : 'Percent of time exceeded',
				axisLabelUseCanvas : true,
				axisLabelFontSizePixels : 12,
				axisLabelFontFamily : "Verdana, Arial, Helvetica, Tahoma, sans-serif",
				axisLabelPadding : 5,
				ticks: [[.01,.01],
					[.1,''],
					[1,''],
					[5,''],
					[10,10],
					[20,20],
					[30,30],
					[40,40],
					[50,50],
					[60,60],
					[70,70],
					[80,80],
					[90,90],
					[95,''],
					[99,99],
					[99.9,''],
					[99.99,'']],
				tickLength : 10,
				min: 0,
				max: 100
			},
			yaxis : {
				transform: function(y) {
					return Math.log(y);
				},
				inverseTransform: function(y) {
					return Math.exp(y);
				},
				axisLabel : 'Daily mean streamflow, in cubic feet per second',
				axisLabelUseCanvas : true,
				axisLabelFontSizePixels : 10,
				axisLabelFontFamily : "Verdana, Arial, Helvetica, Tahoma, sans-serif",
				axisLabelPadding : 5,
				tickLength : 10,
				ticks : function(axis) {
					var result = [];
					var tick = axis.min;
					var i = 0;
					while (tick < axis.max) {
						result.add(tick);
						tick = (i.isEven()) ? tick * 5 : tick * 2;
						i++;
					}
					return result;
				},
				min: 100
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
		var hoverFormatter = function(x, y) {
			return x.toFixed(2) + '% - ' + y 
		};
		nar.fullReport.PlotUtils.setPlotHoverFormatter(flowDurationDiv, hoverFormatter);
		return plot;
	};
})();