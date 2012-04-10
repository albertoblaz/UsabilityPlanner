
$(document).ready(function() {

	/* Constants */

	var FADE_SPEED       = 700;
	var DISABLED_OPACITY = 0.5;
	var SLIDE_SPEED      = 300;
	
	/* jQuery Object Variables */
	
	/*
	var constraintsSection  = $('#constraints-selection');
	var constraints         = constraintsSection.
	*/
	var constraints     = $('#constraints-selection').find('.constraint');
	
	var methodsSection  = $('#methods-selection');
	var tabCounters     = methodsSection.find('.tab-count');
	var info            = methodsSection.find('.info');
	var listsTitles     = methodsSection.find('.expandable');
	var lists           = methodsSection.find('.list-methods');
	var methodsCheckbox = methodsSection.find('.checkboxWrapper');
	var methodInfos     = methodsSection.find('.method-info');
	
	
	/* Auxiliary Variables */

	var sliderValue = 1;
	var valoration = ["strongly recommended", 
						"neutral", 
						"slightly recommended",
						"not recommended"];



	
	
	/* Auxiliary Function */

	function updateTabCounters() {
		var numMethods   = 0;
		var totalMethods = 0;
		var info = methodsSection.find('.info');
		var methods = $('.method').not('.hidden').not('.disabled');
		
		for (var i=0; i < info.length; i++)
		{
			numMethods = info.eq(i).find(methods).length;
			tabCounters.eq(i).text(numMethods);
			
			totalMethods += numMethods;
		}

		tabCounters.eq(0).text(totalMethods);
	}
	
	function activateCheckbox(obj) {
		obj.find('a').toggleClass('checked');
	}
	
	function disableMethodAnimation(li) {
		var CSSClass = 'disabled';
		var bar = li.find('.bar');
		
		if (li.hasClass(CSSClass))
		{
			li.removeClass(CSSClass);
			li.animate({opacity: '1'}, FADE_SPEED);
			bar.animate({opacity: '1'}, FADE_SPEED);
		}
		else
		{
			li.addClass(CSSClass);
			li.animate({opacity: DISABLED_OPACITY}, FADE_SPEED);
			bar.animate({opacity: DISABLED_OPACITY}, FADE_SPEED);
		}
	}
	
	
	/* Events Definition */
	
	var constraintsEvent = function(event) {
		activateCheckbox($(this));
		event.preventDefault();
	}
	
	var expandEvent = function() {
		var elem = $(this);		
		var className = 'collapsed';
		
		if (elem.hasClass(className)) {
			elem.removeClass(className);
		} else {
			elem.addClass(className);
		}
		
		elem.parent().siblings().slideToggle(SLIDE_SPEED);
	}
		
	var expandAllEvent = function() {		
		for (var i=0; i < listsTitles.length; i++) {
			listsTitles.eq(i).removeClass('collapsed');
			listsTitles.eq(i).parent().siblings().slideDown(SLIDE_SPEED);
		}
	}
	
	var collapseAllEvent = function() {
		for (var i=0; i < listsTitles.length; i++) {
			listsTitles.eq(i).addClass('collapsed');
			listsTitles.eq(i).parent().siblings().slideUp(SLIDE_SPEED);
		}
	}
	
	var methodsCheckboxEvent = function(event) {
		var checkbox = $(this);

		var li = checkbox.parent();
		disableMethodAnimation(li);
		activateCheckbox(checkbox);

		// Updating tab counters value
		updateTabCounters();

		event.preventDefault();
	}

	var methodInfoEvent = function() {
		var $this = $(this);
		var description  = $this.siblings('.method-description');
		var expandButton = $this.find('.expand-button');
		var method       = $this.parent();
		
		if (description.hasClass('hidden'))
		{
			description.css({opacity: 0});
			description.removeClass('hidden');
			
			var height = description.height() + 40;
			method.stop().animate({height: height}, FADE_SPEED);
			
			description.stop().animate({opacity: 1}, FADE_SPEED);
			expandButton.addClass('expanded');
		}
		else
		{
			method.stop().animate({height: 25}, FADE_SPEED);
			description.stop().animate({opacity: 0}, FADE_SPEED, function() {
				description.addClass('hidden');
			});
			expandButton.removeClass('expanded');
		}
	}

	var scrollToSectionsEvent = function (e) {
		var section = $(this).attr('href');
		var sectionPosition = Math.floor($(section).offset().top);

		$('html, body').animate({scrollTop: sectionPosition}, FADE_SPEED);

		e.preventDefault();
	};

	var sliderEvent = (function(event, ui) {
		// Updating slide text value
		newSliderValue = ui.value;

		// Showing or hiding methods on the lists
		fadingMethods(newSliderValue);

		// Updating the old value for next function call
		sliderValue = newSliderValue;
		
		// Updating tab counters value
		updateTabCounters();
	});

	
	
	/////////////////////////////////////////////////////////////
	
	// Auxiliary Function
	
	/////////////////////////////////////////////////////////////
	
	var fadingMethods = function(newSliderValue) {
		var i, j;
		var text;
		var methods = $('.method');
		
		methods.addClass('hidden').removeClass('visible').removeClass('last-method');
		
		for (i=0; i < methods.length; i++)
		{
			text = methods.eq(i).find('.valoration').text();
			for (j=0; j <= newSliderValue && j < valoration.length; j++)
			{
				if (text != 'null' && text != 'undefined' && text.localeCompare(valoration[j]) == 0)
				{
					methods.eq(i).removeClass('hidden').addClass('visible');
				}
			}
		}
		
		for (i=0; i < lists.length; i++)
		{
			lists.eq(i).find('.visible').last().addClass('last-method');
		}
		/*
		if (sliderValue < newSliderValue)
		{
			for (i=0; i < lists.length; i++)
			{
				elem = lists.eq(i).children().eq(sliderValue-1);
				numMethods = lists.eq(i).children().length;
				
				for (j=sliderValue; j < newSliderValue && j < numMethods; j++)
				{
					elem.removeClass('last-method');
					
					elem = lists.eq(i).children().eq(j);
					elem.css({opacity: 0});
					elem.addClass('last-method');
					
					elem.removeClass('hidden');
					if (elem.hasClass('disabled'))
						elem.stop().animate({opacity: DISABLED_OPACITY}, FADE_SPEED);
					else						
						elem.stop().animate({opacity: 1}, FADE_SPEED);
				}
			}
		} 
		else if (sliderValue > newSliderValue)
		{
			for (i=0; i < lists.length; i++)
			{
				for (j=sliderValue; j >= newSliderValue; j--)
				{
					elem = lists.eq(i).children().eq(j);
					elem.addClass('hidden');
					elem.removeClass('last-method');
					
					elem = lists.eq(i).children().eq(j-1);
					elem.addClass('last-method');
				}
			}
		}*/
	}
	
	
	/* Events Assignments */

	methodsCheckbox.on("click", methodsCheckboxEvent);
	
	constraints.on("click", constraintsEvent);

	listsTitles.on("click", expandEvent);
	methodInfos.on("click", methodInfoEvent);
	
	methodsSection.find('.filtering a').on("click", scrollToSectionsEvent);
	methodsSection.find('#expand').on("click", expandAllEvent);
	methodsSection.find('#collapse').on("click", collapseAllEvent);
	
	
	/* Initialization */
	
	$('#slider').slider({	/* Slider Event Setup */
		orientation: "horizontal",
		range: "min",
		min: 0,
		max: valoration.length-1,
		value: sliderValue,
		animate: true,
		slide: sliderEvent
	});
	
	fadingMethods(sliderValue);
	

});	//$(document).ready
