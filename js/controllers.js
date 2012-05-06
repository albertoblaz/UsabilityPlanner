
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
		initialize: function(model, $jqNode) {
			this.options.model = model;
			this.options.$el = $jqNode;

			// Observing model
			this.model.on('change:value', this.render, this);
			this.model.on('updatePosition', this.updatePosition, this);

			// Event Handlers
			var self = this;

			this.$el.find('.checkboxWrapper').on("click", function(e) {
				return self.checkboxEvent(e);
			});

			this.$el.find('.method-info').on("click", this.displayInfoEvent);
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
			return this.$el.hasClass('visible');
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
				self.displayList();
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

			constraintsSelectionFix();
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
		},

		hideMethods: function(slidervalue) {
			var VALUES = UP.constants.VALUE;
			var stringValue;
			var i, j;
			
			var methods = this.list.find('.method');
			methods.addClass('hidden').removeClass('visible').removeClass('last-method');

			for ( i=0; i < methods.length; i++ ) {
				stringValue = methods.eq(i).find('.valoration').text();
				for ( j=0; j <= slidervalue && j < VALUES.length; j++ ) {
					if ( stringValue != "" && stringValue != undefined && stringValue.localeCompare(VALUES[j]) == 0) {
						methods.eq(i).removeClass('hidden').addClass('visible');
					}
				}
			}

			var visibleMethods = methods.filter('.visible');
			visibleMethods.last().addClass('last-method');
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
		},

	});


	UP.ActivityView = Backbone.Controller.extend({
		initialize: function() {
			this.model   = this.options.model;				// The Activity Model
			this.block   = this.options.block;				// View: Panel with the description on Activities Window
			this.tab     = this.options.tab;				// View: Tab above the panel
			this.list    = this.options.list;				// View: Panel with the description on Activities Window
			this.counter = this.options.counter;
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
