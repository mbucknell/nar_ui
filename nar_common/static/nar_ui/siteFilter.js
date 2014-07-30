var nar = nar || {};
(function(){
	var siteFilterName = "siteFilter";
	var getSelectedTypes = function() {
		selectedTypes = $.makeArray($("input[name='" + siteFilterName + "']:checked").map(function(){return $(this).val()}));
		return selectedTypes;
	};
	nar.siteFilter = {
		writeCQLFilter : function() {
			var selectedTypes = getSelectedTypes();
            var cqlFilter = "c3type IS NOT NULL";
            if (selectedTypes && 0 < selectedTypes.length) {
                cqlFilter = "c3type IN ('" 
                	+ selectedTypes.join("','")
                	+ "')";
            }
            return cqlFilter;
		},
		addChangeHandler : function(fn) {
			$("input[name='" + siteFilterName + "']").change(fn);
		}
	};
}());