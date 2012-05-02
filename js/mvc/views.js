 
	UP.ConstraintView = Backbone.View.extend({
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
	

	UP.SliderView = Backbone.View.extend({
		slidervalue: 0,

		initialize: function() {
			this.slidervalue = this.model.get('slidervalue');

			this.$el.slider({	/* Slider Configuration Setup */
				orientation: "horizontal",
				range: "min",
				min: 0,
				max: UP.constants.VALUE.length-1,
				value: this.slidervalue,
				animate: true,
				slide: moveSlider	// Event function to perfom
			});
		},

		moveSlider: function(event, ui) {
			var newSliderValue = ui.value;			// Updating slide text value
			this.slidervalue = newSliderValue;			// Updating the old value for next function call

			fadingMethods(newSliderValue);			// Showing or hiding methods on the lists
		}

	});


	UP.CounterView = Backbone.View.extend({
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


	UP.TotalcounterView = UP.CounterView.extend({
		increment: function(amount) {
			this.model.increment(amount);
			this.updateFilterCount(true);
		},

		decrement: function(amount) {
			this.model.decrement(amount);
			this.updateFilterCount(false);
		}
		
	});
	
	
	UP.MethodView = Backbone.View.extend({
		initialize: function(model, $jqNode) {
			this.options.model = model;
			this.options.$el = $jqNode;

			// Observing model
			this.model.bind('change', this.render, this);

			// Event Handlers
			$el.find('.checkboxWrapper').on("click", this.checkboxEvent);
			$el.find('.method-info').on("click", this.displayInfoEvent);
		},
		
		events: {
			// "click .method-info" : "displayInfoEvent"
		},
		
		render : function() {
			$el.find('.valoration').text("Hola!!!");
		},
		
		checkboxEvent: function(event) {
			event.preventDefault();
			
			var checkbox = $(this);
			activateCheckbox(checkbox);

			var li = checkbox.parent();
			this.disableMethodAnimation(li);

			// Updating tab counters value
			//updateFilterCounters();
		},
		
		displayInfoEvent: function() {
			const FADE_SPEED = UP.constants.FADE_SPEED;

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


	UP.SubactivityView = Backbone.View.extend({
		initialize: function() {
			this.model   = this.options.model;
			this.item    = this.options.item;
			this.list    = this.options.list;
			console.log(this.list);

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


	UP.ActivityView = Backbone.View.extend({
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
