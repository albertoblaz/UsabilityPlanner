
	var UP = UP || {};	
	window.UP = UP;


	
	/*
	 * What the framework calls 'Views' are actually 'Controllers' 
	 * so we rename the module by creating an object Controller that inherits every property of View
	 */
	Backbone.Controller = Backbone.View.extend({});


		
	function assets(pathfile) {
		var ASSETS_FOLDER = "../assets/";
		return ASSETS_FOLDER + pathfile;
	};


	/**
	 * @module UP
	 * @submodule Constants
	 */	
	UP.constants = {

	
		/**
		 * @property ACTIVITY_SPEED
		 * @static
		 * @final
		 * @type number
		 */
		ACTIVITY_SPEED   : 700,
		
		
		/**
		 * @property DISABLED_OPACITY
		 * @static
		 * @final
		 * @type number
		 */
		DISABLED_OPACITY : 0.5,
		
		
		/**
		 * @property FADE_SPEED
		 * @static
		 * @final
		 * @type number
		 */
		FADE_SPEED       : 700,
		
		
		/**
		 * @property MAX_WEIGHT_VALUE
		 * @static
		 * @final
		 * @type number
		 */
		MAX_WEIGHT_VALUE : 5,
		
		
		/**
		 * @property METHOD_HEIGHT
		 * @static
		 * @final
		 * @type number
		 */
		METHOD_HEIGHT    : 25,
		
		
		/**
		 * @property PHP_DOWNLOAD
		 * @static
		 * @final
		 * @type string
		 */
		PHP_DOWNLOAD     : assets('php/download.php'),
		
		
		/**
		 * @property PHP_UPLOAD
		 * @static
		 * @final
		 * @type string
		 */
		PHP_UPLOAD       : assets('php/upload.php'),
		

		/**
		 * @property PLAN_FILE
		 * @static
		 * @final
		 * @type string
		 */
		PLAN_FILE        : assets('plan.csv'),
	

		/**
		 * @property SLIDE_SPEED
		 * @static
		 * @final
		 * @type number
		 */
		SLIDE_SPEED      : 300,
		
		
		/**
		 * @property SLIDER_VALUE
		 * @static
		 * @final
		 * @type number
		 */
		SLIDER_VALUE     : 3,	// it belongs to 'neutral' recommendation
		
		
		/**
		 * @property STAGES_SPEED
		 * @static
		 * @final
		 * @type number
		 */
		STAGES_SPEED     : 500,
		
		
		/**
		 * @property VALUE
		 * @static
		 * @final
		 * @type Array[string]
		 */
		VALUE            : [ "strongly recommended",
					"recommended",
					"slightly recommended",
					"neutral",
					"not recommended",
					"inappropiate (not applicable)" ],
		
		
		/**
		 * @property XML
		 * @static
		 * @final
		 * @type string
		 */
		XML              : assets('xml/activities.xml'),
		
	};


