	
	/**
	 * @module UP
	 * @submodule Util
	 * @class XMLParser
	 * @extends Backbone.Model
	 */	
	UP.XMLParser = Backbone.Model.extend({
	
		/**
		 * @method initialize
		 * @param pathToXML {string}
		 * @constructor
		 */
		initialize: function(pathToXML) {
		
			this.set({
			
				/**
				 * @property xmlPath
				 * @type string
				 */
				"xmlPath" : pathToXML
			});
			
		},
/*
		getRemoteXML: function() {
			var xml  = this.get('xmlPath');
			var self = this;
			var xmlD;

			$.get(xml, function(xmlDocument) {
				xmlD = xmlDocument;
				self.set({
					"xml" : $(xmlDocument)
				});
			});

			this.set({
				"xml" : xmlD
			});

		},
*/

		/**
		 * @method parseConstraints
		 * @param constraintCollection {ConstraintCollection}
		 */
		parseConstraints: function(constraintCollection) {
			var $DOMConstraints = $('.constraint');					// Getting the DOM constraints

			this.get('xml').find('constraints').find('constraint').each(function(i) {
				var self = $(this);
				var name = self.attr('name');
				var description = self.attr('description');

				// Creating a new constraint model object
				var constraintModel = new UP.Constraint(name, description);
				constraintCollection.add(constraintModel);

				// Creating a new constraint view object
				var constraintView       = $DOMConstraints.eq(i);
				var constraintController = new UP.ConstraintController({
					model: constraintModel, 
					el: constraintView
				});

			}); // end of 'constraint' parsing
		},

		
		/**
		 * @method parseMethodModels
		 * @param methodCollection {MethodCollection}
		 */
		parseMethodModels: function(methodCollection) {
			this.get('xml').find('methods').find('methodInfo').each(function(i) {
				var self = $(this);
				var name        = self.attr('name');
				var description = self.attr('description');
				var url         = self.attr('url');

				// Creating a new constraint model object
				var methodModel = new UP.Method(name, description, url);
				methodCollection.add(methodModel);

			}); // end of 'method' parsing
		},

		
		/**
		 * @method createTotalCounter
		 * @return totalCounter {TotalCounter}
		 */
		createTotalCounter: function() {
			var totalCounter      = new UP.TotalCounter();

			var totalCounterController  = new UP.TotalCounterController({
				model: totalCounter,
				el: $('.total-counter')
			});

			return totalCounter;
		},


		/**
		 * @method parse
		 * @return newPlan {Plan}
		 */
		parse: function() {

	//		this.getRemoteXML();		// Getting the XML Document we are going to parse by AJAX 

			var self = this;
			var xmlPath = this.get('xmlPath');

			var constraintCollection = new UP.ConstraintCollection();
			var activityCollection = new UP.ActivityCollection();

			$.get(xmlPath, function(xmlDocument) {
				self.set({
					"xml" : $(xmlDocument)
				});

				// Parsing constraints in XML file
				self.parseConstraints(constraintCollection);


				// Parsing methods in XML file to build only Method Models
				var methodCollection = new UP.MethodCollection();
				self.parseMethodModels(methodCollection);


				// Parsing activities in XML file

				var $DOMActivities         = $('.activity');
				var $DOMActivitiesList     = $('#methods').find('.info-activity');
				var $DOMActivitiesListPlan = $('#plan').find('.info-activity');
				var $DOMActivitiesTab      = $('.tab');
				var $DOMActivitiesCounter  = $('.counter');

				var arrayActivityControllers = [];

				var totalCounter = self.createTotalCounter();

				self.get('xml').find('activity').each(function(i) {
					var self = $(this);
					var name          = self.attr('name');
					var description   = self.attr('description');
					var subactivities = self.find('subactivity');

					var $DOMSubactivities         = $DOMActivities.eq(i).find('.subactivity');
					var $DOMSubactivitiesList     = $DOMActivitiesList.eq(i).find('.info-subactivity');
					var $DOMSubactivitiesListPlan = $DOMActivitiesListPlan.eq(i).find('.info-subactivity')

					var subactivitiesCollection = new UP.SubactivityCollection();

					var arraySubactivityControllers = [];

					// Parsing subactivities in XML file

					subactivities.each(function(j) {
						var self = $(this);
						var name        = self.attr('name');
						var description = self.attr('description');
						var methods     = self.find('method');

						var subactivityMethods  = new UP.MethodCollection();

						var $DOMMethods     = $DOMSubactivitiesList.eq(j).find('.method');
						var $DOMMethodsPlan = $DOMSubactivitiesListPlan.eq(j).find('.method');

						// Parsing methods in XML file

						methods.each(function(k) {
							var self = $(this);
							var name = self.attr('name');
							var description = "";
							var url = "";
							var constraints = self.find('constraint');

							methodCollection.each(function(method) {
								if ( method.compareNameWith(name) ) {
									description = method.getDescription();
									url = method.getURL();
									method.clear();
								}
							});

							var method = new UP.Method(name, description, url);
							subactivityMethods.add( method );


							constraints.each(function(l) {
								var self        = $(this);
								var name        = self.attr('name');
								var weightValue = parseInt(self.attr('weight'));

								var weight = new UP.Weight(method, weightValue);
								method.addWeight( weight );

								constraintCollection.each(function(constraint) {
									if ( constraint.compareNameWith(name) ) {
										constraint.addWeight( weight );
									}
								});
							});


							var methodView     = $DOMMethods.eq(k);
							var methodPlanView = $DOMMethodsPlan.eq(k);						

							new UP.MethodController({
								model: method,
								methodView: methodView,
								planView: methodPlanView
							});

						});

						var subactivity = new UP.Subactivity(name, description, subactivityMethods);			// Creating a new 'Subactivity' model object

						subactivitiesCollection.add(subactivity);			// Adding the 'Subactivity' object to the collection

						var subItem     = $DOMSubactivities.eq(j);
						var subList     = $DOMSubactivitiesList.eq(j);
						var subListPlan = $DOMSubactivitiesListPlan.eq(j);

						var subactivityController = new UP.SubactivityController({		// Creating a new 'Subactivity' controller object
							model: subactivity,
							item: subItem,
							list: subList,
							listPlan: subListPlan
						});

						arraySubactivityControllers.push(subactivityController);
					});

					// Creating the counter for each activity
					var counter = new UP.Counter(totalCounter);

					var counterView = $DOMActivitiesCounter.eq(i);

					var counterController  = new UP.CounterController({
						model: counter,
						el: counterView
					});

					// Creating a new 'Activity' model object
					var activity = new UP.Activity(name, description, counter, subactivitiesCollection);		// Creating a new 'Activity' model object
					activityCollection.add(activity);

					// Activity Views					
					var actBlock    = $DOMActivities.eq(i);
					var actList     = $DOMActivitiesList.eq(i);
					var actListPlan = $DOMActivitiesListPlan.eq(i);
					var actTab      = $DOMActivitiesTab.eq(i);

					// Creating a new activity controller object
					var activityController = new UP.ActivityController({			// Creating a new 'Activity' controller object
						model: activity,
						block: actBlock,
						tab: actTab,
						list: actList,
						listPlan: actListPlan
					});

					activityController.setSubactivities(arraySubactivityControllers);
					arrayActivityControllers.push(activityController);

				}); // end of 'activities' parsing


				// Once all the activities have been stored, the array will be passed to every activity
				// This happens because every activity needs to have a reference to all of them
				// And later, when an activity tab is clicked, the rest os activities will be hidden
				for (var i=0; i<arrayActivityControllers.length; i++) {
					var act = arrayActivityControllers[i];
					act.setActivities(arrayActivityControllers);
				}
				
			});	// $.get

			return new UP.Plan(constraintCollection, activityCollection);
		}

	});
