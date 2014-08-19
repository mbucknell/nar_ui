var nar = nar || {};
nar.fullReport = nar.fullReport || {};
(function() {

	/**
	 * @param {TimeSeriesVisualization}
	 *   tsViz returns {jqPlot}
	 */
	nar.fullReport.Hydrograph = function(tsViz) {
		
		var plot = new PlotWrapper();
		var plotContainer = tsViz.plotContainer;
		var flowData = nar.fullReport.PlotUtils.getPreviousYearsData(tsViz);
		var miscConstituentInfo = nar.fullReport.PlotUtils.getConstituentNameAndColors(tsViz);
		var constituentName = miscConstituentInfo.name;
		
		return plot;
	};
	/**
	 * This wraps the plot so that flot calls will cause the anticipated result
	 * 
	 * Note: sometimes that result is a noop based on the needs of Hydrograph
	 */
	var PlotWrapper = function() {
		return {
			getOptions : function() {
				return {
					xaxes : [{
						min : undefined,
						max : undefined
					}]
				}
			},
			setupGrid : function() {
				// ignore this for now
			},
			draw : function() {
				// ignore this for now
			},
			shutdown : function() {
				// ignore this for now
			}
		}
	} 
})();