	
	/**
	 * @module UP
	 * @submodule Util
	 * @class Planner
	 * @extends Backbone.Model
	 */	
	UP.Planner = Backbone.Model.extend({
	
		/**
		 * @method initialize
		 * @constructor
		 */
		initialize: function() {
		
			this.set({
			
				/**
				 * @property slider
				 * @type Slider
				 * @default "new Slider()"
				 */
				"slider" : new UP.Slider()
			});

			var self = this;
			var slider = this.get('slider');
			
			slider.on('change', function(event) {
				self.hideMethods();
			});

			new UP.SliderController({ model : slider });
		},

		
		/**
		 * @method loadInitPlan
		 * @param plan {Plan}
		 */
		loadInitPlan: function(plan) {
		
			this.set({
			
				/**
				* @property plan
				* @type Plan
				*/
				"plan" : plan
			});

			

			plan.getConstraints().on('updateMethods', function() {
				var sliderValue = this.get('slider').getValue();

				plan.getActivities().each(function(activity) {
					activity.updateMethods(sliderValue);
				});

			}, this);

			this.hideMethods();
		},


		/**
		 * @method loadNewPlan
		 * @param plan {Plan}
		 */
		loadNewPlan: function(plan) {
			var oldConstraints = this.get('plan').getConstraints();
			var newConstraints = plan.getConstraints();

			this.replaceConstraints(newConstraints, oldConstraints);



			var oldActivities = this.get('plan').getActivities();
			var newActivities = plan.getActivities();

			this.replaceActivities(newActivities, oldActivities);




			var sliderValue = plan.getSliderValue();
			this.get('slider').setValue( sliderValue );

			this.get('plan').getActivities().each(function(act) {
				act.updateMethods(sliderValue);
			});

		},


		/**
		 * @method savePlan
		 * @return plan {Plan}
		 */
		savePlan: function() {
			var sliderValue = this.get('slider').getValue();

			var plan = this.get('plan');
			plan.setSliderValue( sliderValue );

			return plan;
		},

		
		/**
		 * @method replaceConstraints
		 * @param newCol {ConstraintCollection}
		 * @param oldCol {ConstraintCollection}
		 */
		replaceConstraints: function(newCol, oldCol) {
			oldCol.each(function(oldC) {
				newCol.each(function(newC) {
					if ( newC.compareNameWith(oldC.getName()) ) {
						oldC.replaceData( newC );
					}
				});
			});
		},


		/**
		 * @method replaceActivities
		 * @param newCol {ActivityCollection}
		 * @param oldCol {ActivityCollection}
		 */
		replaceActivities: function(newCol, oldCol) {
			var name;

			newCol.each(function(newA) {
				oldCol.each(function(oldA) {
					name = oldA.getName();

					if ( newA.compareNameWith(oldA.getName()) ) {
						oldA.replaceData( newA );
					}
				});
			});
		},


		/**
		 * @method hideMethods
		 */
		hideMethods: function() {
			var sliderValue = this.get('slider').getValue();

			this.get('plan').getActivities().each(function(act) {
				act.hideMethods(sliderValue);
			});
		}

	});
