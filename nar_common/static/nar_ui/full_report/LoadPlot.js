var nar = nar || {};
nar.fullReport = nar.fullReport || {};
(function(){
    /**
     * @param {TimeSeriesVisualization} tsViz
     * returns {jquery.flot}
     */

    nar.fullReport.LoadPlot = function(tsViz){
        var plotContainer = tsViz.plotContainer;
        var allData = tsViz.timeSeriesCollection.map(function(timeSeries){
            return timeSeries.data;
        });
        var data = allData[0];//only one time series' worth of data for now.
        
        var idComponents = tsViz.getComponentsOfId();
        var constituentId = idComponents.constituent;
        var constituentInfo = nar.Constituents[constituentId];
        var constituentName = constituentInfo.name;
        var pointColor = constituentInfo.color;
        var series = [{
            label: constituentName,
            data: data,
            bars: {
                barWidth: 1e10,
                align: 'center',
                show: true,
                fill: true,
                fillColor: pointColor
            }
        }];
        
        var plot = $.plot(plotContainer, series, {
            xaxis: {
                mode: 'time',
                timeformat: "%Y"
            },
            yaxis: {
                axisLabel: constituentName + " load (million kg)",
                axisLabelUseCanvas: true,
                axisLabelFontSizePixels: 12,
                axisLabelFontFamily: "Verdana, Arial, Helvetica, Tahoma, sans-serif",
                axisLabelPadding: 5
            },
            legend: {
                   show: false
            },
            colors:[pointColor] 
        });
        
        return plot;
    };    
}());