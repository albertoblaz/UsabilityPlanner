
$(document).ready(function() {
	
	var MAX_METHODS = 12;
	var FADE_SPEED = 600;
	
	
	// Auxiliary Variable (old filter value)
	var oldValue = 3;


	// jQuery Object Variables
	var lists = $('.list-methods');
	var sliderCount = $("#slider-count");


	// Slide Event Definition
	var sliderEvent = (function(event, ui) {
		// Updating slide text value
		var newValue = Math.floor(ui.value/100 * MAX_METHODS);
		sliderCount.text(newValue);
		
		// Showing or hiding methods on the lists
		fadingMethods(newValue);
		
		// Updating tab counters value
		updateCounters();
		
		// Updating the old value for next function call
		oldValue = newValue;
	});

	
	var fadingMethods = function(newValue) {
		// Local vars used for loops indexes
		var i, j;
		var elem;
		
		if (oldValue < newValue)
		{
			for (i=0; i < lists.length; i++)
			{
				for (j=oldValue; j < newValue; j++)
				{
					elem = lists.eq(i).children().eq(j);
					elem.removeClass('hidden');
					elem.stop().animate({opacity: 1}, FADE_SPEED);
				}
			}
		} 
		else if (oldValue > newValue)
		{
			for (i=0; i < lists.length; i++)
			{
				for (j=oldValue; j >= newValue; j--)
				{
					elem = lists.eq(i).children().eq(j);
					elem.stop().animate({opacity: 0}, FADE_SPEED, function() {
						$(this).addClass('hidden');
					});
				}
			}
		}
	}
	
	
	// Slider Event Setup
	$('#slider').slider({
		value: 30,
		orientation: "horizontal",
		min: 10,
		range: "min",
		animate: true,
		slide: sliderEvent
	});
	
});	//$(document).ready