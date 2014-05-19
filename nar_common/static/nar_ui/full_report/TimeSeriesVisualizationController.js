//@requires nar.fullReport.TimeSeriesVisualization, nar.fullReport.TimeSlider
var nar = nar || {};

(function(){

nar.fullReport = nar.fullReport || {};
/**
 * 
 * This class handles updating the time slider when 
 * time series are added or removed from view. 
 * 
 * @class
 * @param {nar.fullReport.TimeSlider}
 */
nar.fullReport.TimeSeriesVisualizationController = function(){
    var self = this;
    var timeSlider = nar.fullReport.TimeSlider("#timeSlider");
    timeSlider.on('slidechange', function(event, ui){
        var timeRange = new nar.fullReport.TimeRange(
                ui.values[0],
                ui.values[1]
        );
        
        self.setCurrentlyVisibleTimeRange(timeRange);
    });
    self.timeSlider = timeSlider;
    

    //force everyone to use the accessors and getters, (including class members)
    //by hiding the inner variable using closures, function-scoping
    (function(){
        var currentlyVisibleTimeRange;
        
        /**
         * @returns {nar.fullReport.TimeRange|undefined} a copy of the currently visible time range,
         * or undefined if no range is currently visible
         */
        self.getCurrentlyVisibleTimeRange = function(){
            var timeRange = undefined;
            if(currentlyVisibleTimeRange){
                timeRange = currentlyVisibleTimeRange.clone();
            }
            return timeRange;
        };
        /**
         * Sets the currently visible time range to a copy of the time range passed in
         * @param {nar.fullReport.TimeRange} timeRange
         * 
         */
        self.setCurrentlyVisibleTimeRange = function(timeRange){
            if(undefined === timeRange){
                currentlyVisibleTimeRange = undefined;
            }
            //prevent cyclic event triggering, expensive updates
            else if(!timeRange.equals(currentlyVisibleTimeRange)){
                currentlyVisibleTimeRange = timeRange.clone();
                
                Object.values(self.currentlyVisibleTimeSeriesVisualizations, function(tsv){
                    zoomTsvToTimeRange(tsv, currentlyVisibleTimeRange);
                });
                self.timeSlider.slider('option', 'values', [currentlyVisibleTimeRange.startTime, currentlyVisibleTimeRange.endTime]);
            }
        };
    }());
    var zoomTsvToTimeRange = function(tsv, timeRange){
        var plot = tsv.plot;

        //plot may not be defined yet. In that case, skip it --
        //zooming on that plot will be handled by a subsequent 
        //asynchronous call
        if(plot){
            var options = plot.getOptions();
            options.xaxes.each(function(axis){
                axis.min = timeRange.startTime;
                axis.max = timeRange.endTime;
            });
            plot.setupGrid();
            plot.draw();
        }
    };
    (function(){
       var possibleTimeRange;
       /**
        * @returns {nar.fullReport.TimeRange|undefined} a copy of the possible time range,
        * or undefined
        */
       self.getPossibleTimeRange = function(){
           var timeRange = undefined;
           if(possibleTimeRange){
               timeRange = possibleTimeRange.clone();
           }
           return timeRange;
       };
       /**
        * Sets the possible time range to a copy of the time range passed in
        * @param {nar.fullReport.TimeRange} timeRange
        * 
        */
       self.setPossibleTimeRange = function(timeRange){
           if(undefined === timeRange){
               possibleTimeRange = undefined;
               self.timeSlider.slider('option', 'disabled', true);
           }
           else{
               possibleTimeRange = timeRange.clone();
               self.timeSlider.slider('option', 'disabled', false);
               self.timeSlider.slider('option', 'min', possibleTimeRange.startTime);
               self.timeSlider.slider('option', 'max', possibleTimeRange.endTime);
               var visibleTimeRange = self.getCurrentlyVisibleTimeRange();
               //if visible time range has not yet been set 
               if(undefined === visibleTimeRange){
                   self.setCurrentlyVisibleTimeRange(possibleTimeRange);
               }
               else {
                   //the possible time range could have shrunk so that it is smaller
                   //than the visible time range. In this case, restrict the visible 
                   //time range to bounds the new possible time range
                   var clampedTimeRange = new nar.fullReport.TimeRange(
                       Math.max(possibleTimeRange.startTime, visibleTimeRange.startTime),
                       Math.min(possibleTimeRange.endTime, visibleTimeRange.endTime)
                   );
                   self.setCurrentlyVisibleTimeRange(clampedTimeRange);
               }
               timeSlider.updateLabels();
           }
       };
    }());
    
    /*
     * Map<String, TimeSeriesVisualizations>
     */
    self.currentlyVisibleTimeSeriesVisualizations = {};
    /**
     * @param {array<TimeSeriesVisualization>} tsvsToVisualize 
     */
    self.visualizeAll = function(tsvsToVisualize){
        var incomingTimeRanges = tsvsToVisualize.map(function(tsv){return tsv.timeSeriesCollection.getTimeRange();});
        var timeRangesToSearch;
        var possibleTimeRange = self.getPossibleTimeRange();
        if(possibleTimeRange){
            timeRangesToSearch = incomingTimeRanges.concat(possibleTimeRange);
        }
        else{
            timeRangesToSearch = incomingTimeRanges;
        }
        var aggregateTimeRange = nar.fullReport.TimeRange.ofAll(timeRangesToSearch);
        var vizPromises = tsvsToVisualize.map(function(tsv){
            self.currentlyVisibleTimeSeriesVisualizations[tsv.id] = tsv;
            var promise = tsv.visualize();
            return promise;
        });
        $.when.apply(null, vizPromises).done(function(){
            self.setPossibleTimeRange(aggregateTimeRange);//might adjust currently visible range
            //now zoom recently added plots to the currently visible range
            var recentlyVisualizedTimeSeriesVisualizations = Array.create(arguments);
            var currentTimeRange = self.getCurrentlyVisibleTimeRange();
            recentlyVisualizedTimeSeriesVisualizations.each(function(tsv){
                zoomTsvToTimeRange(tsv, currentTimeRange);
            });
        });
    };
    
    /**
     * @param {array<TimeSeriesVisualization>} tsvsToVisualize 
     */
    self.removeAll = function(tsvsToRemove){
        tsvsToRemove.each(function(tsv){
            tsv.remove();
            delete self.currentlyVisibleTimeSeriesVisualizations[tsv.id];
        });
        
        var remainingTimeRanges = [];
        Object.values(
            self.currentlyVisibleTimeSeriesVisualizations, 
            function(tsv){
                remainingTimeRanges.push(tsv.timeSeriesCollection.getTimeRange());
            }
        );
        //the only case where we modify the user's selection on removal is if we have .removed() all
        //time series visualizations -- in that case we undefine the currently visible time range
        if(remainingTimeRanges.isEmpty()){
            self.setCurrentlyVisibleTimeRange(undefined);
        }
        
        var aggregateTimeRange = nar.fullReport.TimeRange.ofAll(remainingTimeRanges);
        self.setPossibleTimeRange(aggregateTimeRange);

    };   
};

}());