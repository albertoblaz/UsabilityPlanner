
	UP.Plan = Backbone.Model.extend({
		initialize: function(constraints, activities) {
			this.set({
				"constraints" : constraints,
				"activities"  : activities
			});
		},


		getConstraints: function() {
			return this.get('constraints');
		},


		getSelectedConstraints: function() {
			var constraints = new UP.ConstraintCollection();

			this.get('constraints').each(function(c) {
				if ( c.isSelected() ) {
					constraints.add( c );
				}
			});

			return constraints;
		},


		getActivities: function() {
			return this.get('activities');
		},


		getMethods: function() {
			var methods = new UP.MethodCollection();

			this.get('activities').each(function(act) {
				act.getMethods().each(function(m) {
					methods.add( m );
				});
			});

			return methods;
		},


		getSelectedMethods: function() {
			var methods = new UP.MethodCollection();

			this.get('activities').each(function(act) {
				act.getSelectedMethods().each(function(m) {
					methods.add( m );
				});
			});

			return methods;
		},


		getNewMethods: function() {
			return this.get('newMethods');
		},


		setNewMethods: function(methods) {
			this.set({
				"newMethods" : methods
			});
		}

	});