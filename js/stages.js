
$(document).ready(function() {

	/* Constants */
	var SPEED = 500;
	
	
	/* Auxiliary Variable */

	var currentStage       = 0;
	var mainContainer      = $('.main-container');
	var mainContainerWidth = mainContainer.width();

	
	/* jQuery Object Variables */
	
	var stages   = $('.stage');
	var backLink = $('.back');	
	var nextLink = $('.next');	

	var container = $('.container'); 
	var contents = container.find('.main-content');
	

	/* Auxiliary Functions */
	
	function init() {	
		contents.width(mainContainerWidth-1);
		var totWidth = mainContainerWidth * contents.length;
		container.width(totWidth);
			
		var firstHeight = contents.height();
		container.height(firstHeight);
	}

	function animate(newIndex, oldIndex) {
		stages.eq(oldIndex).removeClass('current-stage');	// Old tab
		stages.eq(newIndex).addClass('current-stage');		// New tab
		
		var height = contents.eq(newIndex).height();
		var pos = -mainContainerWidth * newIndex;
		container.stop().animate({marginLeft: pos, height: height}, SPEED);
	}

	function changeHashLink(elem) {
		var hash = elem.find('a').attr('href');
		history.pushState({}, "", hash);
	}
	
	
	/* Events Definition */
	
	var stagesEvent = function(event) {
		var $this = $(this);
		
		var newPosition = $this.prevAll().length;
		animate(newPosition, currentStage);
		
		currentStage = newPosition;		// Updating to the new current stage

		event.preventDefault();
		
		//changeHashLink($this);
	}

	var backLinkEvent = function(event) {
		if (currentStage > 0)
		{
			var oldStage = currentStage;
			currentStage--;
			animate(currentStage, oldStage);
			
			//changeHashLink(stages.eq(currentStage));
		}

		event.preventDefault();
	}

	var nextLinkEvent = function(event) {
		if (currentStage < stages.length-1)
		{
			var oldStage = currentStage;
			currentStage++;
			animate(currentStage, oldStage);
			
			//changeHashLink(stages.eq(currentStage));
		}

		event.preventDefault();
	}


	/* Events Assignment */
	
	stages.on("click", stagesEvent);
	backLink.on("click", backLinkEvent);
	nextLink.on("click", nextLinkEvent);

	
	init();		/* Initialization */	
	
});