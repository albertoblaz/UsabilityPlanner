	
	// Parsing XML
	(function() {

		$.get('xml/projectStagesDataDevelopers.xml', function(xml) {
			// Caching XML object
			var $xml = $(xml);


			// Parsing constraints in XML file

			var constraintsCol = new UP.ConstraintCollection();			// Creating collections of models
			var $DOMConstraints = $('.constraint');					// Getting the DOM constraints

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

			});



			// Parsing activities in XML file

//			var $DOMMethodsDOM = $('.method');
			var activitiesCol = new UP.ActivityCollection();
//			var subactivityCol = new UP.ActivityCollection();
//			var methodCol = new UP.MethodCollection();

			var $DOMActivities        = $('.activity');
			var $DOMActivitiesTab     = $('.tab');
			var $DOMActivitiesCounter = $('.counter');

			var arrayViews = [];

			$xml.find('activity').each(function(i) {
				var self = $(this);
				var name = self.attr('name');
				var description = self.attr('description');
				var subactivities = self.find('subactivity');

				// Creating a new constraint model object
				var amodel = new UP.Activity(name, description);  //lista de subs
				activitiesCol.add(amodel);

				// Creating a new activity view object
				var ablock   = $DOMActivities.eq(i);
				var atab     = $DOMActivitiesTab.eq(i);
				var acounter = $DOMActivitiesCounter.eq(i);
				var aview    = new UP.ActivityView({
					model: amodel,
					block: ablock,
					tab: atab,
					counter: acounter
				});

				arrayViews.push(aview);

				var cmodel = new UP.Counter();
				var cview  = new UP.CounterView({
					model: cmodel,
					el: acounter
				});

			});

			for (var i=0; i<arrayViews.length; i++) {
				var view = arrayViews[i];
				view.setArrayViews(arrayViews);
			}

		}); // end of ajax-get request


	})();  // end of function

