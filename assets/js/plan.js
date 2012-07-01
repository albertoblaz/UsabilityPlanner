
	/**
	 * @module UP
	 * @submodule Plan
	 * @class Plan
	 * @extends Backbone.Model
	 */	
	UP.Plan = Backbone.Model.extend({
	
		/**
		 * @method initialize
		 * @param constraints {ConstraintCollection}
		 * @param activities {ActivityCollection}
		 * @constructor
		 */
		initialize: function(constraints, activities) {
		
			this.set({
			
				/**
				 * @property constraints
				 * @type ConstraintCollection
				 */
				"constraints" : constraints,
				
				/**
				 * @property activities
				 * @type ActivityCollection
				 */
				"activities"  : activities,

				/**
				 * @property sliderValue
				 * @type Number
				 */
				"sliderValue" : UP.constants.SLIDER_VALUE
			});
			
		},


		/**
		 * @method getConstraints
		 * @return constraints {ConstraintCollection}
		 */
		getConstraints: function() {
			return this.get('constraints');
		},


		/**
		 * @method getActivities
		 * @return activities {ActivityCollection}
		 */
		getActivities: function() {
			return this.get('activities');
		},


		/**
		 * @method getSliderValue
		 * @return sliderValue {Number}
		 */
		getSliderValue: function() {
			return this.get('sliderValue');
		},


		setSliderValue: function(value) {
			this.set({ "sliderValue" : value });
		}

	});
	
