
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
		METHOD_HEIGHT    : 25,
		PHP_DOWNLOAD     : 'php/download.php',
		PHP_UPLOAD       : 'php/upload.php',
		SLIDE_SPEED      : 300,
		SLIDER_VALUE     : 1,
		STAGES_SPEED     : 500,
		VALUE            : [ "strongly recommended", "recommended", 
							 "slightly recommended", "neutral", "not recommended" ],
		XML              : 'xml/stages.xml'
	};