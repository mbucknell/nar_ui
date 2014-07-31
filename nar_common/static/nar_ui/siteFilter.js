var nar = nar || {};
(function(){
	var siteFilterName = "siteFilter";
	var getSelectedTypes = function() {
		selectedTypes = $.makeArray($("input[name='" + siteFilterName + "']:checked").map(function(){return $(this).val()}));
		return selectedTypes;
	};
	var makeTd = function(content) {
		var $td = $('<td />').html(content);
		return $td;
	};
	nar.siteFilter = {
		Site : function(id, name, type) {
			this.id = id;
			this.name = name;
			this.type = type;
		},
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
		},
		buildRow : function(site) {
			var $tableRow = $('<tr />').addClass('clickableRow')
				.attr('href', CONFIG.baseUrl + 'site/' + site.id + '/summary-report');
			$tableRow.append(makeTd(site.id))
				.append(makeTd(site.name))
				.append(makeTd(site.type));
			$tableRow.click(function() {
	            window.document.location = $(this).attr("href");
			});
			return $tableRow;
		},
		onEachSite : function(doThis) {
			var protocol = nar.commons.mapUtils.createSitesFeatureProtocol();
			var filter = null;//new OpenLayers.Filter({}); // will add cql filter later
			nar.commons.mapUtils.getData(protocol, filter, function(response) {
				if (response.success()) {
					response.features.each(function(feature) {
						var site = new nar.siteFilter.Site(feature.data.staid, feature.data.staname, feature.data.c3type);
						doThis(site);
					});
				}
			});
		},
		loadSitesToDom : function() {
			var $table = $('.site_table');
			nar.siteFilter.onEachSite(function(site) {
				$table.append(nar.siteFilter.buildRow(site));
			});
		}
	};
}());