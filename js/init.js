	
	var UP = UP || {};	
	window.UP = UP;


	/*
	 * What the framework calls 'Views' are actually 'Controllers' 
	 * so we rename the module by creating an object Controller that inherits every property of View
	 */
	Backbone.Controller = Backbone.View.extend({});
 

	/* Constants */
	UP.constants = {
		ACTIVITY_SPEED   : 700,
		DISABLED_OPACITY : 0.5,
		FADE_SPEED       : 700,
		MAX_WEIGHT_VALUE : 5,
		SLIDE_SPEED      : 300,
		STAGES_SPEED     : 500,
		VALUE            : [ "strongly recommended", "neutral", "slightly recommended", "not recommended" ]
	};