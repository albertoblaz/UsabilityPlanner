
$(document).ready(function() {

	/* jQuery (Cached) Object Variables */
	
	var filterCounters  = methodsSection.find('.filter-count');
	var infoActivity    = methodsSection.find('.info-activity');
	var listsTitles     = methodsSection.find('.expandable');
	var lists           = methodsSection.find('.list-methods');
	

	/* Auxiliary Function */

	function updateFilterCounters() {
		var numMethods   = 0;
		var totalMethods = 0;
		var infoActivity = methodsSection.find('.info-activity');
		var methods = $('.method').not('.hidden').not('.disabled');
		
		for (var i=0; i < infoActivity.length; i++)
		{
			numMethods = infoActivity.eq(i).find(methods).length;
			filterCounters.eq(i+1).text(numMethods);	// filter(n+1) corresponds with infoActivity(n)
			
			totalMethods += numMethods;
		}

		filterCounters.eq(0).text(totalMethods);		// filter(0) adjusted with the total amount
	}
	
	
	function fadingMethods(newSliderValue) {
		var i, j;
		var text;
		var methods = $('.method');
		
		methods.addClass('hidden').removeClass('visible').removeClass('last-method');
		
		for (i=0; i < methods.length; i++) {
			text = methods.eq(i).find('.valoration').text();
			for (j=0; j <= newSliderValue && j < valoration.length; j++) {
				if (text != 'null' && text != 'undefined' && text.localeCompare(valoration[j]) == 0) {
					methods.eq(i).removeClass('hidden').addClass('visible');
				}
			}
		}
		
		for (i=0; i < lists.length; i++) {
			lists.eq(i).find('.visible').last().addClass('last-method');
		}
	}
	


	/* Events Definition */
		
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
			listsTitles.eq(i).parent().siblings().slideUp(SLIDE_SPEED, function() {
				var that = $(this);
				that.addClass('hidden');
				that.css({display: block});
			});
		}
	}
	
	var scrollToSectionsEvent = function (event) {
		var section = $(this).attr('href');
		var sectionPosition = Math.floor($(section).offset().top);

		$('html, body').animate({scrollTop: sectionPosition}, FADE_SPEED);

		event.preventDefault();
	};

	var sliderEvent = (function(event, ui) {
		// Updating slide text value
		newSliderValue = ui.value;

		// Showing or hiding methods on the lists
		fadingMethods(newSliderValue);

		// Updating the old value for next function call
		sliderValue = newSliderValue;
		
		// Updating tab counters value
		updateFilterCounters();
	});

	
	
	/* Events Assignments */
	
	listsTitles.on("click", expandEvent);
	
	methodsSection.find('.filtering a').on("click", scrollToSectionsEvent);
	methodsSection.find('#expand').on("click", expandAllEvent);
	methodsSection.find('#collapse').on("click", collapseAllEvent);
	
	
	/* Initialization */
	
	// Getting and parsing XML file with Ajax
	(function() {
		const xml = 'xml/projectStagesDataDevelopers.xml';
		$.get(xml, function(xml) {
			var $methodsDOM = $('.method');

			// Find every method in XML file and create an object to represent it
			$(xml).find('method').each(function(i) {
			    var jqObject = $methodsDOM.eq(i);
		           var constraints  = $(this).find('constraint');
			    var m = Method(jqObject, constraints);
			    arrayMethods.push(m);
			});

			console.log(arrayMethods[1].constraints);
		});

	})();	// <-- Anonymous function (never called by anyone) executed!


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
	updateFilterCounters();

});
