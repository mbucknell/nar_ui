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
    if(!config.data || 0 === config.data.length){
        throw Error('config.data missing!')
    }
    $(document).ready(function() {
        $.plot(selection, data1, {
            xaxis: {
                tickSize: 5,
                tickLength: 0,
                tickDecimals: 0,
                axisLabel: "Minutes",
                axisLabelUseCanvas: true,
                axisLabelFontSizePixels: 12,
                axisLabelFontFamily: "Verdana, Arial, Helvetica, Tahoma, sans-serif",
                axisLabelPadding: 5
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
                labelBoxBorderColor: "none",
                position: "right"
            }
        });
    });
    
};