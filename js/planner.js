
	UP.Planner = Backbone.Model.extend({
		initialize: function() {
			var slider = new UP.Slider();

			this.set({
				"slider" : slider
			});

			var self = this;
			slider.on('change', function(event) {
				self.hideMethods();
			});

			new UP.SliderController({ model : slider });
		},


		loadInitPlan: function(plan) {
			this.set({
				"plan" : plan
			});

			console.log("Loaded Plan");

			plan.getConstraints().on('updateMethods', function() {
				var sliderValue = this.get('slider').getValue();

				plan.getActivities().each(function(activity) {
					activity.updateMethods(sliderValue);
				});

			}, this);

			this.hideMethods();
		},


		loadNewPlan: function(plan) {
			console.log("Re-Loaded Plan");

			var oldConstraints = this.get('plan').getConstraints();
			var newConstraints = plan.getConstraints();

			var oldSelectedConstraints = this.get('plan').getSelectedConstraints();

			oldSelectedConstraints.each(function(c) {
				c.unselectConstraint();
			});

			this.replaceConstraintsWeights(newConstraints, oldConstraints);

			var oldMethods = this.get('plan').getMethods();
			var newMethods = plan.getNewMethods();

			this.replaceMethodsWeights(newMethods, oldMethods);

			oldSelectedConstraints.each(function(c) {
				c.selectConstraint();
			});

			var sliderValue = this.get('slider').getValue();
			this.get('plan').getActivities().each(function(act) {
				act.updateMethods(sliderValue);
			});

		},


		savePlan: function() {
			console.log("Saved Plan");

			//return new UP.Plan(this.get('constraints'), this.get('activities'));
			return this.get('plan');

		},


		replaceConstraintsWeights: function(newCol, oldCol) {
			newCol.each(function(newC) {
				oldCol.each(function(oldC) {
					if ( newC.compareNameWith(oldC.getName()) ) {
						oldC.replaceWeights( newC.getWeights() );
					}
				});
			});
		},


		replaceMethodsWeights: function(newCol, oldCol) {
			newCol.each(function(newM) {
				oldCol.each(function(oldM) {
					if ( newM.compareNameWith(oldM.getName()) ) {
						oldM.removeWeights();
						oldM.addWeightCollection( newM.getWeights() );
					}
				});
			});
		},


		hideMethods: function() {
			var sliderValue = this.get('slider').getValue();

			this.get('plan').getActivities().each(function(act) {
				act.hideMethods(sliderValue);
			});
		}

	});