
	UP.App = Backbone.Controller.extend({
		initialize: function(window) {
			this.window = window;
			this.sliderController = new UP.SliderView({ model: new UP.Slider() });
			this.constraintsCol = new UP.ConstraintCollection();
			this.activitiesCol  = new UP.ActivityCollection();
			this.allMethodsCol = new UP.MethodCollection();


			// Parsing XML
			this.parseXML('xml/projectStagesDataDevelopers.xml');


			// Caching View Elements
			this.stages   = $('.stage');
			this.backLink = $('.back');	
			this.nextLink = $('.next');	
			this.container = $('.container'); 
			this.contents = this.container.find('.main-content');
			this.currentStage  = 0;
			this.mainContainer = $('.main-container');


			// Handle Events
			this.setupEvents();


			// Initialization Effect
			var totalWidth = this.mainContainer.width() * this.contents.length;
			this.container.width(totalWidth);
	
			var firstHeight = this.contents.height();
			this.container.height(firstHeight);
		},

		parseXML: function(pathToXML) {
		var app = this;
		$.get(pathToXML, function(xml) {
			// Caching XML object
			var $xml = $(xml);

			// Parsing constraints in XML file

			var $DOMConstraints = $('.constraint');					// Getting the DOM constraints

			$xml.find('constraints').find('constraint').each(function(i) {
				var self = $(this);
				var name = self.attr('name');
				var description = self.attr('description');

				// Creating a new constraint model object
				var cmodel = new UP.Constraint(name, description);
				app.constraintsCol.add(cmodel);

				// Creating a new constraint view object
				var cnode = $DOMConstraints.eq(i);
				var cview = new UP.ConstraintView({
					model: cmodel, 
					el: cnode
				});

			}); // end of 'constraint' parsing

			// Parsing activities in XML file

			var $DOMActivities        = $('.activity');
			var $DOMActivitiesList    = $('.info-activity');
			var $DOMActivitiesTab     = $('.tab');
			var $DOMActivitiesCounter = $('.counter');

			var arrayActivityViews = [];

			var totalcounter      = new UP.Counter();			// Creating the Total Counter
			var totalcounterView  = new UP.TotalcounterView({
				model: totalcounter,
				el: $('.total-counter')
			});

			$xml.find('activity').each(function(i) {
				var self = $(this);
				var name          = self.attr('name');
				var description   = self.attr('description');
				var subactivities = self.find('subactivity');

				var $DOMSubactivities       = $DOMActivities.eq(i).find('.subactivity');
				var $DOMSubactivitiesList   = $DOMActivitiesList.eq(i).find('.info-subactivity');
				var subactivitiesCol        = new UP.SubactivityCollection();

				var arraySubactivityViews = [];

				// Parsing subactivities in XML file

				subactivities.each(function(j) {
					var self = $(this);
					var name        = self.attr('name');
					var description = self.attr('description');
					var methods     = self.find('method');

					var $DOMMethods = $DOMSubactivitiesList.eq(j).find('.method');
					var methodsCol  = new UP.MethodCollection();

					// Parsing methods in XML file

					methods.each(function(k) {
						var self = $(this);
						var name        = self.attr('name');
						var description = self.attr('description');
						var constraints = self.find('constraint');

						var weightsCol  = new UP.WeightCollection();

						constraints.each(function(l) {
							var self = $(this);
							var name        = self.text();
							var weightValue = parseInt(self.attr('weight'));

							app.constraintsCol.each(function(c) {
								if (c.get('name') == name) {
									var weight = new UP.Weight(c, weightValue);
									weightsCol.add(weight);
								}
							});	
										

						});


						var mmodel = new UP.Method(name, description, weightsCol);
						methodsCol.add(mmodel);
						app.allMethodsCol.add(mmodel);	// La coleccion de todos los metodos

						var mitem = $DOMMethods.eq(k);
						var mview  = new UP.MethodView({
							model: mmodel,
							el: mitem
						});
					});

					var smodel = new UP.Subactivity(name, description, methodsCol);			// Creating a new 'Subactivity' model object

					subactivitiesCol.add(smodel);			// Adding the 'Subactivity' object to the collection

					var sitem = $DOMSubactivities.eq(j);
					var slist = $DOMSubactivitiesList.eq(j);
					var sview = new UP.SubactivityView({		// Creating a new 'Subactivity' controller object
						model: smodel,
						item: sitem,
						list: slist
					});

					arraySubactivityViews.push(sview);
				});

				// Creating a new 'Activity' model object
				console.log(subactivitiesCol);
				var amodel = new UP.Activity(name, description, subactivitiesCol);		// Creating a new 'Activity' model object
				app.activitiesCol.add(amodel);							// Adding the 'Activity' object to the collection

				// Creating a new activity view object
				var ablock   = $DOMActivities.eq(i);
				var alist    = $DOMActivitiesList.eq(i);
				var atab     = $DOMActivitiesTab.eq(i);
				var acounter = $DOMActivitiesCounter.eq(i);
				var aview    = new UP.ActivityView({			// Creating a new 'Activity' controller object
					model: amodel,
					block: ablock,
					list: alist,
					tab: atab,
					counter: acounter
				});

				aview.setSubactivities(arraySubactivityViews);

				arrayActivityViews.push(aview);

				var cmodel = new UP.Counter();			// Creating the counter for each activity
				var cview  = new UP.CounterView({
					model: cmodel,
					el: acounter,
					totalcounter: totalcounterView
				});

			}); // end of 'activities' parsing


			// Once all the activities have been stored, the array will be passed to every activity
			// This happens because every activity needs to have a reference to all of them
			// And later, when an activity tab is clicked, the rest os activities will be hidden
			for (var i=0; i<arrayActivityViews.length; i++) {
				var view = arrayActivityViews[i];
				view.setActivities(arrayActivityViews);
			}


		}); // end of ajax-get request


		},

		setupEvents: function() {
			// Event Handlers
			var self = this;

			this.stages.on("click", function(event) {
				var stageSelected = $(this);
				self.stagesEvent(event, stageSelected);
			});

			this.backLink.on("click", function(event) {
				self.backLinkEvent(event)
			});

			this.nextLink.on("click", function(event) {
				self.nextLinkEvent(event)
			});


			$(this.window).on('resize', function() {
				var mainContainerWidth = self.mainContainer.width();

				self.contents.width(mainContainerWidth);
				var width = mainContainerWidth * 3;
				self.container.width(width);
				var pos = (mainContainerWidth + 1) * -self.currentStage;
				self.container.css({marginLeft: pos});
			});

			$(this.window).trigger('resize');

			self.constraintsCol.on('change', function() {
				self.allMethodsCol.each(function(method) {
					method.calculateValue();
				});
				self.allMethodsCol.sort();
				self.allMethodsCol.each(function(method) {
					method.updateView();
				});
			});


			/*
			self.constraintsCol.on('change', function() {
				var activities = self.activitiesCol.models;
				for ( var i=0; i < activities.length; i++ ) {
					var activity = activities[i];
					var subactivities = activity.get('subactivitiesCol').models;
					for ( var j=0; j < subactivities.length; j++ ) {
						var subactivity = subactivities[j];
						var methods = subactivity.get('methodsCol').sort().models;
						for ( var k=0; k < methods.length; k++ ) {
							var method = methods[k];
							//method.updateView();
							method.calculateValue();
						}
					}
				}
			});
			*/
		},

		animate: function(newIndex, oldIndex) {
			var SPEED = UP.constants.STAGES_SPEED;

			this.stages.eq(oldIndex).removeClass('current-stage');   // Old tab
			this.stages.eq(newIndex).addClass('current-stage');	 // New tab
		
			var height = this.contents.eq(newIndex).height();
			var pos = (this.mainContainer.width()+1) * -newIndex;
			this.container.stop().animate({marginLeft: pos, height: height}, SPEED);
		},

		stagesEvent: function(event, stageSelected) {
			event.preventDefault();
	
			var newPosition = stageSelected.prevAll().length;
			this.animate(newPosition, this.currentStage);
		
			this.currentStage = newPosition;		// Updating to the new current stage
		},

		backLinkEvent: function(event) {
			event.preventDefault();

			if (this.currentStage > 0) {
				var oldStage = this.currentStage;
				this.currentStage--;
				this.animate(this.currentStage, oldStage);
			}
		},

		nextLinkEvent: function(event) {
			event.preventDefault();

			if (this.currentStage < this.stages.length-1) {
				var oldStage = this.currentStage;
				this.currentStage++;
				this.animate(this.currentStage, oldStage);
			}
		},

	});

	// Starting out the system
	var App = new UP.App(window);

	