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
    slider = slider.slider('float', {
        formatLabel: function(timeStamp){
            return Date.create(timeStamp).format('{yyyy}');
        }
    });
    
    var labelsClass= 'slider_label_container';
    var labelsSelector = '.' + labelsClass; 
    var labelClass = 'slider_label';
    var labelSelector = '.' + labelClass;
    
    var labelsContainer = $('<div></div>', {
        class: labelsClass
    });
    var labels = [];
    selected.append(labelsContainer);
    slider.updateLabels = function(){
        labels.each(function(label){label.remove();});
        labels = [];
        var visibleMin = slider.slider('values', 0);
        var visibleMax = slider.slider('values', 1);
        var possibleMin = slider.slider('option', 'min');
        var possibleMax = slider.slider('option', 'max');
        
        
        var possibleRange = Number.range(possibleMin, possibleMax);
        var possibleDifference = possibleMax - possibleMin;
        var stepTotal = 10;
        var stepIncrement = possibleDifference / stepTotal;
        var offset = possibleMin;
        var percentRange = Number.range(0, 100);
        
        percentRange.every(10, function(percent){
            var year = Date.create(((percent / 100)*possibleDifference) + possibleMin).format('{yyyy}');
            var label = $('<label>' + year + '</label>',{
            });
            label.css('left', percent + '%');
            label.addClass(labelClass);
            labels.push(label);
        });
        labelsContainer.append(labels);
        
        
    };
    
    return slider;
};

}());