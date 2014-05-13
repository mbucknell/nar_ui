//@requires nar.util, nar.fullReport.TimeSeriesRegistry
var nar = nar || {};
(function(){
nar.fullReport = nar.fullReport || {};
nar.fullReport.TimeSlider = function(selector){
    nar.util.assert_selector_present(selector);

    //Do not initialize any event handlers here;
    //event handling is added when you
    //pass a TimeSlider instance to the
    //TimeSeriesVisualizationController constructor
    
    var slider = $(selector).slider({
        range: true,
        disabled: true
    }); 
    return slider;
};

}());