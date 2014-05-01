var nar = nar || {};
nar.fullReport = nar.fullReport || {};
/**
 * @param {Object} config an object of the following format:
 * {
 *      selector: '#myjQuerySelector',
 *      constituentName: 'Nitrate',
 *      constituentColor: 'rgb(255,0,0)',
 *      data: [
 *          [0, 1, ... ,9 ],
 *          .
 *          .
 *          .
 *      ]
 *      
 * }
 */
nar.fullReport.SampleConcentrationPlot = function(config){
    var selector = config.selector;
    nar.util.assert_selector_present(selector);
    selection = $(selector);
    var series = [{label: 'Sample Concentration', data: config.data}];
    var plot = $.plot(selection, series, {
        xaxis: {
            mode: 'time',
            timeformat: "%Y/%m/%d",
            zero: true
        },
        yaxis: {
            axisLabel: "Temperature (C)",
            axisLabelUseCanvas: true,
            axisLabelFontSizePixels: 12,
            axisLabelFontFamily: "Verdana, Arial, Helvetica, Tahoma, sans-serif",
            axisLabelPadding: 5
        },
        series: {
            points: {
                radius: 3,
                show: true,
                fill: true
            },
        },
        legend: {
               position: "bottom"
        }
    });
    
    return plot;
};