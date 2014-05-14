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
    var selected = $(selector); 
    var slider = selected.slider({
        range: true,
        disabled: true
    }); 
    var labelsClass= 'slider_label_container';
    var labelsSelector = '.' + labelsClass; 
    var labelClass = 'slider_label';
    var labelSelector = '.' + labelClass;
    
    var labelsElt = $('<div></div>', {
        class: labelsClass
    });
    
    selected.append(labelsElt);
    slider.updateLabels = function(){
        var labelsContainer = $(labelsSelector);
        labelsContainer.remove(labelSelector);
        
        var visibleMin = slider.slider('values', 0);
        var visibleMax = slider.slider('values', 1);
        var possibleMin = slider.slider('option', 'min');
        var possibleMax = slider.slider('option', 'max');
        
        
        var possibleRange = Number.range(possibleMin, possibleMax);
        var possibleDifference = possibleMax - possibleMin;
        var stepTotal = 10;
        var stepIncrement = possibleDifference / stepTotal;
        var offset = possibleMin;
        for(var i = 0; i< possibleDifference; i+=stepIncrement){
            
            var position = (i/stepIncrement)*100 + '%'; 
            var label = $('<label>a</label>',{
                    
            }).css('left', position);
            labelsContainer.append(label);   
        }
        
        
    };
    
    return slider;
};

}());