$(document).ready(function(){
		
	var get_or_fail = function(selector){
		var jqElt = $(selector);
		if(!jqElt.length){
			throw Error('Could not find selector "' + selector + '"');
		}
		return jqElt;
	};
	
	var treeSelector = '#plotToggleTree';
	var graphToggleJqElt = get_or_fail(treeSelector);
	
	var allPlotsWrapperSelector = '#plotsWrapper';
	var allPlotsWrapper = get_or_fail(allPlotsWrapperSelector);
	
	var instructionsSelector = '#instructions';
	var instructionsJqElt = get_or_fail(instructionsSelector);
	
	var exampleChildMostItems = [
         {
        	 text:'Concentrations',
        	 children: [
        	     'Mean Annual',
        	     'Flow-weighted',
        	     'Sample'
            ]
		 },
		 'Loads'
    ];
	var secondTierWaterQualityNode = function(name){
		return {
     	   'text' : name,
    	   'children' : Object.clone(exampleChildMostItems, true)
       };
	};
	var secondTierNames = [
       'Total Nitrogen',
       'Nitrate',
       'Total Phosphorous',
       'Suspended Sediment',
       'Pesticides',
       'Ecology'
    ];
	var secondTierWaterQualityNodes = secondTierNames.map(secondTierWaterQualityNode);
	
	graphToggleJqElt.jstree({
		'plugins': ['wholerow', 'checkbox'],
		'core' : {
		    'data' : [
		       {
		         'text' : 'Water Quality',
		         'state': {
		        	 'opened' : true
		         },
		         'children' : secondTierWaterQualityNodes
		      },
		      {
		    	  'text' : 'Streamflow',
		          'state': {
		        	 'opened' : true
			      },
	    		  'children' : [
		                'Real-time',
		                'Annual',
		                'Hydrograph',
		                'Flow duration'
	               ]
		      }
		    ]
		}
	});
	var plotContainerClass = 'data'; 
	var plotIdSuffix = '_' + plotContainerClass;
	var makePlotContainerIdFromJsTreeId = function(jstreeId){
		return jstreeId + plotIdSuffix;
	}
	
	var addMockPlotContainer = function(jstreeId, text){
		instructionsJqElt.addClass('hide');
		var plotContainer = $('<div/>', {
			id: makePlotContainerIdFromJsTreeId(jstreeId),
			class: plotContainerClass,
			
		});
		var plotContent = $('<h2>'+text+'</h2>');
		plotContainer.append(plotContent);	
		
		allPlotsWrapper.append(plotContainer);
	};
	var removeMockPlotContainer = function(jstreeId){
		var selector = makePlotContainerIdFromJsTreeId(jstreeId);
		$('#' + selector).remove();
		var plotsSelector = allPlotsWrapperSelector + ' .' + plotContainerClass;
		var noPlotsRemain =!$(plotsSelector).length 
		if(noPlotsRemain){
			instructionsJqElt.removeClass('hide');				
		}
	};
	
	var plotTree = $(graphToggleJqElt).jstree();
	var getNode = function(selectedItem){
		return plotTree.get_node(selectedItem);
	};
	var getParents = function(node){
		var parentNodes = [];
		if(node.parents.length){
			node.parents.each(function(parentId){
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
		var getAllLeafChildrenImplementation = function(nodeRef){
			//recursive case
			var node = getNode(nodeRef);
			if(node.children.length){
				node.children.each(getAllLeafChildrenImplementation);
			}
			//base case
			else {
				leafChildren.add(node);
			}
		};
		getAllLeafChildrenImplementation(node, leafChildren);
		return leafChildren;
	};
	
	graphToggleJqElt.on("select_node.jstree", function (e, data) {
		var leafChildren = getAllLeafChildren(data.node);
		leafChildren.each(function(leafNode){
			var parents = getParents(leafNode);
			var parentTexts = parents.map(function(node){return node.text;});
			parentTexts.reverse();
			var path = parentTexts.add(leafNode.text).join('/'); 
			addMockPlotContainer(leafNode.id, path);
		});
		console.dir(leafChildren);
	});
	graphToggleJqElt.on("deselect_node.jstree", function (e, data) {
		var leafChildren = getAllLeafChildren(data.node);
		console.dir(leafChildren);
		leafChildren.each(function(leafNode){
			removeMockPlotContainer(leafNode.id);
		});
	});
	
});