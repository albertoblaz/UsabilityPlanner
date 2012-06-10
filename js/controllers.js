	
	/**
	 * @module UP
	 * @submodule Controllers
	 * @class SliderController
	 * @extends Backbone.Controller
	 */	
	UP.SliderController = Backbone.Controller.extend({
	
		/**
		 * @method initialize
		 * @constructor
		 */
		initialize: function() {
		
			/* Attributes */
			
			/**
			 * The model bound to the controller
			 * @property model
			 * @type Slider
			 */
			this.model = this.options.model;
			
			/**
			 * The view represented by the DOM node caught with jQuery
			 * @property model
			 * @type jQuery Object
			 */
			this.sliderView = $('#slider');

			
			/* Initialization */
			
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
		
		
		/**
		 * @method updateValue
		 * @param newValue {number} The new slider value selected by the user when moving the slider UI component
		 */
		updateValue: function(newValue) {
			this.sliderValue = newValue;
			this.model.updateValue(newValue);
		}

	});

	
	
	/**
	 * @module UP
	 * @submodule Controllers
	 * @class ConstraintController
	 * @extends Backbone.Controller
	 */	
	UP.ConstraintController = Backbone.Controller.extend({
	
		events: {
			"click" : "constraintSelected"
		},
		
		
		/**
		 * @method constraintSelected
		 * @param event {Event} The jQuery event fired after a constraint has been clicked
		 */
		constraintSelected: function(event) {
			event.preventDefault();

			var checkbox = this.$el.find('.checkboxWrapper');
			activateCheckbox(checkbox);
			
			this.model.changeSelection();
		}
		
	});

	
	
	/**
	 * @module UP
	 * @submodule Controllers
	 * @class CounterController
	 * @extends Backbone.Controller
	 */	
	UP.CounterController = Backbone.Controller.extend({
	
		/**
		 * @method initialize
		 * @constructor
		 */
		initialize: function() {
		
			/**
			 * The model bound to the controller
			 * @property model
			 * @type Counter
			 */
			this.model.on('change', this.updateCounter, this);

			/**
			 * The view (DOM node) associated to the controller
			 * @property model
			 * @type jQuery Object
			 */
			this.$el.on("click", this.scrollToList);
		},


		/**
		 * @method scrollToList
		 * @param event {Event} The jQuery event fired after a constraint has been clicked
		 */
		scrollToList: function(event) {
			event.preventDefault();

			var linkCounter = $(this);

			var section = linkCounter.attr('href');
			var sectionPosition = Math.floor($(section).offset().top);

			$('html, body').animate({scrollTop: sectionPosition}, UP.constants.FADE_SPEED);
		},
		
		
		/**
		 * @method updateCounter
		 */
		updateCounter: function() {
			var newValue = this.model.get('value');
			this.$el.find('.filter-count').text(newValue);
		}
		
	});


	
	/**
	 * @module UP
	 * @submodule Controllers
	 * @class TotalCounterController
	 * @extends Backbone.Controller
	 */	
	UP.TotalCounterController = Backbone.Controller.extend({
	
		/**
		 * @method initialize
		 * @constructor
		 */
		initialize: function() {
			this.model.on('change', this.updateCounter, this);
		},

		
		/**
		 * @method updateCounter
		 */
		updateCounter: function() {
			var newValue = this.model.get('value');
			this.$el.find('.filter-count').text(newValue);
		}
		
	});
	
	
	
	/**
	 * @module UP
	 * @submodule Controllers
	 * @class MethodController
	 * @extends Backbone.Controller
	 */	
	UP.MethodController = Backbone.Controller.extend({
	
		/**
		 * @method initialize
		 * @constructor
		 */
		initialize: function() {
		
		    /**
			 * @property model
			 * @type Method
			 */
			this.model      = this.options.model;

			/**
			 * @property methodView
			 * @type jQuery Object
			 */
			this.methodView = this.options.methodView;
			
			/**
			 * @property planView
			 * @type jQuery Object
			 */
			this.planView   = this.options.planView;


			// Observing model
			this.model.on('render', this.render, this);
			this.model.on('updatePosition', this.updatePosition, this);
			this.model.on('hideMethod', this.hideMethod, this);
			this.model.on('showNeutral', this.showNeutral, this);


			// Event Handlers

			var self = this;
			function checkboxAnimation(e) {
				self.checkboxEvent(e);
			}

			this.methodView.find('.checkboxWrapper').on("click", checkboxAnimation);
			this.planView.find('.checkboxWrapper').on("click", checkboxAnimation);

			this.methodView.find('.method-info').on("click", this.displayInfoEvent);
			this.planView.find('.method-info').on("click", this.displayInfoEvent);


			// Initialize visual text description

			var description = this.model.getDescription();
			this.methodView.find('.method-description').text( description );
			this.planView.find('.method-description').text( description );

		},

		
		/**
		 * @method render
		 */
		render: function() {
			var color;
			var textValue = "";

			var newValue = this.model.getValue();

			if (newValue >= 0.8) {
				textValue = UP.constants.VALUE[0];
				color = "green";
			} else if (newValue >= 0.6) {
				textValue = UP.constants.VALUE[1];
				color = "greenyellow";
			} else if (newValue >= 0.4) {
				textValue = UP.constants.VALUE[2];
				color = "yellow";
			} else if (newValue >= 0.2) {
				textValue = UP.constants.VALUE[3];
				color = "orange";
			} else if (newValue > 0) {
				textValue = UP.constants.VALUE[4];
				color = "red";
			} else if (newValue == 0) {
				textValue = UP.constants.VALUE[3];
				color = "orange";
			}

			this.methodView.find('.valoration').text(textValue);
			this.methodView.find('.bar').attr('class', 'bar').addClass(color);

			this.planView.find('.valoration').text(textValue);
			this.planView.find('.bar').attr('class', 'bar').addClass(color);

			
		},


		/**
		 * @method updatePosition
		 */
		updatePosition: function() {
			this.methodView.parent().prepend(this.methodView);
			this.planView.parent().prepend(this.planView);
		},


		/**
		 * @method hideMethod
		 * @param event {Event} The jQuery event fired
		 */
		hideMethod: function(event) {
			if ( this.model.getValue() == 0 ) {
				this.showNeutral();
			} else {
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
			}
		},

		
		/**
		 * @method showNeutral
		 */
		showNeutral: function() {
			this.methodView.removeClass('hidden').addClass('visible').removeClass('last-method');
			this.planView.removeClass('hidden').addClass('visible').removeClass('last-method');

			this.model.selectMethod();
		},

		
		/**
		 * @method checkboxEvent
		 * @param event {Event} The jQuery event fired
		 */
		checkboxEvent: function(event) {
			event.preventDefault();

			var checkbox = this.methodView.find('.checkboxWrapper');
			activateCheckbox(checkbox);

			var method = checkbox.parent('.method');
			this.disableMethodAnimation(method);

			this.model.changeSelection();
			this.planView.toggleClass('visible hidden');
		},
		
		
		/**
		 * @method displayInfoEvent
		 */
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

		
		/**
		 * @method disableMethodAnimation
		 * @param li {jQuery Object} The method which receives a graphic animation
		 */
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


		/**
		 * @method isSelected
		 * @return selected {boolean} returns a boolean value which express whereas the method is selected or not
		 */
		 // deprecated ???
		isSelected: function() {
			//return this.model.get('selected');
			return this.model.isSelected();
		},

		
		/**
		 * @method isVisible
		 * @return visible {boolean} returns a boolean value which express whereas the method is visible or not
		 */
		isVisible: function() {
			return this.methodView.hasClass('visible');
		}

	});


	/**
	 * @module UP
	 * @submodule Controllers
	 * @class SubactivityController
	 * @extends Backbone.Controller
	 */	
	UP.SubactivityController = Backbone.Controller.extend({
	
		/**
		 * @method initialize
		 * @constructor
		 */
		initialize: function() {
		
			/**
			 * @property model
			 * @type Subactivity
			 */
			this.model    = this.options.model;
			
			/**
			 * @property item
			 * @type jQuery Object
			 */
			this.item     = this.options.item;
			
			/**
			 * @property list
			 * @type jQuery Object
			 */
			this.list     = this.options.list;
			
			/**
			 * @property listPlan
			 * @type jQuery Object
			 */
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

		
		/**
		 * @method isVisible
		 */
		displayList: function() {
			var checkbox = this.item.find('.checkboxWrapper');
			activateCheckbox(checkbox);
			
			this.list.toggleClass('hidden');
			this.listPlan.toggleClass('hidden');

			constraintsSelectionFix();
		},
		
		
		/**
		 * @method expandList
		 */
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

		
		/**
		 * @method slideUp
		 * @param headerVisible {boolean} 
		 */
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

		
		/**
		 * @method slideDown
		 * @param headerVisible {boolean} 
		 */
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

		
		/**
		 * @method updateLastMethod
		 */
		updateLastMethod: function() {
			this.list.find('.visible').last().addClass('last-method');
			this.listPlan.find('.visible').last().addClass('last-method');
		},

		// deprecated ???
		isSelected: function() {
			//return this.model.get('selected');
			return this.model.isSelected();
		},

		
		// deprecated ???
		/**
		 * @method addClassIfLast
		 */
		addClassIfLast: function() {
			
			var subs = $('.info-subactivity').not('hidden');
			if ( this.list == subs.last() ) {
				this.list.addClass('last-subactivity');
			}
		}

	});

	
	
	/**
	 * @module UP
	 * @submodule Controllers
	 * @class ActivityController
	 * @extends Backbone.Controller
	 */	
	UP.ActivityController = Backbone.Controller.extend({
	
		/**
		 * @method initialize
		 * @constructor
		 */
		initialize: function() {
		
			/**
			 * @property model
			 * @type Activity
			 */
			this.model    = this.options.model;				// The Activity Model
			
			/**
			 * @property block
			 * @type jQuery Object
			 */
			this.block    = this.options.block;				// View: Panel with the description on 'Activities' Window
			
			/**
			 * @property tab
			 * @type jQuery Object
			 */
			this.tab      = this.options.tab;					// View: Tab above the panel
			
			/**
			 * @property list
			 * @type jQuery Object
			 */
			this.list     = this.options.list;					// View: Subactivities List on 'Methods' Window
			
			/**
			 * @property listPlan
			 * @type jQuery Object
			 */
			this.listPlan = this.options.listPlan;				// View: Subactivities List on 'Plan' Window

			/**
			 * @property expandButton
			 * @type jQuery Object
			 */
			this.expandButton   = $('#expand');
			
			/**
			 * @property collapseButton
			 * @type jQuery Object
			 */
			this.collapseButton = $('#collapse');

			/**
			 * @property subactivities
			 * @type Array[Subactivity]
			 */
			this.subactivities = [];

			
			
			this.model.on('hideHeader', this.hideHeader, this);
			this.model.on('showHeader', this.showHeader, this);


			// Handle Events
			var self = this;

			this.expandButton.on("click", function(event) {
				self.expandButtonEvent(event);
			});
			
			this.collapseButton.on("click", function(event) {
				self.collapseButtonEvent(event);
			});

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

		
		/**
		 * @method hideHeader
		 */
		hideHeader: function() {
			this.list.children('.expandable').addClass('hidden');
			this.listPlan.children('.expandable').addClass('hidden');
		},

		
		/**
		 * @method showHeader
		 */
		showHeader: function() {
			this.list.children('.expandable').removeClass('hidden');
			this.listPlan.children('.expandable').removeClass('hidden');
		},

		
		/**
		 * @method displayActivityEvent
		 */
		displayActivityEvent: function() {
			this.hideRestOfActivities();
			this.tab.addClass('tab-active');

			this.block.removeClass('hidden');
		},

		
		/**
		 * @method expandList
		 */
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

		
		/**
		 * @method collapseList
		 */
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

		
		/**
		 * @method hideRestOfActivities
		 */
		hideRestOfActivities: function() {
			for (var i=0; i < this.activities.length; i++) {
				var view = this.activities[i];
				if (this != view) {
					view.hideActivity();
				}
			}
		},
		
		
		/**
		 * @method hideActivity
		 */
		hideActivity: function() {
			this.tab.removeClass('tab-active');
			this.block.addClass('hidden');
		},

		
		/**
		 * @method expandButtonEvent
		 * @param event {Event} The jQuery event fired
		 */
		expandButtonEvent: function(event) {
			this.expandList();
		},

		
		/**
		 * @method collapseButtonEvent
		 * @param event {Event} The jQuery event fired
		 */
		collapseButtonEvent: function(event) {
			this.collapseList();
		},


		/**
		 * @method setSubactivities
		 * @param subactivities {Array[SubactivityController]} 
		 */
		setSubactivities: function(subactivities) {
			this.subactivities = subactivities;
		},

		
		/**
		 * @method setActivities
		 * @param activities {Array[ActivityController]} 
		 */
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
