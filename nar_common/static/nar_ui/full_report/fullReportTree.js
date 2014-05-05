var nar = nar || {};
nar.fullReport = nar.fullReport || {};
nar.fullReport.Tree = function(timeSeriesVisualizations){
    
    var numberOfPlots = 0;
    var get_or_fail = function(selector){
        var jqElt = $(selector);
        nar.util.assert_selector_present(jqElt);
        return jqElt;
    };
    
    var graphToggleSelector = '#plotToggleTree';
    var graphToggleElt = get_or_fail(graphToggleSelector);
    
    var allPlotsWrapperSelector = '#plotsWrapper';
    var allPlotsWrapper = get_or_fail(allPlotsWrapperSelector);
    
    var instructionsSelector = '#instructions';
    var instructionsElt = get_or_fail(instructionsSelector);
    
    
    graphToggleElt.jstree({
        'plugins': ['checkbox', 'types', 'state'],
        'core' : {
            'data' : data
        }
    });
    var plotContainerClass = 'data'; 
    var plotIdSuffix = '_' + plotContainerClass;
    var makePlotContainerIdFromJsTreeId = function(jstreeId){
        return jstreeId + plotIdSuffix;
    };
    
    var selectedTypePaths = {};//set to hold plot type paths      
    
    var addPlotContainer = function(node){
        var jstreeId = node.id;
        var textPath = getTextPathForNode(node);
        var typePath = getTypePathForNode(node);
        
        var text = textPath.join('/');
        //if no plots are currently visualized, but one has been
        //requested to be added.     
        if(0 === numberOfPlots){
            instructionsElt.addClass('hide');            
        }

        var id = makePlotContainerIdFromJsTreeId(jstreeId);
        var plotContainerMissing = $('#' + id).length === 0;
        
        if(plotContainerMissing){
            var plotContainer = $('<div/>', {
                id: id,
                class: plotContainerClass
            });
            allPlotsWrapper.prepend(plotContainer);
            
            var plotConstructor = getPlotConstructorForTypePath(typePath);
            var plotContent;
            if(plotConstructor){
                plotContent = plotConstructor(plotContainer);
                storePlotAtTypePath(plotContent, typePath);
            }
            else{
                plotContent = $('<h2/>', {
                    text:text
                });
                plotContainer.append(plotContent); 
            }
                        
            numberOfPlots++;
        }
    };
    var removePlotContainer = function(node){
        //remove plot container
        var jstreeId = node.id;
        var selector = '#' + makePlotContainerIdFromJsTreeId(jstreeId);
        var plotContainer = get_or_fail(selector);
        plotContainer.remove();
        
        //remove event handlers, free memory
        var typePath = getTypePathForNode(node);
        if(typePath){
            var plot = getPlotForTypePath(typePath);
            if(plot){
                plot.shutdown();
            }
        }

        
        //update counter
        numberOfPlots--;
        
        var noPlotsRemain = 0 === numberOfPlots; 
        if(noPlotsRemain){
            instructionsElt.removeClass('hide');                
        }
    };
    
    var plotTree = $(graphToggleElt).jstree();
    var getNode = function(selectedItem){
        return plotTree.get_node(selectedItem);
    };
    var getParents = function(node){
        var parentNodes = [];
        if(node.parents.length){
            node.parents.each(function(parentId){
                //the absolute root of the tree is '#'. Ignore this case. 
                if('#' !== parentId){
                    parentNode = getNode(parentId);
                    parentNodes.push(parentNode);
                }
            });
        }
        return parentNodes;
    };
    
    
    var getAllLeafChildren = function(node){
        var leafChildren = [];
        var recursivelyGetAllLeafChildren = function(nodeRef){
            //recursive case
            var node = getNode(nodeRef);
            if(node.children.length){
                node.children.each(recursivelyGetAllLeafChildren);
            }
            //base case
            else {
                leafChildren.add(node);
            }
        };
        recursivelyGetAllLeafChildren(node, leafChildren);
        return leafChildren;
    };
    
    var getTextPathForNode = function(node){
        var parents = getParents(node);
        var parentTexts = parents.map(function(node){return node.text;});
        parentTexts = parentTexts.reverse();
        var textPath = parentTexts.add(node.text);
        return textPath;
    };
    
    graphToggleElt.on("select_node.jstree", function (e, data) {
        var leafChildren = getAllLeafChildren(data.node);
        leafChildren = leafChildren.reverse();
        leafChildren.each(function(leafNode){
            addPlotContainer(leafNode);
        });
    });
    graphToggleElt.on("deselect_node.jstree", function (e, data) {
        var leafChildren = getAllLeafChildren(data.node);
        leafChildren.each(function(leafNode){
            removePlotContainer(leafNode);
        });
    });
};