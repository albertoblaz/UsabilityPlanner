
$(document).ready(function() {

	/* Constants */



	/* jQuery Object Variables */

	var activities     = $('.activity');
	var infoActivities = $('.info-activity');
	var subactivities  = activities.find('.subactivity');


	/* Auxiliary Variables */



	/* Event Definitions */

	var subactivitiesSelectedEvent = function() {
		var subactivity = $(this);

		var subpos = subactivity.prevAll().length;
		var pos = subactivity.parents('.activity').prevAll().length;

		var infoSubactivity = infoActivities.eq(pos).children('.info-subactivity').eq(subpos);
		infoSubactivity.toggleClass('hidden').toggleClass('selected');
	}



	/* Event Assignments */

	subactivities.on("click", subactivitiesSelectedEvent);


	/* Initialization */

});
