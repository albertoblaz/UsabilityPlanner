	
	UP.MethodCollection = Backbone.Collection.extend({
		model: UP.Method,

		comparator: function(todo) {
			return this.model.get('value');
		}

	});

	
	UP.ConstraintCollection = Backbone.Collection.extend({
		model: UP.Constraint,

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