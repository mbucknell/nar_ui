var nar = nar || {};
(function() {
	nar.definitions = {};
	
	nar.definitions_promise = $.ajax({
		url : CONFIG.definitionsUrl,
		type : 'GET',
		success : function(data) {
			nar.definitions = data;
		},
		error : function(jqXHR, textStatus, errorThrown) {
			throw Error('Unable to contact the definitions URL service: ' & textStatus);
		}
	});
})();