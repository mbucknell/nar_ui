var nar = nar || {};

nar.plots = nar.plots || {};

(function() {
	nar.plots.createFlowPlot = function(tsViz) {
		return nar.plots.createConstituentBarChart(tsViz, {
			yaxisLabel : 'Annual streamflow<br/>in millions of acre feet',
			yaxisTickFormatter : function (val) {
				return (val / 1000000).format();
			},
			showLongTermMean : true,
			showLongTermMeanHover : true,
			plotHoverFormatter : function(x, y) {
				return nar.plots.PlotUtils.waterYearPlotHoverFormatter(x, y / 1000000, 3);
			}
		});
	};
	
}());