	
	// Parsing XML
	(function() {

		$.get('xml/projectStagesDataDevelopers.xml', function(xml) {
			// Caching XML object
			var $xml = $(xml);


			// Parsing constraints in XML file

			var constraintsCol = new UP.ConstraintCollection();			// Creating collections of models
			var $DOMConstraints = $('.constraint');						// Getting the DOM constraints

			$xml.find('constraints').find('constraint').each(function(i) {
				var self = $(this);
				var name = self.attr('name');
				var description = self.attr('description');

				// Creating a new constraint model object
				var cmodel = new UP.Constraint(name, description);
				constraintsCol.add(cmodel);

				// Creating a new constraint view object
				var cnode = $DOMConstraints.eq(i);
				var cview = new UP.ConstraintView({
					model: cmodel, 
					el: cnode
				});

			}); // end of 'constraint' parsing



			// Parsing activities in XML file

//			var $DOMMethods = $('.method');
			var activitiesCol = new UP.ActivityCollection();

//			var methodCol = new UP.MethodCollection();

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

					var smodel = new UP.Subactivity(name, description, {});			// Creating a new 'Subactivity' model object

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
				var amodel = new UP.Activity();				// Creating a new 'Activity' model object
				amodel.set({
					name: name, 
					description: description, 
					subactivitiesCol: subactivitiesCol
				});

				activitiesCol.add(amodel);					// Adding the 'Activity' object to the collection

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

				console.log(aview);
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


	})();  // end of function

