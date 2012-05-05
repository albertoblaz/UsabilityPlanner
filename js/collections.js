	
	UP.WeightCollection = Backbone.Collection.extend({
		model: UP.Weight,
	});

	UP.MethodCollection = Backbone.Collection.extend({
		model: UP.Method,

		comparator: function(method) {
			return method.get('value');
		}
	});

	
	UP.ConstraintCollection = Backbone.Collection.extend({
		model: UP.Constraint,
	});


	UP.SubactivityCollection = Backbone.Collection.extend({
		model: UP.Subactivity,
	});


	UP.ActivityCollection = Backbone.Collection.extend({
		model: UP.Activity,
	});