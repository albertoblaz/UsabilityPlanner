	
	UP.WeightCollection = Backbone.Collection.extend({
		model: UP.Weight,

		comparator: function(todo) {
//			return this.model.get('value');
		}

	});

	UP.MethodCollection = Backbone.Collection.extend({
		model: UP.Method,

		comparator: function(todo) {
//			return this.model.get('value');
		}

	});

	
	UP.ConstraintCollection = Backbone.Collection.extend({
		model: UP.Constraint,

		comparator: function(model) {
			return model.get('cid');
		}

	});


	UP.SubactivityCollection = Backbone.Collection.extend({
		model: UP.Subactivity,

		comparator: function(todo) {
//			return this.model.get('value');
		}

	});


	UP.ActivityCollection = Backbone.Collection.extend({
		model: UP.Activity,

		comparator: function(todo) {
//			return this.model.get('value');
		}

	});