
	UP.SliderController = Backbone.Controller.extend({
		initialize: function() {
			this.model = this.options.model;
			this.sliderView = $('#slider');

			this.updateValue( UP.constants.SLIDER_VALUE );

			var self = this;
			this.sliderView.slider({		/* Slider Widget Configuration Setup */
				orientation: "horizontal",
				range: "min",
				min: 0,
				max: UP.constants.VALUE.length-1,
				value: this.sliderValue,
				animate: true,
				slide: function(event, ui) {	// Event function to perfom
					self.updateValue(ui.value);
				}
			});
		},

		updateValue: function(newValue) {
			this.sliderValue = newValue;
			this.model.updateValue(newValue);
		}

	});


	UP.ConstraintController = Backbone.Controller.extend({
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


	UP.CounterController = Backbone.Controller.extend({
		initialize: function() {
			this.model.on('change', this.updateCounter, this);

			this.$el.on("click", this.scrollToList);
		},

		scrollToList: function(event) {
			event.preventDefault();

			var linkCounter = $(this);

			var section = linkCounter.attr('href');
			var sectionPosition = Math.floor($(section).offset().top);

			$('html, body').animate({scrollTop: sectionPosition}, UP.constants.FADE_SPEED);
		},

		updateCounter: function() {
			var newValue = this.model.get('value');
			this.$el.find('.filter-count').text(newValue);
		}
		
	});


	UP.TotalCounterController = Backbone.Controller.extend({
		initialize: function() {
			this.model.on('change', this.updateCounter, this);
		},

		updateCounter: function() {
			var newValue = this.model.get('value');
			this.$el.find('.filter-count').text(newValue);
		}
		
	});
	
	
	UP.MethodController = Backbone.Controller.extend({
		initialize: function() {
			this.model      = this.options.model;

			this.methodView = this.options.methodView;
			this.planView   = this.options.planView;


			// Observing model
			this.model.on('render', this.render, this);
			this.model.on('updatePosition', this.updatePosition, this);
			this.model.on('hideMethod', this.hideMethod, this);


			// Event Handlers

			var self = this;
			function checkboxAnimation(e) {
				self.checkboxEvent(e);
			}

			this.methodView.find('.checkboxWrapper').on("click", checkboxAnimation);
			this.planView.find('.checkboxWrapper').on("click", checkboxAnimation);

			this.methodView.find('.method-info').on("click", this.displayInfoEvent);
			this.planView.find('.method-info').on("click", this.displayInfoEvent);
		},

			
		render: function() {
			var color;
			var textValue = "";

			var newValue = this.model.getValue();

			if (newValue >= 0.8) {
				textValue = UP.constants.VALUE[0];
				color = "green";
			} else if (newValue >= 0.6) {
				textValue = UP.constants.VALUE[1];
				color = "yellow";
			} else if (newValue >= 0.4) {
				textValue = UP.constants.VALUE[2];
				color = "orange";
			} else if (newValue >= 0.2) {
				textValue = UP.constants.VALUE[3];
				color = "red";
			} else if (newValue >= 0.1) {
				textValue = UP.constants.VALUE[4];
				color = "red";
			} else if (newValue == 0) {
				color = "hidden";
			}

			this.methodView.find('.valoration').text(textValue);
			this.methodView.find('.bar').attr('class', 'bar').addClass(color);

			this.planView.find('.valoration').text(textValue);
			this.planView.find('.bar').attr('class', 'bar').addClass(color);

			console.log("RENDER!!!");
		},


		updatePosition: function() {
			this.methodView.parent().prepend(this.methodView);
			this.planView.parent().prepend(this.planView);
		},


		hideMethod: function(event) {
			var sliderValue = event.sliderValue;
			var VALUES = UP.constants.VALUE;

			this.methodView.addClass('hidden').removeClass('visible').removeClass('last-method');
			this.planView.addClass('hidden').removeClass('visible').removeClass('last-method');

			this.model.unselectMethod();

			var stringValue = this.methodView.find('.valoration').text();

			for ( var j=0; j <= sliderValue && j < VALUES.length; j++ ) {
				if ( stringValue === VALUES[j] ) {
					this.methodView.removeClass('hidden').addClass('visible');
					this.planView.removeClass('hidden').addClass('visible');
					this.model.selectMethod();
				}
			}

		},


		checkboxEvent: function(event) {
			event.preventDefault();

			var checkbox = this.methodView.find('.checkboxWrapper');
			activateCheckbox(checkbox);

			var method = checkbox.parent('.method');
			this.disableMethodAnimation(method);

			this.model.changeSelection();
			this.planView.toggleClass('visible hidden');
		},
		

		displayInfoEvent: function() {
			var FADE_SPEED = UP.constants.FADE_SPEED;
			var METHOD_HEIGHT = UP.constants.METHOD_HEIGHT;

			var $this = $(this);
			var description  = $this.siblings('.method-description');
			var expandButton = $this.find('.expand-button');
			var method       = $this.parent();
			
			if (description.hasClass('hidden')) {
				description.css({opacity: 0});
				description.removeClass('hidden');

				method.css({ height: METHOD_HEIGHT });

				var height = description.height() + 40;
				method.stop().animate({height: height}, FADE_SPEED);
				
				description.stop().animate({opacity: 1}, FADE_SPEED);
				expandButton.addClass('expanded');
			} else {
				method.stop().animate({height: METHOD_HEIGHT}, FADE_SPEED);
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
		}, 


		isSelected: function() {
			return this.model.get('selected');
		},


		isVisible: function() {
			return this.methodView.hasClass('visible');
		}

	});


	UP.SubactivityController = Backbone.Controller.extend({
		initialize: function() {
			this.model    = this.options.model;
			this.item     = this.options.item;
			this.list     = this.options.list;
			this.listPlan = this.options.listPlan;


			// Handle Events
			var self = this;

			this.model.on('updateLastMethod', this.updateLastMethod, this);
			this.model.on('changeDisplayList', this.displayList, this);

			this.item.on("click", function(e) {
				e.preventDefault();
				self.model.changeSelection();	// Actualizar el modelo de 'Subactivity' llamando a su método select
				self.displayList();
			});

			function expandAnimation() {
				self.expandList();
			}

			this.list.find('.expandable').on('click', expandAnimation);
			this.listPlan.find('.expandable').on('click', expandAnimation);
		},

		displayList: function() {
			var checkbox = this.item.find('.checkboxWrapper');
			activateCheckbox(checkbox);
			
			this.list.toggleClass('hidden');
			this.listPlan.toggleClass('hidden');

			constraintsSelectionFix();
		},

		expandList: function() {
			var header     = this.list.find('.expandable');
			var headerPlan = this.listPlan.find('.expandable');

			var headerVisible = true;
			var bothCollapsed = header.hasClass('collapsed') && headerPlan.hasClass('collapsed');

			if ( bothCollapsed ) {
				this.slideDown(headerVisible);
			} else {
				this.slideUp(headerVisible);
			}

			header.toggleClass('collapsed');
			headerPlan.toggleClass('collapsed');
		},

		slideUp: function(headerVisible) {
			var selected = this.model.get('selected');
			if (selected) {
				if (headerVisible == true) {
					this.list.find('.list-methods').slideUp(UP.constants.SLIDE_SPEED, slideUpFix);
					this.listPlan.find('.list-methods').slideUp(UP.constants.SLIDE_SPEED, slideUpFix);
				} else {
					this.list.slideUp(UP.constants.SLIDE_SPEED, slideUpFix);
					this.listPlan.slideUp(UP.constants.SLIDE_SPEED, slideUpFix);
				}
			}
		},

		slideDown: function(headerVisible) {
			var selected = this.model.get('selected');
			if (selected) {
				if (headerVisible == true) {
					this.list.find('.list-methods').slideDown(UP.constants.SLIDE_SPEED, slideDownFix);
					this.listPlan.find('.list-methods').slideDown(UP.constants.SLIDE_SPEED, slideDownFix);
				} else {
					this.list.slideDown(UP.constants.SLIDE_SPEED, slideDownFix);
					this.listPlan.slideDown(UP.constants.SLIDE_SPEED, slideDownFix);
				}
			}
		},

		updateLastMethod: function() {
			this.list.find('.visible').last().addClass('last-method');
			this.listPlan.find('.visible').last().addClass('last-method');
		},

/*
		hideMethods: function(slidervalue) {
			this.list.find('.visible').last().addClass('last-method');
			this.listPlan.find('.visible').last().addClass('last-method');
		},

		setMethods: function(methods) {
			this.methods = methods;
		},
*/
		isSelected: function() {
			return this.model.get('selected');
		},

		addClassIfLast: function() {
			console.log("entramos aqui");
			var subs = $('.info-subactivity').not('hidden');
			if ( this.list == subs.last() ) {
				this.list.addClass('last-subactivity');
			}
		}

	});


	UP.ActivityController = Backbone.Controller.extend({
		initialize: function() {
			this.model    = this.options.model;				// The Activity Model
			this.block    = this.options.block;				// View: Panel with the description on 'Activities' Window
			this.tab      = this.options.tab;					// View: Tab above the panel
			this.list     = this.options.list;					// View: Subactivities List on 'Methods' Window
			this.listPlan = this.options.listPlan;				// View: Subactivities List on 'Plan' Window
			this.subactivities = [];


			// Handle Events
			var self = this;

			this.tab.on('click', function() {
				return self.displayActivityEvent();
			});

			function expandAnimation() {
				if ( $(this).hasClass('collapsed') ) {
					self.expandList();
				} else {
					self.collapseList();
				}
			}

			this.list.children('.expandable').on('click', expandAnimation);
			this.listPlan.children('.expandable').on('click', expandAnimation);

		},

		displayActivityEvent: function() {
			this.hideRestOfActivities();
			this.tab.addClass('tab-active');

			$('.container').stop().animate( {height : this.block.height()}, UP.constants.ACTIVITY_SPEED );

			this.block.removeClass('hidden');
		},

		expandList: function() {
			var header     = this.list.children('.expandable');
			var headerPlan = this.listPlan.children('.expandable');

			var bothCollapsed = header.hasClass('collapsed') && headerPlan.hasClass('collapsed');

			if ( bothCollapsed ) {
				for (var i=0; i<this.subactivities.length; i++) {
					this.subactivities[i].slideDown();
				}
			} 

			header.removeClass('collapsed');
			headerPlan.removeClass('collapsed');
		},

		collapseList: function() {
			var header = this.list.children('.expandable');
			var headerPlan = this.listPlan.children('.expandable');

			var bothNotCollapsed = !header.hasClass('collapsed') && !headerPlan.hasClass('collapsed');

			if ( bothNotCollapsed ) {
				for (var i=0; i<this.subactivities.length; i++) {
					this.subactivities[i].slideUp();
				}
			}

			header.addClass('collapsed');
			headerPlan.addClass('collapsed');
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

		setSubactivities: function(subactivities) {
			this.subactivities = subactivities;
		},

		setActivities: function(activities) {
			this.activities = activities;
		}

	});


	/* Auxiliary Function */

	function activateCheckbox(obj) {
		obj.find('a').toggleClass('checked');
	}


	/* Subactivities Callback Fixes */

	function slideUpFix() {
		$(this).css({display : ""}).addClass('hidden');
	}

	function slideDownFix() {
		$(this).removeClass('hidden');
	}


	/* Constraint Aside Panel Fix */

	function constraintsSelectionFix() {
		var cs = $('#constraints-selection');
		cs.height( cs.parent('.content').height() );
	}
