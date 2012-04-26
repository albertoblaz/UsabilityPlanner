

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
	


	UP.CounterView = Backbone.View.extend({
		increment: function() {
			this.model.increment();
			this.updateFilterCount(true);
		},

		decrement: function() {
			this.model.decrement();
			this.updateFilterCount(false);
		},

		updateFilterCount: function(incrementing) {
			var value = this.model.get('value');
			console.log(value);
			this.$el.find('.filter-count').text(value);

			// Also, we update the total counter
			var totalCounter = this.$el.siblings('.total-counter').find('.filter-count');
			value = parseInt(totalCounter.text());
			if (incrementing) {
				value++;
			} else {
				value--;
			}

			totalCounter.text(value);
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


	UP.ActivityView = Backbone.View.extend({
		initialize: function() {
			this.model   = this.options.model;
			this.block   = this.options.block;
			this.tab     = this.options.tab;
			this.counter = this.options.counter;

			// Handle Events
			var self = this;
			this.tab.on('click', function() {
				return self.displayActivityEvent();
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
/*
		expandListEvent: function() {
			var checkbox = this.$el.find('.checkboxWrapper');
			activateCheckbox(checkbox);
			
			this.list.show();

			this.model.changeSelection();
		},
*/
		hideRestOfActivities: function() {
			for (var i=0; i < this.arrayViews.length; i++) {
				var view = this.arrayViews[i];
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

		setArrayViews: function(arrayViews) {
			this.arrayViews = arrayViews;
		}

	});


	function activateCheckbox(obj) {
		console.log(obj);
		obj.find('a').toggleClass('checked');
	}
