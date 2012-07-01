	
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
			
			this.config = {		/* Slider Widget Configuration Setup */
				orientation: "horizontal",
				range: "min",
				min: 0,
				max: UP.constants.VALUE.length-2,
				value: this.sliderValue,
				animate: true,
				slide: function(event, ui) {	// Event function to perfom
					self.updateValue(ui.value);
				}
			};

			this.sliderView.slider( this.config );

			this.model.on('render', function() {
				var newValue = self.model.getValue();
				self.config["value"] = newValue;
				self.sliderView.slider( self.config );
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
	 * @class CostBenefitController
	 * @extends Backbone.Controller
	 */	
	UP.CostBenefitController = Backbone.Controller.extend({

		initialize: function() {
			this.model.on('allSelected', this.checkInput, this);
			//this.model.on('checkInput', this.checkInput, this);
		},

		events: {
			"click" : "costBenefitSelected"
		},
		
		
		/**
		 * @method costBenefitSelected
		 * @param event {Event} The jQuery event fired after a constraint has been clicked
		 */
		costBenefitSelected: function(event) {
			this.model.changeSelection();
		},


		checkInput: function() {
			activateCheckbox(this.$el);
		}
		
	});


	
	/** 
	 * @module UP
	 * @submodule Controllers
	 * @class CostBenefitController
	 * @extends Backbone.Controller
	 */	
	UP.CostBenefitChildController = UP.CostBenefitController.extend({

		initialize: function() {
			//this.model.on('change:visible', this.display, this);
			this.model.on('checkInput', this.checkInput, this);
			this.model.on('uncheckInput', this.uncheckInput, this);
		},

		events: {
			"click" : "costBenefitSelected"
		},
		
		
		/**
		 * @method costBenefitSelected
		 * @param event {Event} The jQuery event fired after a constraint has been clicked
		 */
		costBenefitSelected: function(event) {
			this.model.changeSelection();
		},


		checkInput: function() {
			var row = this.$el.parent('.row-subactivity');
			if ( !row.hasClass('hidden') ) {
				this.model.setVisible(true);
				this.$el.attr({ 'checked' : true });
			}
		},

		
		uncheckInput: function() {
			this.$el.removeAttr('checked');
		}
		
	});
	


	/**
	 * @module UP
	 * @submodule Controllers
	 * @class ConstraintController
	 * @extends Backbone.Controller
	 */	
	UP.ConstraintController = Backbone.Controller.extend({

		initialize: function() {
			this.model.on('change:selected', this.activate, this);
		},
	
		events: {
			"click .label-constraint" : "constraintSelected",
			"click input"             : "constraintSelected"
		},
		
		
		/**
		 * @method constraintSelected
		 * @param event {Event} The jQuery event fired after a constraint has been clicked
		 */
		constraintSelected: function(event) {
			this.model.changeSelection();
		},

		activate: function() {
			var input = this.$el.find('input');
			activateCheckbox(input);
		},
		
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
		
			this.view = this.options.view;


			this.viewPlan = this.options.viewPlan;


			/**
			 * The model bound to the controller
			 * @property model
			 * @type Counter
			 */
			this.model.on('change', this.updateCounter, this);

		},
		
		
		/**
		 * @method updateCounter
		 */
		updateCounter: function() {
			var newValue = this.model.get('value');
			this.view.text(newValue);
			this.viewPlan.text(newValue);
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
			this.model.on('disable', this.disableMethodAnimation, this);
			this.model.on('enable', this.enableMethodAnimation, this);


			// Event Handlers

			var self = this;
			function checkboxAnimation() {
				self.checkboxEvent();
			}

			this.methodView.find('input').on("click", checkboxAnimation);
			this.planView.find('input').on("click", checkboxAnimation);

			this.methodView.find('.method-info').on("click", this.displayInfoEvent);
			this.planView.find('.method-info').on("click", this.displayInfoEvent);

			this.initializeURL();
		},


		initializeURL: function() {
			var name = this.model.getName();
			var description = '<p>' + this.model.getDescription() + '</p>';
			var url = this.model.getURL();

			if (url != "") {
				var texturl = '<a target="_blank" href="' + url + '">More Information on ' + name + '</a>';
				description += texturl;
			}

			this.methodView.find('.method-description').html( description );
			this.planView.find('.method-description').html( description );
		},		


		/**
		 * @method render
		 */
		render: function() {
			var VALUE = UP.constants.VALUE;
			var textValue = this.model.getTextValue();
			var color;

			switch ( textValue ) {
				case VALUE[0] : color = "green";         break;
				case VALUE[1] : color = "greenyellow";   break;
				case VALUE[2] : color = "yellow";        break;
				case VALUE[3] : color = "orange";        break;
				case VALUE[4] : color = "red";           break;
				case VALUE[5] : color = "red";           break;
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
			var VALUES = UP.constants.VALUE;

			var sliderValue = event.sliderValue;

			this.methodView.addClass('hidden').removeClass('visible first last');
			this.planView.addClass('hidden').removeClass('visible first last');

			this.model.unselectMethod();

			var stringValue = this.model.getTextValue();

			for ( var j=0; j <= sliderValue && j < VALUES.length; j++ ) {
				if ( stringValue === VALUES[j] ) {
					this.methodView.removeClass('hidden').addClass('visible');
					this.planView.removeClass('hidden').addClass('visible');
					this.model.selectMethod();
				}
			}

		},

		
		/**
		 * @method showNeutral
		 */
		showNeutral: function() {
			this.methodView.addClass('visible').removeClass('hidden first last');
			this.planView.addClass('visible').removeClass('hidden first last');

			this.model.selectMethod();
		},


		/**
		 * @method showNeutral
		 */
		showLast: function() {
			this.methodView.addClass('visible').removeClass('hidden first last');
			this.planView.addClass('visible').removeClass('hidden first last');

			this.model.selectMethod();
		},


		/**
		 * @method checkboxEvent
		 * @param event {Event} The jQuery event fired
		 */
		checkboxEvent: function() {
			this.model.changeSelection();
			this.planView.toggleClass('visible hidden');

//			if ( !this.model.isEnabled() ) {
				this.disableMethodAnimation();
//			}
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
		disableMethodAnimation: function() {
			var disabled = 'disabled';
			var hidden   = 'hidden';

			var FADE_SPEED = UP.constants.FADE_SPEED;
			var DISABLED_OPACITY = UP.constants.DISABLED_OPACITY;

			var li    = this.methodView;
			var bar   = li.find('.bar');
			var input = li.find('input');

			if ( this.model.isEnabled() ) {
				this.planView.removeClass( hidden );
				li.removeClass( disabled );
				li.animate({opacity: '1'}, FADE_SPEED);
				bar.animate({opacity: '1'}, FADE_SPEED);
				input.attr({'checked' : true});

			} else {
				this.planView.addClass( hidden );
				li.addClass( disabled );
				li.animate({opacity: DISABLED_OPACITY}, FADE_SPEED);
				bar.animate({opacity: DISABLED_OPACITY}, FADE_SPEED);
				input.removeAttr('checked');
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
		},


		showFirst: function() {
			this.addClass('first');
		},


		showLast: function() {
			this.addClass('last');
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

			/**
			 * @property listPlan
			 * @type jQuery Object
			 */
			this.row = this.options.row;



			// Handle Events
			var self = this;

			this.model.on('updateLastMethod', this.updateLastMethod, this);
			this.model.on('changeDisplayList', this.displayList, this);
			this.model.on('change:costValue', this.showCostValue, this);

			function selectSubactivity() {
				var element = $(this);
				self.selectList();
			}

			this.item.find('input').on('click', selectSubactivity);
			this.item.find('label').on('click', selectSubactivity);


			function expandAnimation() {
				self.expandList();
			}

			this.list.find('.expandable').on('click', expandAnimation);
			this.listPlan.find('.expandable').on('click', expandAnimation);
		},


		showCostValue: function() {
			var costValue = this.model.getCostValue() - 100;
			
			var costBenefit = this.listPlan.find('.cost-indicator');
			costBenefit.html("");

			var child = '<li class="dollar left"></li>';
			for (var i=0; i < costValue; i++) {
				costBenefit.append( child );
			}
		},


		checkSubactivity: function() {
			var input = this.item.find('input');

			if ( this.model.isSelected() ) {
				input.attr({ 'checked' : true });
			} else {
				input.removeAttr('checked');
			}
		},


		selectList: function(element) {
			this.model.changeSelection();	// Actualizar el modelo de 'Subactivity' llamando a su método select
			this.displayList();
		},


		/**
		 * @method isVisible
		 */
		displayList: function() {
			var hidden = 'hidden';

			if ( this.model.isSelected() ) {
				this.list.removeClass( hidden );
				this.listPlan.removeClass( hidden );
				this.row.removeClass( hidden );
			} else {
				this.list.addClass( hidden );
				this.listPlan.addClass( hidden );
				this.row.addClass( hidden );
			}

			this.checkSubactivity();
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
			var selected = this.model.isSelected();
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
			this.list.find('.visible').last().addClass('last');
			this.listPlan.find('.visible').last().addClass('last');
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
			this.tab      = this.options.tab;				// View: Tab above the panel
			
			/**
			 * @property list
			 * @type jQuery Object
			 */
			this.list     = this.options.list;				// View: Subactivities List on 'Methods' Window
			
			/**
			 * @property listPlan
			 * @type jQuery Object
			 */
			this.listPlan = this.options.listPlan;				// View: Subactivities List on 'Plan' Window

			/**
			 * @property row
			 * @type jQuery Object
			 */
			this.row = this.options.row;					// View: Subactivities Row on CostBenefits Panel

			/**
			 * @property link
			 * @type jQuery Object
			 */
			this.link = this.options.link;					// View: Subactivities Link on 'Methods' Window

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

			

			// Model Events 
			
			this.model.on('showActivityRow', this.showActivityRow, this);
			this.model.on('hideActivityRow', this.hideActivityRow, this);

			this.model.on('hideHeader', this.hideHeader, this);
			this.model.on('showHeader', this.showHeader, this);


			// Handle View Events

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


			this.link.on('click', this.scrollToList);
			this.linksActivities = $('.links-activities');

		},


		showActivityRow: function() {
			this.row.removeClass('hidden');
		},


		hideActivityRow: function() {
			this.row.addClass('hidden');
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
			this.linksActivities.show(UP.constants.FADE_SPEED);
		},

		
		/**
		 * @method collapseButtonEvent
		 * @param event {Event} The jQuery event fired
		 */
		collapseButtonEvent: function(event) {
			this.collapseList();
			this.linksActivities.hide(UP.constants.FADE_SPEED);
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


	function activateCheckbox(input) {
		var checked = input.attr('checked');

		if ( checked ) {
			input.removeAttr('checked');
		} else {
			input.attr({ 'checked' : true });
		}
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
