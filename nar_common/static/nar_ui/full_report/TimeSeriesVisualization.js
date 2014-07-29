//@requires nar.fullReport.TimeSeriesCollection
var nar = nar || {};
nar.fullReport = nar.fullReport || {};
(function(){
/**
 * @typedef nar.fullReport.TimeSeriesVisualizationConfig
 * @property {string} id
 * @property {Function} plotter
 * @property {nar.fullReport.TimeSeriesCollection} timeSeriesCollection
 * @property {jQuery} instructionsElt
 * @property {jQuery} allPlotsWrapperElt
 */

/**
 * @class
 * @param {nar.fullReport.TimeSeriesVisualizationConfig} config
 */
nar.fullReport.TimeSeriesVisualization = function(config){
    var self = this;
    self.id = config.id;
    self.instructionsElt = config.instructionsElt;
    self.allPlotsWrapperElt = config.allPlotsWrapperElt;
    self.plotter = config.plotter;

    self.getComponentsOfId = function(){
        //delegate to static method
        return nar.fullReport.TimeSeriesVisualization.getComponentsOfId(self.id);  
    };
    self.timeSeriesCollection = config.timeSeriesCollection;
    
    self.plot = undefined;
    self.plotContainer = undefined;
    /**
     * asynchronously retrieves and plots all of the time series in the 
     * `this.timeSeriesCollection` using `this.plotter`
     * @returns {jQuery.promise}
     */
    self.visualize = function(){
        //if no plots are currently visualized, but one has been
        //requested to be added.
        if(0 === numberOfPlots){
            self.instructionsElt.addClass(hiddenClass);            
        }
        
        var plotContainerId = makePlotContainerId(self.id);
        var plotContainer = getPlotContainer(plotContainerId);
        var plotContainerMissing = plotContainer.length === 0;
        var vizDeferred = $.Deferred();
        var vizPromise = vizDeferred.promise(); 
        
        
        if(plotContainerMissing){
            plotContainer = $('<div/>', {
                id: plotContainerId,
                class: plotContainerClass
            });
            self.allPlotsWrapperElt.prepend(plotContainer);
            self.plotContainer = plotContainer;
            var retrievalPromises = self.timeSeriesCollection.retrieveData();
            //after all retrieval promises have been resolved
            $.when.apply(null, retrievalPromises).then(                
                function(){
                    var plotter = nar.fullReport.TimeSeriesVisualization.getPlotterById(self.id);
                    var plotContent;
                    if(plotter){
                        self.plot = plotter(self);
                        plotContent = self.plot;
                        //storePlotAtTypePath(plotContent, typePath);
                    }
                    else{
                        plotContent = $('<h2/>', {
                            text:self.id
                        });
                        plotContainer.append(plotContent); 
                    }
                    numberOfPlots++;
                    vizDeferred.resolve(self);
                },
                function(){
                    vizDeferred.reject(self);
                    alert('data retrieval failed');
                    throw Error();
                }
            );
        }
        else{
            vizDeferred.resolve();
        }
        return vizPromise;
    };
    self.remove = function(){
        var plotContainer = self.plotContainer;
        plotContainer.remove();
        var plot = self.plot; 
        if(plot){
            plot.shutdown();
        }

        //update counter
        numberOfPlots--;
        
        var noPlotsRemain = 0 === numberOfPlots; 
        if(noPlotsRemain){
            self.instructionsElt.removeClass(hiddenClass);                
        }
    };
};

// private static properties:
var numberOfPlots = 0;
var plotContainerClass = 'full_report_plot'; 
var plotIdSuffix = '_' + plotContainerClass;
var hiddenClass = 'hide';

// private static methods:

/**
 * Given a viz id, make a selector for a plot container
 * @param {string} TimeSeriesVisualization.id
 * @returns {string} id for a plot
 */
var makePlotContainerId = function(vizId){
    return vizId+plotIdSuffix;
};
/**
 * Given a plot container id (NOT a viz ID), safely look up
 * the plot container. See also: makePlotContainerId()
 * @param {string} plotContainerId
 * @return {jQuery} 
 */
var getPlotContainer = function(plotContainerId){
    //use this selector syntax to enable id attributes with slashes in them
    var selector = "div[id*='" + plotContainerId + "']";
    var plotContainer = $(selector);
    return plotContainer;
};

// public static properties:

nar.fullReport.TimeSeriesVisualization.serverToClientConstituentIdMap = {
    'nh3': 'nitrogen',
    'no23': 'nitrate',
    'op':'phosphorus',
    'si':'sediment',
    'ssc':'sediment',
    'tkn': 'nitrogen',
    'tp':'phosphorus'
};

/**
 * @param {string} id
 * @returns {Object} a simple map of component name to value 
 */
nar.fullReport.TimeSeriesVisualization.getComponentsOfId = function(id){
    var splitId = id.split('/');
    
    var components = {};
    
    var serverConstituentId = splitId[0];
    var clientConstituentId = nar.fullReport.TimeSeriesVisualization.serverToClientConstituentIdMap[serverConstituentId.toLowerCase()];
    components.constituent = clientConstituentId;
    potential_category = splitId[1];
    split_potential_category = potential_category.split('_');
    if(2 === split_potential_category.length){
        components.category = split_potential_category[1];
        components.subcategory = potential_category;
    }
    else{
        components.category = potential_category;
    }
    
    return components;
};

/**
 * @param {string} id - a TimeSeriesVisualization id
 * @returns {function} a plot constructor accepting two arguments: 
 *  the element to insert the plot into,
 *  the data to plot
 */
nar.fullReport.TimeSeriesVisualization.getPlotterById = function(id){
    var plotter;
    var components = nar.fullReport.TimeSeriesVisualization.getComponentsOfId(id);
    
    if (components.category === 'discrete'){
        plotter = nar.fullReport.SampleConcentrationPlot; 
    }
    else if(components.category === 'load'){
        plotter = nar.fullReport.LoadPlot;
    }
    else{
        var idToPlotConstructor = {
                //empty for now 
        };
        plotter = idToPlotConstructor[id];
    }
    
    return plotter;
};
}());