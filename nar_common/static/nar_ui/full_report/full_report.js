$(document).ready(function(){

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
    
    var nonLeafNode = function(node){
        return Object.merge(node, {
            icon: 'glyphicon glyphicon-folder-open'
        }, true);
    };
    
    var leafNode = function(node){
        return Object.merge(node, {
            icon: 'glyphicon glyphicon-asterisk'
        }, true);
    };
    var leafNodeFromText = function(text){
        var node = {
                text: text
        };
        return leafNode(node);
    };
    var waterQualityConstituentChildren = [
         nonLeafNode({
             text:'Concentrations',
             'type' : 'concentrations',
             children: [
                {
                    'text': 'Mean Annual',
                    'type' : 'meanAnnual'
                },
                {
                    'text': 'Flow-weighted',
                    'type' : 'flowWeighted'         
                },
                {
                    'text': 'Sample',
                    'type' : 'sample'
                }
            ].map(leafNode)
         }),
         leafNode({text: 'Loads', type: 'loads'})
    ];
    var nameIndex = 0;
    var typeIndex = 1;
    var waterQualityConstituentNode = function(nameTypePair){
        var name = nameTypePair[nameIndex];
        var type = nameTypePair[typeIndex];
        
        return nonLeafNode({
            'text' : name,
            'children' : Object.clone(waterQualityConstituentChildren, true),
            'type' : type
       });
    };
    var constituentNames = [
       ['Total Nitrogen', 'totalNitrogen'],
       ['Nitrate', 'nitrate'],
       ['Total Phosphorous', 'totalPhosphorous'],
       ['Suspended Sediment', 'suspendedSediment'],
       ['Pesticides', 'pesticides'],
       ['Ecology', 'ecology']
    ];
    var waterQualityConstituentNodes = constituentNames.map(waterQualityConstituentNode);
    
    graphToggleElt.jstree({
        'plugins': ['checkbox', 'types', 'state'],
        'core' : {
            'data' : [
               {
                 'text' : 'Water Quality',
                 'state': {
                     'opened' : true
                 },
                 'type' : 'waterQuality',
                 'children' : waterQualityConstituentNodes
              },
              {
                  'text' : 'Streamflow',
                  'type' : 'streamflow',
                  'state': {
                     'opened' : true
                  },
                  'children' : [
                        'Real-time',
                        'Annual',
                        'Hydrograph',
                        'Flow duration'
                   ].map(leafNodeFromText)
              }
            ].map(nonLeafNode)
        }
    });
    var plotContainerClass = 'data'; 
    var plotIdSuffix = '_' + plotContainerClass;
    var makePlotContainerIdFromJsTreeId = function(jstreeId){
        return jstreeId + plotIdSuffix;
    };
    
    var selectedTypePaths = {};//set to hold plot type paths
        
    var typeToPlotConstructor = {
            'waterQuality': {
                'totalNitrogen' : {
                    'concentrations':
                        {
                            'sample': function(plotContainer){
                                var data = mockData(2000, 2010, 0, 100);
                                
                                var plot = nar.fullReport.SampleConcentrationPlot({
                                    data : data,
                                    selector: plotContainer
                                });
                                
                                return plot;
                            }
                        }
                }
            }
    };
    
    var typeToPlot = {};
    
    var putValueAtTypePathIntoObject = function(value, typePath, object){
        
        var recursivelyPutTypePathIntoObject = function(typePath, object, typePathIndex){
            //create property in object if it does not already exist
            var propertyName = typePath[typePathIndex];
            if(!Object.has(object, propertyName)){
                object[propertyName] = {};
            }
            
            //base case
            if(typePath.length -1 === typePathIndex){
                //overwrite empty object created above with the user-supplied value
                object[propertyName] = value;
            }
            else{
                recursivelyPutTypePathIntoObject(typePath, object[propertyName], typePathIndex + 1);
            }
        };
        recursivelyPutTypePathIntoObject(typePath, object, 0);
    };
    
    var storePlotAtTypePath = function(plot, typePath){
        putValueAtTypePathIntoObject(plot, typePath, typeToPlot);
    };
    
    var getValueForTypePathFromObject = function(typePath, object){
        if(!typePath || 0 === typePath.length){
            return;
        }
        var nextValue;
        var keyIndex = 0;
        var objectToExamine = object;
        
        while(keyIndex < typePath.length){
            var currentKey = typePath[keyIndex];
            nextValue = objectToExamine[currentKey];
            if(undefined === nextValue){
                return;
            }
            objectToExamine = nextValue;
            keyIndex++;
        }
        return nextValue;
    };
    var getPlotConstructorForTypePath = function(typePath){
        return getValueForTypePathFromObject(typePath, typeToPlotConstructor);
    };
    
    var getPlotForTypePath = function(typePath){
        return getValueForTypePathFromObject(typePath, typeToPlot);
    };
    
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
    var getTypePathForNode = function(node){
        var parents = getParents(node);
        var typePath;
        if(node.original.type){
            var parentTypes = parents.map(function(node){return node.original.type;});
            parentTypes = parentTypes.reverse();
            //leave this variable as an array
            typePath = parentTypes.add(node.original.type);
        }
        return typePath;
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
    
});
