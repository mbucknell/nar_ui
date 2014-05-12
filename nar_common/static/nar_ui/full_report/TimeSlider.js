//@requires nar.util, nar.fullReport.TimeSeriesRegistry
var nar = nar || {};
(function(){
nar.fullReport = nar.fullReport || {};
nar.fullReport.TimeSlider = function(selector){
    nar.util.assert_selector_present(selector);
    
    var slider = $(selector).slider({
        range: true,
        disabled: true,
        slide: function(event, ui){
            console.dir(slider);
            debugger;
        }
    });
    return slider;
};

}());