	
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
				"xmlPath"   : pathToXML,

				/**
				 * @property tableRows
				 * @type jQuery Nodes Collection
				 */
				"tableRows" : $('#costs-selection').find('tbody').find('tr')

			});
			
		},


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

				// Creating a new Constraint model object
				var constraintModel = new UP.Constraint(name, description);
				constraintCollection.add(constraintModel);

				// Creating a new ConstraintController object
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

				// Creating a new Method model object
				var methodModel = new UP.Method(name, description, url);
				methodCollection.add(methodModel);

			}); // end of 'method' parsing
		},


		/**
		 * @method parseMethodModels
		 * @param methodCollection {MethodCollection}
		 */
		parseCostBenefitsModels: function(costBenefitCollection) {
			this.get('xml').find('costBenefits').find('costBenefit').each(function(i) {
				var self = $(this);
				var name        = self.attr('name');
				var description = self.attr('description');

				// Creating a new CostBenefit model object
				var costBenefit = new UP.CostBenefit(name, description);
				costBenefitCollection.add(costBenefit);

			}); // end of parsing
		},


		/**
		 * @method findCoord
		 * @param i {Number}
		 * @return coord {Number}
		 */		
		findCoord: function(i) {
			if ( i == 0 ) {
				return 0;
			}

			var activity = this.get('xml').find('activity').eq(i-1);
			var num = activity.find('subactivity').length;

			return num + this.findCoord(i-1) + 1;
		},


		/**
		 * @method findCostBenefitInput
		 * @param i {Number}
		 * @param j {Number}
		 * @param k {Number}
		 * @return input {jQuery Node}
		 */		
		findCostBenefitInput: function(i, j, k) {
			var coord = this.findCoord(i) + j + 1;

			var row = this.get('tableRows').eq(coord);
			var input = row.find('input').eq(k);
			return input;
		},


		/**
		 * @method findCostBenefitInput
		 * @param i {Number}
		 * @param j {Number}
		 * @param k {Number}
		 * @return input {jQuery Node}
		 */		
		findCostBenefitActivities: function(numAct, costBenefitCollection) {
			var rows   = this.get('tableRows').filter('.row-activity');
			var inputs = rows.eq(numAct).find('input');

			for (var i=0; i < costBenefitCollection.length; i++) {
				var costBenefit = costBenefitCollection.at(i);
				var costBenefitView = inputs.eq(i);

				new UP.CostBenefitController({
					model : costBenefit,
					el    : costBenefitView
				});
			}
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

			var parser  = this;
			var xmlPath = this.get('xmlPath');

			var constraintCollection = new UP.ConstraintCollection();
			var activityCollection = new UP.ActivityCollection();

			$.get(xmlPath, function(xmlDocument) {
				parser.set({
					"xml" : $(xmlDocument)
				});

				// Parsing constraints in XML file
				parser.parseConstraints(constraintCollection);


				// Parsing methods in XML file to build only Method Models
				var methodCollection = new UP.MethodCollection();
				parser.parseMethodModels(methodCollection);


				// Parsing cost benefits in XML file to build only Cost Benefit Models
				var costBenefitModels = new UP.CostBenefitCollection();
				parser.parseCostBenefitsModels(costBenefitModels);


				// Parsing activities in XML file

				var $DOMActivities         = $('.activity');
				var $DOMActivitiesList     = $('#methods').find('.info-activity');
				var $DOMActivitiesListPlan = $('#plan').find('.info-activity');
				var $DOMActivitiesTab      = $('.tabs').find('.tab');
				var $DOMActivitiesLink     = $('.link-activity');


				var arrayActivityControllers = [];

				var totalCounter = parser.createTotalCounter();

				parser.get('xml').find('activity').each(function(i) {
					var self = $(this);
					var name          = self.attr('name');
					var description   = self.attr('description');
					var subactivities = self.find('subactivity');

					var $DOMSubactivities         = $DOMActivities.eq(i).find('.subactivity');
					var $DOMSubactivitiesList     = $DOMActivitiesList.eq(i).find('.info-subactivity');
					var $DOMSubactivitiesListPlan = $DOMActivitiesListPlan.eq(i).find('.info-subactivity')


					// Creating the counter for each activity
					var counter = new UP.Counter(totalCounter);

					var counterView     = $DOMActivitiesList.find('.counter').eq(i);
					var counterViewPlan = $DOMActivitiesListPlan.find('.counter').eq(i);

					var counterController  = new UP.CounterController({
						model    : counter,
						view     : counterView,
						viewPlan : counterViewPlan
					});


					// Creating a new 'Activity' model object
					var activity = new UP.Activity(name, description, counter);		// Creating a new 'Activity' model object
					activityCollection.add(activity);

					var arraySubactivityControllers = [];


					var costBenefitCollection = new UP.CostBenefitCollection();
					costBenefitModels.each(function(cb) {
						var cost = new UP.CostBenefit(cb.getName(), cb.getDescription());
						costBenefitCollection.add( cost );
					});


					// Parsing subactivities in XML file

					subactivities.each(function(j) {
						var self = $(this);
						var name         = self.attr('name');
						var description  = self.attr('description');
						var methods      = self.find('method');
						var costBenefits = self.find('costBenefit');

						var subactivityMethods = new UP.MethodCollection();
						var costBenefitWeights = new UP.WeightCollection();

						var $DOMMethods     = $DOMSubactivitiesList.eq(j).find('.method');
						var $DOMMethodsPlan = $DOMSubactivitiesListPlan.eq(j).find('.method');

						var subactivity = new UP.Subactivity(name, description);	// Creating a new 'Subactivity' model object

						activity.addSubactivity( subactivity );			// Adding the 'Subactivity' object to the collection


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
								}
							});

							var method = new UP.Method(name, description, url);
							subactivity.addMethod( method );


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


						var subItem     = $DOMSubactivities.eq(j);
						var subList     = $DOMSubactivitiesList.eq(j);
						var subListPlan = $DOMSubactivitiesListPlan.eq(j);

						var pos = parser.findCoord(i) + j + 1;
						var row = parser.get('tableRows').eq(pos);

						var subactivityController = new UP.SubactivityController({	// Creating a new 'Subactivity' controller object
							model    : subactivity,
							item     : subItem,
							list     : subList,
							listPlan : subListPlan,
							row      : row
						});

						arraySubactivityControllers.push(subactivityController);


						costBenefits.each(function(k) {
							var self        = $(this);
							var name        = self.attr('name');
							var description = "";
							var weightValue = parseInt( self.attr('weight') );

							costBenefitCollection.each(function(cb) {
								if ( cb.compareNameWith(name) ) {
									description = cb.getDescription();
									var costBenefitChild = new UP.CostBenefitChild(name, description);

									var weight = new UP.Weight(subactivity, weightValue);
									costBenefitChild.addWeight( weight );

									subactivity.addCostBenefit( costBenefitChild );
									cb.addCostBenefit( costBenefitChild );

									var costBenefitView = parser.findCostBenefitInput(i, j, k);

									new UP.CostBenefitChildController({
										model : costBenefitChild,
										el    : costBenefitView
									});
								}
							});
						});

					});


					parser.findCostBenefitActivities(i, costBenefitCollection);


					// Activity Views					
					var actBlock    = $DOMActivities.eq(i);
					var actList     = $DOMActivitiesList.eq(i);
					var actListPlan = $DOMActivitiesListPlan.eq(i);
					var actTab      = $DOMActivitiesTab.eq(i);
					var actLink     = $DOMActivitiesLink.eq(i);
					var actRow      = parser.get('tableRows').filter('.row-activity').eq(i);

					// Creating a new activity controller object
					var activityController = new UP.ActivityController({			// Creating a new 'Activity' controller object
						model    : activity,
						block    : actBlock,
						tab      : actTab,
						list     : actList,
						listPlan : actListPlan,
						link     : actLink,
						row      : actRow
					});

					activityController.setSubactivities(arraySubactivityControllers);
					arrayActivityControllers.push(activityController);


	//				costBenefitMatrix.push( costBenefitSubList );
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
