
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

		updateCounter: function(newValue) {
			var oldValue = this.model.get('value');

			this.model.set({ value : newValue });
			this.$el.find('.filter-count').text(newValue);


			console.log("newValue = " + newValue);
			console.log("oldValue = " + oldValue);

			var amount = newValue - oldValue;
			if ( amount < 0 ) {
				amount = Math.abs(amount);
				console.log("Final amount = " + amount);
				this.totalcounter.decrement(amount);
			} else if ( amount > 0 ) {
				console.log("Final amount = " + amount);
				this.totalcounter.increment(amount);
			}
		}
		
	});


	UP.TotalcounterView = Backbone.Controller.extend({
		increment: function(amount) {
			this.model.increment(amount);
			this.updateFilterCount();
		},

		decrement: function(amount) {
			this.model.decrement(amount);
			this.updateFilterCount();
		},

		updateFilterCount: function() {
			var newValue = this.model.get('value');
			this.$el.find('.filter-count').text(newValue);
		}
		
	});
	
	
	UP.MethodView = Backbone.Controller.extend({
		initialize: function() {
			this.model      = this.options.model;
			this.methodView = this.options.methodView;
			this.planView   = this.options.planView;


			// Observing model
			this.model.on('change:value', this.render, this);
			this.model.on('updatePosition', this.updatePosition, this);

			// Event Handlers
			var self = this;

			this.methodView.find('.checkboxWrapper').on("click", function(e) {
				self.checkboxEvent(e);
			});

			this.methodView.find('.method-info').on("click", this.displayInfoEvent);
			this.planView.find('.method-info').on("click", this.displayInfoEvent);
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

			this.methodView.find('.valoration').text(textValue);
			this.methodView.find('.bar').attr('class', 'bar').addClass(color);

			this.planView.find('.valoration').text(textValue);
			this.planView.find('.bar').attr('class', 'bar').addClass(color);
		},
		
		updatePosition: function() {
			this.methodView.parent().prepend(this.methodView);
			this.planView.parent().prepend(this.planView);
		},

		checkboxEvent: function(event) {
			event.preventDefault();

			var checkbox = this.methodView.find('.checkboxWrapper');
			activateCheckbox(checkbox);

			var method = checkbox.parent('.method');
			this.disableMethodAnimation(method);

			this.model.changeSelection();
			this.planView.toggleClass('visible hidden');//.toggleClass('hidden');
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

		hideMethod: function(slidervalue) {
			var VALUES = UP.constants.VALUE;
			var stringValue;			

			this.methodView.addClass('hidden').removeClass('visible').removeClass('last-method');
			this.planView.addClass('hidden').removeClass('visible').removeClass('last-method');
			this.model.unselectMethod();

			stringValue = this.methodView.find('.valoration').text();

			for ( var j=0; j <= slidervalue && j < VALUES.length; j++ ) {
				if ( stringValue.localeCompare( VALUES[j] ) == 0 ) {
					this.methodView.removeClass('hidden').addClass('visible');
					this.planView.removeClass('hidden').addClass('visible');
					this.model.selectMethod();
				}
			}

		},

		isSelected: function() {
			return this.model.get('selected');
		},

		isVisible: function() {
			return this.methodView.hasClass('visible');
		}

	});


	UP.SubactivityView = Backbone.Controller.extend({
		initialize: function() {
			this.model    = this.options.model;
			this.item     = this.options.item;
			this.list     = this.options.list;
			this.listPlan = this.options.listPlan;

			// Handle Events
			var self = this;
			this.item.on("click", function() {
				self.displayList();
			});

			this.list.find('.expandable').on('click', function() {
				self.expandList(self.list);
			});

			this.listPlan.find('.expandable').on('click', function() {
				self.expandList(self.listPlan);
			});
		},

		displayList: function() {
			var checkbox = this.item.find('.checkboxWrapper');
			activateCheckbox(checkbox);
			
			this.list.toggleClass('hidden');
			this.listPlan.toggleClass('hidden');
			this.model.changeSelection();		// Actualizar el modelo de 'Subactivity' llamando a su método select

			constraintsSelectionFix();
		},

		expandList: function(list) {
			var header = list.find('.expandable');
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

		hideMethods: function(slidervalue) {
			for ( var i=0; i < this.methods.length; i++ ) {
				this.methods[i].hideMethod(slidervalue);
			}

			this.list.find('.visible').last().addClass('last-method');
			this.listPlan.find('.visible').last().addClass('last-method');

		},

		setMethods: function(methods) {
			this.methods = methods;
		},

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


	UP.ActivityView = Backbone.Controller.extend({
		initialize: function() {
			this.model    = this.options.model;				// The Activity Model
			this.block    = this.options.block;				// View: Panel with the description on 'Activities' Window
			this.tab      = this.options.tab;					// View: Tab above the panel
			this.list     = this.options.list;					// View: Subactivities List on 'Methods' Window
			this.listPlan = this.options.listPlan;				// View: Subactivities List on 'Plan' Window
			this.counter  = this.options.counter;
			this.subactivities = [];


			// Handle Events
			var self = this;

			this.tab.on('click', function() {
				return self.displayActivityEvent();
			});

			this.list.children('.expandable').on('click', function() {
				if ( $(this).hasClass('collapsed') ) {
					self.expandList();
				} else {
					self.collapseList();
				}
			});

			this.listPlan.children('.expandable').on('click', function() {
				if ( $(this).hasClass('collapsed') ) {
					self.expandList();
				} else {
					self.collapseList();
				}
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

			if ( header.hasClass('collapsed') ) {
				for (var i=0; i<this.subactivities.length; i++) {
					this.subactivities[i].slideDown();
				}
			} 

			header.removeClass('collapsed');
		},

		collapseList: function() {
			var header = this.list.children('.expandable');

			if ( !header.hasClass('collapsed') ) {
				for (var i=0; i<this.subactivities.length; i++) {
					this.subactivities[i].slideUp();
				}
			}

			header.addClass('collapsed');
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

		updateCountersView: function() {	// En cuanto un metodo cambie
			console.log("updateCountersView");
			var count = 0;

			for ( var i=0; i < this.subactivities.length; i++ ) {
				var subactivity = this.subactivities[i];
				if ( subactivity.isSelected() ) {
					var methods = this.subactivities[i].methods;
					for ( var j=0; j < methods.length; j++ ) {
						var m = methods[j];
						if ( m.isSelected() && m.isVisible() ) {
							count++;
						}
					}
				}
			}
			
			this.counter.updateCounter(count);
		},

		setSubactivities: function(subactivities) {
			this.subactivities = subactivities;

			var self = this;

			for ( var i=0; i < this.subactivities.length; i++ ) {
				var subactivity = this.subactivities[i];
				var methods = subactivity.methods;
				for ( var j=0; j < methods.length; j++ ) {
					methods[j].model.on('change:selected', self.updateCountersView, this);
				}

				subactivity.model.on('change:selected', function() {
					if ( subactivity.isSelected() ) {
						console.log("dentro del if");
						subactivity.addClassIfLast();
					}

					this.updateCountersView();
				}, this);
			}
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
