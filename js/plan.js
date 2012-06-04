
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
				"activities"  : activities
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
		 * @method getSelectedConstraints
		 * @return constraints {ConstraintCollection}
		 */
		getSelectedConstraints: function() {
			var constraints = new UP.ConstraintCollection();

			this.get('constraints').each(function(c) {
				if ( c.isSelected() ) {
					constraints.add( c );
				}
			});

			return constraints;
		},


		/**
		 * @method getActivities
		 * @return activities {ActivityCollection}
		 */
		getActivities: function() {
			return this.get('activities');
		},

		
		/**
		 * @method getMethods
		 * @return methods {MethodCollection}
		 */
		getMethods: function() {
			var methods = new UP.MethodCollection();

			this.get('activities').each(function(act) {
				act.getMethods().each(function(m) {
					methods.add( m );
				});
			});

			return methods;
		},


		/**
		 * @method getSelectedMethods
		 * @return methods {MethodCollection}
		 */
		getSelectedMethods: function() {
			var methods = new UP.MethodCollection();

			this.get('activities').each(function(act) {
				act.getSelectedMethods().each(function(m) {
					methods.add( m );
				});
			});

			return methods;
		},


		/**
		 * @method getNewMethods
		 * @return methods {MethodCollection}
		 */
		getNewMethods: function() {
			return this.get('newMethods');
		},


		/**
		 * @method setNewMethods
		 * @param methods {MethodCollection}
		 */
		setNewMethods: function(methods) {
			this.set({
				"newMethods" : methods
			});
		}

	});
	