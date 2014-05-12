var nar = nar || {};
nar.fullReport = nar.fullReport || {};
(function(){
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
        var pointColor = 'rgb(255,0,0)';
        var series = [{
            label: tsViz.id,
            data: data,
            points: {
                radius: 3,
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
                axisLabel: tsViz.id + " concentration in mg/L",
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
        
        return plot;
    };
}());