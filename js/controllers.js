
	UP.ConstraintView = Backbone.Controller.extend({
		initialize: function() {
		},

		events: {
			"click" : "constraintSelected"
		},
		
		constraintSelected: function(event) {
			event.preventDefault();

			var checkbox = this.$el.find('.checkboxWrapper');
			activateCheckbox(checkbox);
			
			this.model.changeSelection();		// Actualizar el modelo de Constraint llamando a su método select
		}
		
	});
	

	UP.SliderView = Backbone.Controller.extend({
		slidervalue: 0,

		initialize: function() {
			this.slidervalue = this.model.get('slidervalue');

			this.$el = $('#slider');

			this.$el.slider({	/* Slider Configuration Setup */
				orientation: "horizontal",
				range: "min",
				min: 0,
				max: UP.constants.VALUE.length-1,
				value: this.slidervalue,
				animate: true,
				slide: this.moveSlider	// Event function to perfom
			});
		},

		moveSlider: function(event, ui) {
			var newSliderValue = ui.value;			// Updating slide text value
			this.slidervalue = newSliderValue;			// Updating the old value for next function call

			fadingMethods(newSliderValue);			// Showing or hiding methods on the lists
		}

	});


	UP.CounterView = Backbone.Controller.extend({
		initialize: function() {
			this.totalcounter = this.options.totalcounter;
			this.$el.on("click", this.scrollToList);
		},

		scrollToList: function(event) {
			event.preventDefault();

			var linkCounter = $(this);

			var section = linkCounter.attr('href');
			var sectionPosition = Math.floor($(section).offset().top);

			$('html, body').animate({scrollTop: sectionPosition}, UP.constants.FADE_SPEED);
		},

		increment: function(amount) {
			this.totalcounter.increment(amount);
			this.model.increment(amount);
			this.updateFilterCount(true);
		},

		decrement: function(amount) {
			this.totalcounter.decrement(amount);
			this.model.decrement(amount);
			this.updateFilterCount(false);
		},

		updateFilterCount: function(incrementing) {
			var value = this.model.get('value');
			this.$el.find('.filter-count').text(value);
		}
		
	});


	UP.TotalcounterView = Backbone.Controller.extend({
		increment: function(amount) {
			this.model.increment(amount);
			this.updateFilterCount(true);
		},

		decrement: function(amount) {
			this.model.decrement(amount);
			this.updateFilterCount(false);
		}
		
	});
	
	
	UP.MethodView = Backbone.Controller.extend({
		initialize: function(model, $jqNode) {
			this.options.model = model;
			this.options.$el = $jqNode;

			// Observing model
			this.model.on('change', this.render, this);
			this.model.on('updatePosition', this.updatePosition, this);

			// Event Handlers
			var self = this;

			this.$el.find('.checkboxWrapper').on("click", function(e) {
				return self.checkboxEvent(e);
			});

			this.$el.find('.method-info').on("click", this.displayInfoEvent);
		},
		
		events: {
			//"click .method-info" : "displayInfoEvent"
		},
		
		render: function(method) {
			var color;
			var textValue = "";

			var newValue = method.get('value');

			if (newValue == 0) {
				color = "hidden";		// Ocultamos la barra
			} else	if (newValue >= 0.6) {
				textValue = UP.constants.VALUE[0];
				color = "green";
			} else if (newValue >= 0.4) {
				textValue = UP.constants.VALUE[1];
				color = "yellow";
			} else if (newValue >= 0.2) {
				textValue = UP.constants.VALUE[2];
				color = "orange";
			} else {
				textValue = UP.constants.VALUE[3];
				color = "red";
			}

			this.$el.find('.valoration').text(textValue);
			this.$el.find('.bar').attr('class', 'bar').addClass(color);
		},
		
		updatePosition: function() {
			this.$el.parent().prepend(this.$el);
		},

		checkboxEvent: function(event) {
			event.preventDefault();

			var checkbox = this.$el.find('.checkboxWrapper');
			activateCheckbox(checkbox);

			var method = checkbox.parent('.method');
			this.disableMethodAnimation(method);

			this.model.changeSelection();

			// Updating tab counters value
			//updateFilterCounters();
		},
		
		displayInfoEvent: function() {
			var FADE_SPEED = UP.constants.FADE_SPEED;

			var $this = $(this);
			var description  = $this.siblings('.method-description');
			var expandButton = $this.find('.expand-button');
			var method       = $this.parent();
			
			if (description.hasClass('hidden')) {
				description.css({opacity: 0});
				description.removeClass('hidden');
				
				var height = description.height() + 40;
				method.stop().animate({height: height}, FADE_SPEED);
				
				description.stop().animate({opacity: 1}, FADE_SPEED);
				expandButton.addClass('expanded');
			} else {
				method.stop().animate({height: 25}, FADE_SPEED);
				description.stop().animate({opacity: 0}, FADE_SPEED, function() {
					description.addClass('hidden');
				});
				expandButton.removeClass('expanded');
			}
		},
		
		disableMethodAnimation: function(li) {
			var FADE_SPEED = UP.constants.FADE_SPEED;
			var DISABLED_OPACITY = UP.constants.DISABLED_OPACITY;

			var CSSClass = 'disabled';
			var bar = li.find('.bar');
			
			if (li.hasClass(CSSClass)) {
				li.removeClass(CSSClass);
				li.animate({opacity: '1'}, FADE_SPEED);
				bar.animate({opacity: '1'}, FADE_SPEED);
			} else {
				li.addClass(CSSClass);
				li.animate({opacity: DISABLED_OPACITY}, FADE_SPEED);
				bar.animate({opacity: DISABLED_OPACITY}, FADE_SPEED);
			}
		}

	});


	UP.SubactivityView = Backbone.Controller.extend({
		initialize: function() {
			this.model   = this.options.model;
			this.item    = this.options.item;
			this.list    = this.options.list;

			// Handle Events
			var self = this;
			this.item.on("click", function() {
				return self.displayList();
			});

			this.list.find('.expandable').on('click', function() {
				return self.expandList();
			});
		},

		displayList: function() {
			var checkbox = this.item.find('.checkboxWrapper');
			activateCheckbox(checkbox);
			
			this.list.toggleClass('hidden');
			this.model.changeSelection();		// Actualizar el modelo de 'Subactivity' llamando a su método select
		},

		expandList: function() {
			var header = this.list.find('.expandable');
			var headerVisible = true;

			if (header.hasClass('collapsed')) {
				this.slideDown(headerVisible);
			} else {
				this.slideUp(headerVisible);
			}

			header.toggleClass('collapsed');
		},

		reorderMethods: function() {
/*			var listMethods = this.list.find('.list-method');
			var methods = listMethods.find('.method');
			var VALUES = UP.constants.VALUE;

			var i, j;
			for ( i=0; i < VALUES.length; i++ ) {
				for ( j=0; j < methods.lentgh; j++ ) {
					if (m
				}
			}
*/
		},

		fadingMethods: function() {

	/*
	fadingMethods(newSliderValue) {
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
	*/
		},

		slideUp: function(headerVisible) {
			var selected = this.model.get('selected');
			if (selected) {
				if (headerVisible == true) {
					this.list.find('.list-methods').slideUp(UP.constants.SLIDE_SPEED, slideUpFix);
				} else {
					this.list.slideUp(UP.constants.SLIDE_SPEED, slideUpFix);
				}
			}
		},

		slideDown: function(headerVisible) {
			var selected = this.model.get('selected');
			if (selected) {
				if (headerVisible == true) {
					this.list.find('.list-methods').slideDown(UP.constants.SLIDE_SPEED, slideDownFix);					
				} else {
					this.list.slideDown(UP.constants.SLIDE_SPEED, slideDownFix);
				}
			}
		}

	});


	UP.ActivityView = Backbone.Controller.extend({
		initialize: function() {
			this.model   = this.options.model;				// The Activity Model
			this.counter = this.options.counter;			// Counter Controller related to this Activity
			this.block   = this.options.block;				// View: Panel with the description on Activities Window
			this.tab     = this.options.tab;				// View: Tab above the panel
			this.list    = this.options.list;				// View: Panel with the description on Activities Window


			// Handle Events
			var self = this;

			this.tab.on('click', function() {
				return self.displayActivityEvent();
			});

			this.list.children('.expandable').on('click', function() {
				return self.expandList();
			});
		},

		displayActivityEvent: function() {
			this.hideRestOfActivities();
			this.tab.addClass('tab-active');

			$('.container').stop().animate(
				{height: this.block.height()}, 
				UP.constants.ACTIVITY_SPEED);

			this.block.removeClass('hidden');
		},

		expandList: function() {
			var header = this.list.children('.expandable');

			if (header.hasClass('collapsed')) {
				for (var i=0; i<this.subactivities.length; i++) {
					this.subactivities[i].slideDown();
				}
			} else {
				for (var i=0; i<this.subactivities.length; i++) {
					this.subactivities[i].slideUp();
				}
			}

			header.toggleClass('collapsed');
		},

		hideRestOfActivities: function() {
			for (var i=0; i < this.activities.length; i++) {
				var view = this.activities[i];
				if (this != view) {
					view.hideActivity();
				}
			}
		},
		
		hideActivity: function() {
			this.tab.removeClass('tab-active');
			this.block.addClass('hidden');
		},

		updateCounter: function(increment) {
			if (increment == true) {
				this.counter.increment();
			} else {
				this.counter.decrement();
			}
		},

		setSubactivities: function(subactivities) {
			this.subactivities = subactivities;
		},

		setActivities: function(activities) {
			this.activities = activities;
		}

	});

	function slideUpFix() {
		$(this).css({display : ""}).addClass('hidden');
	}

	function slideDownFix() {
		$(this).removeClass('hidden');
	}

	function activateCheckbox(obj) {
		obj.find('a').toggleClass('checked');
	}
