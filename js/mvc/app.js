
// Load the application once the DOM is ready, using `jQuery.ready`
	var UP = UP || {};

	/* Constants */
	UP.constants = {
		FADE_SPEED       : 700,
		DISABLED_OPACITY : 0.5,
		SLIDE_SPEED      : 300,
		VALUE            : [ "strongly recommended", "neutral", "slightly recommended", "not recommended" ]
	};

	const FADE_SPEED       = 700;
	const DISABLED_OPACITY = 0.5;
	const SLIDE_SPEED      = 300;

	const recommendation = [ "strongly recommended", "neutral", "slightly recommended", "not recommended" ];
	
	
	/* Auxiliary Variables */
	
	var sliderValue  = 1;