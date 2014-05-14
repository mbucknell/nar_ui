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
    
    nar.fullReport.SampleConcentrationPlot = function(tsViz){
        var plotContainer = tsViz.plotContainer;
        var allData = tsViz.timeSeriesCollection.map(function(timeSeries){
            return timeSeries.data;
        });
        var data = allData[0];//only one time series' worth of data for now.
        //do not assume sorted data set
        var latestPoint = data.max(getXcoord);
        var lastDate = new Date(getXcoord(latestPoint));
        var lastYear = lastDate.getFullYear();
        //must use string for year
        var startOfLastYear = Date.create(''+lastYear);
        var endOfLastYear = startOfLastYear.clone().endOfYear();
        var startOfLastYearTimestamp = startOfLastYear.getTime();
        var endOfLastYearTimestamp = endOfLastYear.getTime();
        var lastYearMillisecondRange = Number.range(startOfLastYearTimestamp, endOfLastYearTimestamp);
        var indicesToHighlight = [];
        data.each(function(dataPoint, index){
           var timestamp = getXcoord(dataPoint);
           if(lastYearMillisecondRange.contains(timestamp)){
               indicesToHighlight.push(index);
           }
        });
     
        var idComponents = tsViz.getComponentsOfId();
        var constituentId = idComponents.constituent;
        var constituentInfo = nar.Constituents[constituentId];
        var constituentName = constituentInfo.name;
        var pointColor = constituentInfo.color;
        var series = [{
            label: constituentName,
            data: data,
            points: {
                radius: 3,
                show: true,
                fill: true,
                fillColor: pointColor
            },
            highlightColor: 'rgb(255,255,0)'
        }];
        
        var plot = $.plot(plotContainer, series, {
            xaxis: {
                mode: 'time',
                timeformat: "%Y"
            },
            yaxis: {
                axisLabel: constituentName + " (mg/L)",
                axisLabelUseCanvas: true,
                axisLabelFontSizePixels: 12,
                axisLabelFontFamily: "Verdana, Arial, Helvetica, Tahoma, sans-serif",
                axisLabelPadding: 5,
                ticks: [1, 5, 10, 50, 100, 500, 1000],
                tickDecimals: 2,
                transform: function(value){
                    if(0 >= value){
                        return 0;
                    }
                    else{
                        return Math.log(value);
                    }
                }
            },
            legend: {
                   show: false
            },
            colors:[pointColor] 
        });
        var seriesIndex = 0; 
        indicesToHighlight.each(function(index){
            plot.highlight(seriesIndex, index);
        });
        return plot;
    };    
}());