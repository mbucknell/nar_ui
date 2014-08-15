var nar = nar || {};

(function() {
	nar.siteHelpInfo = {};
	
	nar.siteHelpInfoPromise = $.ajax({
		url : CONFIG.siteInfoUrl,
		type : 'GET',
		data : {
			site_id : PARAMS.siteId
		},
		success : function(data) {
			nar.siteHelpInfo = data;
		},
		error : function(jqXHR, textStatus, errorThrown) {
			throw Error('Unable to contact the site info URL service: ' & textStatus);
		}
	});
	
})();