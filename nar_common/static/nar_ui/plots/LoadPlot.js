var nar = nar || {};
nar.plots = nar.plots || {};
(function(){

    /**
     * @param {TimeSeriesVisualization} tsViz
     * returns {jquery.flot}
     */

	nar.plots.LoadPlot = function(tsViz){
		var constituentName = nar.plots.PlotUtils.getConstituentNameAndColors(tsViz).name;
		var plotConfig = {
				yaxisLabel : constituentName + " load,<br />in thousands of tons",
				showLongTermMean : true,
				plotHoverFormatter : function(x, y) {
					return nar.plots.PlotUtils.waterYearPlotHoverFormatter(x, y, 0)
				}
		};
		var BASELINE_COLOR = 'black';
        var TARGET_LINE_COLOR = 'black';
        var MOVING_AVE_COLOR = 'black';
        var HYPOXIC_EXTENT_COLOR = 'black';
        
        var BASELINE_END_DATE = Date.create('1996').getTime();
        var TARGET_START_DATE = Date.create('1997').getTime();
        
        var makeBaselineConfig = function(startDate, mean) {
            return {
                label : 'Baseline Average ',
                lines: {
                    show: true,
                    fillColor: BASELINE_COLOR,
                    lineWidth: 1
                },
                shadowSize : 0,
                data : [[startDate, mean], [BASELINE_END_DATE, mean]],
                yaxis : 1,
                color : BASELINE_COLOR
            };
        };
        
        var makeTargetConfig = function(endDate, target) {
            return {
                label : '45% target reduction',
                dashes: {
                    show : true,
                    dashLength : [15, 15]
                },
                lines : {
                    show: true,
                    fillColor: TARGET_LINE_COLOR,
                    lineWidth: 0
                },
                shadowSize : 0,
                data : [[TARGET_START_DATE, target], [endDate, target]],
                yaxis : 1,
                color : TARGET_LINE_COLOR
            };
        };
        
        var makeMovingAveConfig = function(movingAverage) {
            var data = [];
            var i;
            for (i = 0; i < movingAverage.length; i++) {
                data.push([Date.create(movingAverage[i].waterYear, 0, 1).getTime(), movingAverage[i].ave]);
            }
            
            return {
                label : '5-year moving average',
                dashes: {
                    show : true,
                    dashLength: [2, 2]
                },
                lines : {
                    show: true,
                    fillColor: MOVING_AVE_COLOR,
                    lineWidth: 0
                },
                shadowSize: 0,
                data : data,
                yaxis : 1,
                color : MOVING_AVE_COLOR
            };
        };
        
        var makeHypoxicExtentConfig = function(extent) {
			var data = [];
			var i;
			for (i = 0; i < extent.length; i++) {
				data.push([Date.create(extent[i].water_year, 0, 1).getTime(), extent[i].area_sqkm]);
			}
			return {
				label : 'Gulf Hypoxic Extent',
				dashes : {
					show : true,
					dashLength : [5, 5]
				},
				line : {
					show : true,
					fillColor : HYPOXIC_EXTENT_COLOR,
					lineWidth : 0
				},
				shadowSize : 0,
				data : data,
				yaxis : 2,
				color : HYPOXIC_EXTENT_COLOR
			};
		};
        
        // Create auxillary data series if in tsViz
        if (Object.has(tsViz, 'auxData')) {
			plotConfig.auxData = [];
			
			if (Object.has(tsViz.auxData, 'mean')) {
				plotConfig.auxData.push(makeBaselineConfig(tsViz.timeSeriesCollection.getData().first().first()[0], tsViz.auxData.mean));
			}
			
			if (Object.has(tsViz.auxData, 'target')) {
				plotConfig.auxData.push(makeTargetConfig(tsViz.timeSeriesCollection.getData().first().last()[0], tsViz.auxData.target));
			}
			
			if (Object.has(tsViz.auxData, 'movingAverage') && tsViz.auxData.movingAverage.length > 0) {
				plotConfig.auxData.push(makeMovingAveConfig(tsViz.auxData.movingAverage));
			}
			
			if (Object.has(tsViz.auxData, 'gulfHypoxicExtent')) {
				plotConfig.auxData.push(makeHypoxicExtentConfig(tsViz.auxData.gulfHypoxicExtent)); 
				plotConfig.secondaryYaxis = {
					position : 'right',
					axisLabel: 'Observed total hypoxic area, <br/> in thousands of square <br/>kilometers',
					axisLabelFontSizePixels: 10,
					axisLabelFontFamily: "Verdana, Arial, Helvetica, Tahoma, sans-serif",
					axisLabelPadding: 10,
					tickLength: 10,
					tickFormatter : function(val) {
						return val / 1000;
					}
				};
			}
        }
        
        var plot = nar.plots.createConstituentBarChart(tsViz, plotConfig);
        
        return plot;
    };    
}());