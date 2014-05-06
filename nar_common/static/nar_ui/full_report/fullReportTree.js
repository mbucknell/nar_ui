var nar = nar || {};
nar.fullReport = nar.fullReport || {};
nar.fullReport.Tree = function(timeSeriesVisualizations){
    var self = this;
    var treeNodeIds = {}; //psuedo-set; keys are string TimeSeriesVisualization ids. Values are meaningless.
    var treeNodes = [];
    var mostRecentlyCreatedTimeSeriesVizId;
      
    self.createTreeNodeFromId = function(id){
        //@todo, adjust node based on id 
        return {
          type: id,
          id: id,
          text: id
        };
    };
    
    self.idDelim = '/';
    /**
     * Given a hierarchical id, return the ids of all parents
     * in order of nearest parent to farthest parent.
     * @param {string} childId
     * @returns {array<string>} - the ids of every parent
     */
    self.getParentIds = function(childId){
        //if present, remove trailing delim before recursion
        if(childId.last() === self.idDelim){
            var slashIndex = childId.length - 1; 
            childId = childId.slice(0, slashIndex);
        }
        
        var parentIds = [];
        
        var recursivelyGetParentIds = function(childId){
            //pull off last delim in the id and the text to the right of it
            var lastDelimIndex = childId.lastIndexOf(self.idDelim);
            //base case
            if(lastDelimIndex === -1){
                return;
            }
            else{
                var newChildId = childId.to(lastDelimIndex);
                //recursive case
                parentIds.push(newChildId); 
                recursivelyGetParentIds(newChildId);
            }
        };
        //In case the user specifies the prefix as the initial childId,
        //prevent infinite recursion.
        if(childId !== self.parentIdPrefix){
            recursivelyGetParentIds(childId);
        }
        return parentIds;
    };
    
    //construction
    timeSeriesVisualizations.each(function(timeSeriesVisualization){
        var id = timeSeriesVisualization.id;
        
        //add id to set of already created tree node ids
        treeNodeIds[id] = true;

        //create jstree node config
        mostRecentlyCreatedTreeNode = self.createTreeNodeFromId(id);
        //add to collection of node configs that jstree will instantiate
        treeNodes.push(mostRecentlyCreatedTreeNode);
        parentIds = self.getParentIds(id);
        parentIds.each(function(parentId){
           //set parent pointer
           mostRecentlyCreatedTreeNode.parent = parentId;
           
           //if parent has already been instantiated
           //then higher parents have already been created too
           if(Object.has(treeNodeIds, parentId)){
               //break loop
               return false;
           }
           else{
               treeNodeIds[parentId] = true;
               mostRecentlyCreatedTreeNode = self.createTreeNodeFromId(parentId);
               treeNodes.push(mostRecentlyCreatedTreeNode);
           }
        });
        //if the most recently created node lacks a parent
        if(!mostRecentlyCreatedTreeNode.parent){
            //then it was a root node, and jstree requires its parent attribute
            //be set to '#'
            mostRecentlyCreatedTreeNode.parent = '#';
        }
    });
    
    
    
    
    var graphToggleSelector = '#plotToggleTree';
    nar.util.assert_selector_present(graphToggleSelector);
    var graphToggleElt = $(graphToggleSelector);
    
    graphToggleElt.jstree({
        'plugins': ['checkbox', 'types', 'state'],
        'core' : {
            'data' : treeNodes
        }
    });
    
    var selectedTypePaths = {};//set to hold plot type paths      
    
    var addPlotContainer = function(node){
        
        
    };
    var removePlotContainer = function(node){
        
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
    
    var getTimeSeriesVisualizationsForNode = function(leafNode){
        var tsvId = leafNode.original.type;
        timeSeriesVisualization = nar.fullReport.TimeSeriesVisualizationRegistry.get(tsvId);
        return timeSeriesVisualization;
    };
    
    graphToggleElt.on("select_node.jstree", function (e, data) {
        var leafChildren = getAllLeafChildren(data.node);
        leafChildren = leafChildren.reverse();
        var timeSeriesVisualizations = leafChildren.map(getTimeSeriesVisualizationsForNode); 
        timeSeriesVisualizations.each(function(timeSeriesVisualization){
            timeSeriesVisualization.visualize();
        });
    });
    graphToggleElt.on("deselect_node.jstree", function (e, data) {
        var leafChildren = getAllLeafChildren(data.node);
        var timeSeriesVisualizations = leafChildren.map(getTimeSeriesVisualizationsForNode);
        timeSeriesVisualizations.each(function(timeSeriesVisualization){
            timeSeriesVisualization.remove();
        });
    });
};