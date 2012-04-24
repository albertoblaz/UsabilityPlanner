
$(document).ready(function() {


	/* Object Definition */

	function Method(jqObject, constraints) {
		this.jqObject    = jqObject;
		this.constraints = constraints;
		var selected    = true;
		var valoration  = 0;

		// Private API
		function searchConstraints(op, constraintText) {
			var weight = 0;
			var c;

			for (var i=0; i<constraints.length; i++) {
				c = constraints.eq(i);
				if (c.text() === constraintText) {
					weight = parseInt(c.attr('weight'));

					if (op === true) {
						valoration += weight;
					} else {
						valoration -= weight;
					}

					console.log(valoration);
				}
			}
		};

		var updateValue = (function() {
			if (valoration > 2) {
				jqObject.find('valoration').text("not not");
			}
		});


		// Public API
		var obj = {};

		obj.constraints = constraints;
	
		obj.incrementValue = function(constraintText) {
			var increment = true;
			searchConstraints(increment, constraintText);

			/*
			var weight = 0;
			var c;

			for (var i=0; i<constraints.length; i++) {
				c = constraints.eq(i);
				if (c.text() === constraintText) {
					weight = parseInt(c.attr('weight'));

					valoration += weight;
					
					console.log(valoration);
				}
			}
			*/
		};

		obj.decrementValue = (function(constraintText) {
			var decrement = false;
			searchConstraints(decrement, constraintText);

			/*
			var weight = 0;
			var c;

			for (var i=0; i<constraints.length; i++) {
				c = constraints.eq(i);
				if (c.text() === constraintText) {
					weight = parseInt(c.attr('weight'));

					valoration -= weight;

					console.log(valoration);
				}
			}
			*/
		});

		return obj;
	}


	/* Constants */

	const FADE_SPEED       = 700;
	const DISABLED_OPACITY = 0.5;
	const SLIDE_SPEED      = 300;


	/* jQuery (Cached) Object Variables */

	var constraints     = $('#constraints-selection').find('.constraint');
	
	var methodsSection  = $('#methods-selection');
	var filterCounters  = methodsSection.find('.filter-count');
	var infoActivity    = methodsSection.find('.info-activity');
	var listsTitles     = methodsSection.find('.expandable');
	var lists           = methodsSection.find('.list-methods');
	var methodsCheckbox = methodsSection.find('.checkboxWrapper');
	var methodInfos     = methodsSection.find('.method-info');
	
	
	/* Auxiliary Global Variables */

	var arrayMethods = new Array();
	var sliderValue  = 1;
	const valoration = [ "strongly recommended", 
				"neutral", 
				"slightly recommended",
				"not recommended" ];
	
	
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
	
	var constraintsEvent = function(event) {
		var $this = $(this);

		activateCheckbox($this);
		var constraintText = $this.find('.label-constraint').text();
		var checked = $this.find('.checkbox').hasClass('checked');
		for (var i=0; i < 2; i++) {
			if (checked) {
				arrayMethods[i].incrementValue(constraintText);
			} else {
				arrayMethods[i].decrementValue(constraintText);
			}
		}


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
			listsTitles.eq(i).parent().siblings().slideUp(SLIDE_SPEED, function() {
				var that = $(this);
				that.addClass('hidden');
				that.css({display: block});
			});
		}
	}
	
	var methodsCheckboxEvent = function(event) {
		var checkbox = $(this);

		var li = checkbox.parent();
		disableMethodAnimation(li);
		activateCheckbox(checkbox);

		// Updating tab counters value
		updateFilterCounters();

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

	methodsCheckbox.on("click", methodsCheckboxEvent);
	
	constraints.on("click", constraintsEvent);

	listsTitles.on("click", expandEvent);
	methodInfos.on("click", methodInfoEvent);
	
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
