
(function($, window, document) {

	var UsabilityPlanner = (function() {
		
	
		// Private API
		var cacheElements = (function() {
			var methods = $('.method');
		});
		
		var bindEvents = (function() {
		
		});
				
		
		// Public API
		var API = {};
		
		API.init = (function() {
			this.cacheElements();
			this.bindEvents();
		});
		
		return API;
	});
	
	/* Initializing application... */
	UsabilityPlanner().init();
	
	
})(jQuery, window, document);
