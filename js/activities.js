
//$(document).ready(function() {

	/* Constants */
	
	ANIMATION_SPEED = 700;


	/* jQuery Object Variables */
	
	var container  = $('.container');
	
	var activities = $('#activities');
	
	var infos      = $('#activities-selection').find('.info');
	var tabs       = activities.find('.big');

	var subactivities         = activities.find('.subactivity');
	var subactivitiesCheckbox = activities.find('.checkboxWrapper');


	/* Auxiliary Variables */

	var pos     = 0;
	var heights = new Array();


	/* Initialization */

	for (var i=0; i < infos.length; i++)
	{
		heights[i] = infos.eq(i).height();
		console.log(heights[i]);
	}

	//infos.eq(i).height(heights[i]);
	
	
	/* Auxiliary Functions */
	
	function activateCheckbox(obj) {
		obj.find('a').toggleClass('checked');
	}
	
	
	/* Events Definition */
	
	var tabsEvent = function(event) {
		pos = $(this).prevAll().length;
		/* Start the sliding animation */
		
		tabs.removeClass('tab-active');
		tabs.eq(pos).addClass('tab-active');
		
		container.stop().animate({height: heights[pos]}, ANIMATION_SPEED);//, function() {	
		infos.addClass('hidden');
		infos.eq(pos).removeClass('hidden');		
		//});

		event.preventDefault();
	}

	var subactivitiesEvent = function(event) {
		var $this = $(this);

		activateCheckbox($this);

		event.preventDefault();
	}
	
	var subactivitiesCheckboxEvent = function(event) {
		var checkbox = $(this);

		var li = checkbox.parent();
		disableMethodAnimation(li);
		activateCheckbox(checkbox);

		// Updating tab counters value
		updateTabCounters();

		event.preventDefault();
	}
	
	
	/* Event Assignment */
	
	tabs.on("click", tabsEvent);
	subactivities.on("click", subactivitiesEvent);
	subactivitiesCheckbox.on("click", subactivitiesCheckboxEvent);
//});
