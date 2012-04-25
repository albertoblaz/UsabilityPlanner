	
	UP.MethodCollection = Backbone.Collection.extend({
		model: window.UP.Method,

		comparator: function(todo) {
			return Method.get('value');
		}

	});