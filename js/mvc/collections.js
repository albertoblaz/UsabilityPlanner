	
	UP.MethodCollection = Backbone.Collection.extend({
		model: UP.Method,

		comparator: function(todo) {
			return Method.get('value');
		}

	});