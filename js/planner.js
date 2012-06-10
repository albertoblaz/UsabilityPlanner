	
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


		/**
		 * @method savePlan
		 * @return plan {Plan}
		 */
		savePlan: function() {
			

			//return new UP.Plan(this.get('constraints'), this.get('activities'));
			return this.get('plan');

		},

		
		/**
		 * @method replaceConstraintsWeights
		 * @param newCol {ConstraintCollection}
		 * @param oldCol {ConstraintCollection}
		 */
		replaceConstraintsWeights: function(newCol, oldCol) {
			newCol.each(function(newC) {
				oldCol.each(function(oldC) {
					if ( newC.compareNameWith(oldC.getName()) ) {
						oldC.replaceWeights( newC.getWeights() );
					}
				});
			});
		},


		/**
		 * @method replaceMethodsWeights
		 * @param newCol {MethodCollection}
		 * @param oldCol {MethodCollection}
		 */
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