var nar = nar || {};

(function() {
	nar.site_help_info = {};
	
	nar.site_help_info_promise = $.ajax({
		url : CONFIG.siteInfoUrl,
		type : 'GET',
		data : {
			site_id : PARAMS.siteId
		},
		success : function(data) {
			nar.site_help_info = data;
		},
		error : function(jqXHR, textStatus, errorThrown) {
			throw Error('Unable to contact the site info URL service: ' & textStatus);
		}
	});
	
})();