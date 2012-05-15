
	// function Parser(pathToXML, app) {

	UP.Parser = function(pathToXML, app) {

		// Atributes

		var xml = pathToXML;
		var app = app;


		// Private API



		// Public API
		var obj = {};

		obj.parseXML = function() {

			// Caching XML object
		$.get(xml, function(xml) { 

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

			var $DOMActivities         = $('.activity');
			var $DOMActivitiesList     = $('#methods').find('.info-activity');
			var $DOMActivitiesListPlan = $('#plan').find('.info-activity');
			var $DOMActivitiesTab      = $('.tab');
			var $DOMActivitiesCounter  = $('.counter');

			var arrayActivityViews = [];

			var totalcounter      = new UP.Totalcounter();			// Creating the Total Counter
			var totalcounterView  = new UP.TotalcounterView({
				model: totalcounter,
				el: $('.total-counter')
			});

			$xml.find('activity').each(function(i) {
				var self = $(this);
				var name          = self.attr('name');
				var description   = self.attr('description');
				var subactivities = self.find('subactivity');

				var $DOMSubactivities         = $DOMActivities.eq(i).find('.subactivity');
				var $DOMSubactivitiesList     = $DOMActivitiesList.eq(i).find('.info-subactivity');
				var $DOMSubactivitiesListPlan = $DOMActivitiesListPlan.eq(i).find('.info-subactivity')

				var subactivitiesCol        = new UP.SubactivityCollection();

				var arraySubactivityViews = [];

				// Parsing subactivities in XML file

				subactivities.each(function(j) {
					var self = $(this);
					var name        = self.attr('name');
					var description = self.attr('description');
					var methods     = self.find('method');

					var $DOMMethods     = $DOMSubactivitiesList.eq(j).find('.method');
					var $DOMMethodsPlan = $DOMSubactivitiesListPlan.eq(j).find('.method');
					var methodsCol      = new UP.MethodCollection();
					var arrayMethods    = [];

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

						var methodView = $DOMMethods.eq(k);
						var methodPlanView = $DOMMethodsPlan.eq(k);
						var mview  = new UP.MethodView({
							model: mmodel,
							methodView: methodView,
							planView: methodPlanView
						});

						arrayMethods.push(mview);

					});

					var smodel = new UP.Subactivity(name, description, methodsCol);			// Creating a new 'Subactivity' model object

					subactivitiesCol.add(smodel);			// Adding the 'Subactivity' object to the collection

					var sitem     = $DOMSubactivities.eq(j);
					var slist     = $DOMSubactivitiesList.eq(j);
					var slistPlan = $DOMSubactivitiesListPlan.eq(j);
					var sview     = new UP.SubactivityView({		// Creating a new 'Subactivity' controller object
						model: smodel,
						item: sitem,
						list: slist,
						listPlan: slistPlan
					});

					sview.setMethods(arrayMethods);
					arraySubactivityViews.push(sview);
				});

				// Creating the counter for each activity

				var cview = $DOMActivitiesCounter.eq(i);
				var cmodel = new UP.Counter();
				var ccontroller  = new UP.CounterView({
					model: cmodel,
					el: cview,
					totalcounter: totalcounterView
				});

				// Creating a new 'Activity' model object

				var amodel = new UP.Activity(name, description, subactivitiesCol);		// Creating a new 'Activity' model object
				//app.activitiesCol.add(amodel);							// Adding the 'Activity' object to the collection

				// Creating a new activity view object
				var ablock    = $DOMActivities.eq(i);
				var alist     = $DOMActivitiesList.eq(i);
				var alistPlan = $DOMActivitiesListPlan.eq(i);
				var atab      = $DOMActivitiesTab.eq(i);
				var aview     = new UP.ActivityView({			// Creating a new 'Activity' controller object
					model: amodel,
					block: ablock,
					tab: atab,
					list: alist,
					listPlan: alistPlan,
					counter: ccontroller,
					subactivities : arraySubactivityViews
				});

				aview.setSubactivities(arraySubactivityViews);
				arrayActivityViews.push(aview);

			}); // end of 'activities' parsing


			// Once all the activities have been stored, the array will be passed to every activity
			// This happens because every activity needs to have a reference to all of them
			// And later, when an activity tab is clicked, the rest os activities will be hidden
			for (var i=0; i<arrayActivityViews.length; i++) {
				var view = arrayActivityViews[i];
				view.setActivities(arrayActivityViews);
			}

			app.activities = arrayActivityViews;

			});
		}

		return obj;

	}
