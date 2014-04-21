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
	
	var addMockPlotContainer = function(jstreeId){
		var plotContainer = $('<div/>', {
			id: makePlotContainerIdFromJsTreeId(jstreeId),
			class: plotContainerClass,
			
		});
		var plotContent = $('<h2>'+jstreeId+'</h2>');
		plotContainer.append(plotContent);	
		
		allPlotsWrapper.append(plotContainer);
	};
	var removeMockPlotContainer = function(jstreeId){
		var selector = makePlotContainerIdFromJsTreeId(jstreeId);
		$('#' + selector).remove();
	};
	
	var plotTree = $(graphToggleJqElt).jstree();
	var getNode = function(selectedItem){
		return plotTree.get_node(selectedItem);
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
			addMockPlotContainer(leafNode.id);
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