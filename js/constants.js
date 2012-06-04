
	var UP = UP || {};	
	window.UP = UP;


	
	/*
	 * What the framework calls 'Views' are actually 'Controllers' 
	 * so we rename the module by creating an object Controller that inherits every property of View
	 */
	Backbone.Controller = Backbone.View.extend({});


	
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
		PHP_DOWNLOAD     : 'php/download.php',
		
		
		/**
		 * @property PHP_UPLOAD
		 * @static
		 * @final
		 * @type string
		 */
		PHP_UPLOAD       : 'php/upload.php',
		
		
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
		SLIDER_VALUE     : 1,
		
		
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
		VALUE            : [ "strongly recommended", "recommended", "slightly recommended", "neutral", "not recommended" ],
		
		
		/**
		 * @property XML
		 * @static
		 * @final
		 * @type string
		 */
		XML              : 'xml/stages.xml'
		
	};
	