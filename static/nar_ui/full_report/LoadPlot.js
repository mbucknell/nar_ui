var nar = nar || {};
nar.fullReport = nar.fullReport || {};
(function(){
    
    var getXcoord = function(point){
        return point[0];
    };
    
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
      //assume sorted data set
        var latestPoint = data.last();
        var lastDate = new Date(getXcoord(latestPoint));
        var lastYear = lastDate.getFullYear();
        //must use string for year
        var startOfLastYear = Date.create(''+lastYear);
        var startOfLastYearTimestamp = startOfLastYear.getTime();

        var indexOfFirstDataPointInLastYear = data.findIndex(function(dataPoint){
           var timestamp = getXcoord(dataPoint);
           return timestamp >= startOfLastYearTimestamp;
        });
        var indicesToHighlight = data.from(indexOfFirstDataPointInLastYear);
        
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
            },
            highlightColor: 'rgb(255,255,0)'
        }];
        
        var plot = $.plot(plotContainer, series, {
            xaxis: {
                mode: 'time',
                timeformat: "%Y",
                minTickSize: [1, 'year']
            },
            yaxis: {
                axisLabel: constituentName + " load (kg*10^6)",
                axisLabelUseCanvas: true,
                axisLabelFontSizePixels: 10,
                axisLabelFontFamily: "Verdana, Arial, Helvetica, Tahoma, sans-serif",
                axisLabelPadding: 40
            },
            legend: {
                   show: false
            },
            colors:[pointColor] 
        });
        var seriesIndex = 0; 
        indicesToHighlight.each(function(index){
            //plot.highlight(seriesIndex, index);
        });
        return plot;
    };    
}());