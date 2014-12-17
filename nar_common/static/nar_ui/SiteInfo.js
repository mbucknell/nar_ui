var nar = nar || {};

nar.loadSiteHelpInfo = function(url) {
	nar.siteHelpInfo = {};
	
	nar.siteHelpInfoPromise = $.ajax({
		url : url,
		type : 'GET',
		data : {
			site_id : PARAMS.siteId
		},
		success : function(data) {
			nar.siteHelpInfo = data;
		},
		error : function(jqXHR, textStatus, errorThrown) {
			throw Error('Unable to contact the site info service: ' + textStatus);
		}
	});
	
};