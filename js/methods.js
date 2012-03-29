
//$(document).ready(function() {

	/* Constants */
	
	var MAX_METHODS      = 12;
	var FADE_SPEED       = 700;
	var DISABLED_OPACITY = 0.5;

	
	/* jQuery Object Variables */
	
	var sliderCount     = $('#slider-count');
	
	/*
	var constraintsSection  = $('#constraints-selection');
	var constraints         = constraintsSection.
	*/
	var constraints     = $('#constraints-selection').find('.constraint');
	
	var methodsSection  = $('#methods');
	var tabs            = methodsSection.find('.tab');
	var tabCounters     = methodsSection.find('.tab-count');
	var info            = methodsSection.find('.info');
	var listsTitles     = methodsSection.find('.expandable');
	var lists           = methodsSection.find('.list-methods');
	var methodsCheckbox = methodsSection.find('.checkboxWrapper');
	var methodInfos     = methodsSection.find('.method-info');
	
	
	/* Auxiliary Variables */
	
	var currentTab = 0;
	var sliderValue = parseInt(sliderCount.text());
	
	
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
	
	
	/* Animations Definition */
		
	var disableMethodAnimation = function(li) {
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
	/*
	var tabAllMethodsEvent = function() {
		info.removeClass('hidden');
		
		$(this).addClass('tab-active');
	}*/
	
	var tabsEvent = function() {	
		info.addClass('hidden');								// Hiding the old table methods
		tabs.eq(currentTab).removeClass('tab-active');			// Deactivating old tab
		
		currentTab = $(this).prevAll().length;					// Getting the new current tab
		
		if (currentTab === 0)
		{
			info.removeClass('hidden');							// If 'All Methods' then show all
			info.eq(0).addClass('hidden');
		}
		else 
		{
			info.eq(currentTab).removeClass('hidden');			// Showing just the current table methods
		}
		
		//info.eq(currentTab).removeClass('hidden');				// Showing just the current table methods
		
		tabs.eq(currentTab).addClass('tab-active');				// Activating new tab
	}
	
	var expandEvent = function() {
		var elem = $(this);
		
		if (elem.hasClass('collapsed'))
			elem.removeClass('collapsed');
		else
			elem.addClass('collapsed');

		elem.siblings('.list-methods').slideToggle();
	}
	
	var constraintsEvent = function(event) {
		var $this = $(this);
				
		activateCheckbox($this);
		
		event.preventDefault();
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
	
	
	/* Slider Event Definitions */
	
	var sliderEvent = (function(event, ui) {
		// Updating slide text value
		var newSliderValue = Math.floor(ui.value/100 * MAX_METHODS);
		sliderCount.text(newSliderValue);
		
		// Showing or hiding methods on the lists
		fadingMethods(newSliderValue);
		
		// Updating the old value for next function call
		sliderValue = newSliderValue;
		
		// Updating tab counters value
		updateTabCounters();
	});

	var fadingMethods = function(newSliderValue) {
		// Local vars used for loops indexes
		var i, j;
		var numMethods;
		var elem;
		
		if (sliderValue < newSliderValue)
		{
			for (i=0; i < lists.length; i++)
			{				
				/*
				old = 2 - normal
				new = 3 - slightly
				
				recorremos todos los metodos en nuestra estructura de datos
					miramos el valor de valoration
					
					si el peso del metodo es 3
						destaparlo
						ponemos valoration 'slightly'
						ponemos barra de color orange
				fin_bucle
				*/
				
				elem = lists.eq(i).children().eq(sliderValue-1);
				numMethods = lists.eq(i).children().length;
				
				for (j=sliderValue; j < newSliderValue && j < numMethods; j++)
				{
					elem.removeClass('last-child');
					
					elem = lists.eq(i).children().eq(j);
					elem.css({opacity: 0});
					elem.addClass('last-child');
					
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
					elem.removeClass('last-child');
					
					elem = lists.eq(i).children().eq(j-1);
					elem.addClass('last-child');
				}
			}
		}
	}
	
	
	/* Slider Event Setup */
	
	$('#slider').slider({
		value: 30,
		orientation: "horizontal",
		min: 10,
		range: "min",
		animate: true,
		slide: sliderEvent
	});


	/* Events Assignments */
	
	tabs.on("click", tabsEvent);
	
	//constraintsCheckbox.on("click", constraintsCheckboxEvent);
	//methodsCheckbox.removeClass('checked');
	
	methodsCheckbox.on("click", methodsCheckboxEvent);
	
	constraints.on("click", constraintsEvent);
	
	listsTitles.on("click", expandEvent);
	methodInfos.on("click", methodInfoEvent);

//});	//$(document).ready
