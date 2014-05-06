//@requires nar.fullReport.TimeSeriesCollection
var nar = nar || {};
nar.fullReport = nar.fullReport || {};
(function(){
/**
 * @typedef nar.fullReport.TimeSeriesVisualizationConfig
 * @property {string} id
 * @property {Function} plotConstructor
 * @property {nar.fullReport.TimeSeriesCollection} timeSeriesCollection
 */

/**
 * @class
 * @param {nar.fullReport.TimeSeriesVisualizationConfig} config
 */
nar.fullReport.TimeSeriesVisualization = function(config){
    var self = this;
    self.id = config.id;
    self.timeSeriesCollection = config.timeSeriesCollection;
    self.plotConstructor = config.plotConstructor;
    self.plot = undefined;
    self.visualize = function(){
        //if no plots are currently visualized, but one has been
        //requested to be added.
        if(0 === numberOfPlots){
            instructionsElt.addClass('hide');            
        }
        
        var plotContainerId = makePlotContainerId(self.id);
        var plotContainer = getPlotContainer(plotContainerId);
        var plotContainerMissing = plotContainer.length === 0;
        
        if(plotContainerMissing){
            plotContainer = $('<div/>', {
                id: plotContainerId,
                class: plotContainerClass
            });
            allPlotsWrapper.prepend(plotContainer);
            
            
            //@todo: implement this:
            //var plotConstructor = getPlotConstructorForTypePath(typePath);
            var plotConstructor;
            var plotContent;
            if(plotConstructor){
                plotContent = plotConstructor(plotContainer);
                storePlotAtTypePath(plotContent, typePath);
            }
            else{
                plotContent = $('<h2/>', {
                    text:self.id
                });
                plotContainer.append(plotContent); 
            }
            numberOfPlots++;
        }
    };
    self.destroy = function(){
        
    };
};

// private static properties:
var numberOfPlots = 0;
var plotContainerClass = 'data'; 
var plotIdSuffix = '_' + plotContainerClass;


// private static methods:
var get_or_fail = function(selector){
    var jqElt = $(selector);
    nar.util.assert_selector_present(jqElt);
    return jqElt;
};

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

// public static methods:

nar.fullReport.TimeSeriesVisualization.fromId = function(id){
    
    //@todo: select plot constructor based on id
    
    return new nar.fullReport.TimeSeriesVisualization({
        id: id,
        plotConstructor: function(){
            throw Error('not implemented yet');
        },
        timeSeriesCollection: new nar.fullReport.TimeSeriesCollection()
    }); 
};

//static initialization
var instructionsSelector = '#instructions';
var instructionsElt;

var allPlotsWrapperSelector = '#plotsWrapper';
var allPlotsWrapper;

$(document).ready(function(){
    instructionsElt = get_or_fail(instructionsSelector);
    allPlotsWrapper = get_or_fail(allPlotsWrapperSelector);
});

}());