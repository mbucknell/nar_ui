var nar = nar || {};

nar.plots = nar.plots || {};

(function() {
	nar.plots.createMeanAnnualConcentrationPlot = function(tsViz) {
		var constituentName = nar.plots.PlotUtils.getConstituentNameAndColors(tsViz).name.toLowerCase();
		
		var plotConfig = {
				yaxisLabel : 'Mean annual ' + constituentName + '<br/>concentration,<br/>in milligrams per liter',
				showLongTermMean : true
		};
		
		return ConstituentBarChart(tsVis, plotConfig);
	};
	
	nar.plots.createFlowWeightedConcentrationPlot = function(tsViz) {
		var constituentName = nar.plots.PlotUtils.getConstituentNameAndColors(tsViz).name.toLowerCase();
		
		var plotConfig = {
				yaxisLabel : 'Annual flow-weighted<br/> ' + constituentName + ' concentration,<br/>in milligrams per liter',
				showLongTermMean : true
		};
		
		return ConstituentBarChart(tsVis, plotConfig);	
	};
}());