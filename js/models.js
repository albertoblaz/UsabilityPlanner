
	UP.Weight = Backbone.Model.extend({
		initialize: function(constraint, value) {
			this.set({
				"constraint" : constraint,
				"value" : value
			});
		}

	});

	
	UP.Counter = Backbone.Model.extend({
		initialize: function() {
			this.set({
				value : 0
			});
		},

		updateCounterValue: function(amount) {
			this.set({ value : amount });
		}
	});


	UP.Totalcounter = Backbone.Model.extend({
		initialize: function() {
			this.set({
				value : 0
			});
		},

		increment: function(amount) {
			var newValue = this.get('value') + amount;
			this.set({ value : newValue });
		},

		decrement: function(amount) {
			var newValue = this.get('value') - amount;
			this.set({ value : newValue });
		}

	});


	UP.Method = Backbone.Model.extend({	
		initialize: function(name, description, weights) {
			this.set({
				"name": name,
				"description": description,
				"weights": weights,
				"selected": true,
				"value": 0
			});
		},

		calculateValue: function() {
			var totalValue = 0;
			var constraintsNumber = 0;

			this.get('weights').each(function(w) {
				if ( w ) {
					var c = w.get('constraint');
					if ( c.get('selected') == true ) {
						constraintsNumber++;
						totalValue += w.get('value');
					}
				}
			});

			var newValue = 0;
			if ( constraintsNumber != 0 ) {
				newValue = totalValue / (constraintsNumber * UP.constants.MAX_WEIGHT_VALUE);
			}

			this.set({ value : newValue });
			console.log(this.get('name') + ": " + this.get('value'));
		},

		updateView: function() {
			this.trigger('updatePosition');
		},

		changeSelection: function() {
			var selected = this.get('selected');
			this.set({ "selected" : !selected });
		}
	
	});
	

	UP.Constraint = Backbone.Model.extend({		
		initialize: function(name, description) {
			this.set({
				"name" : name,
				"description" : description,
				"selected" : false
			});
		},

		changeSelection: function() {
			var selected = this.get('selected');
			this.set({ "selected" : !selected });
		}
		
	});
	
	UP.Subactivity = Backbone.Model.extend({
		initialize: function(name, description, methodsCol) {
			this.set({
				"name" : name,
				"description" : description,
				"methodsCol" : methodsCol,
				"selected" : false
			});

			methodsCol.sort();
		},

		changeSelection: function() {
			var selected = this.get('selected');
			this.set({ "selected" : !selected });
		}

	});
	
	
	UP.Activity = Backbone.Model.extend({	
		initialize: function(name, description, subactivitiesCol) {
			this.set({
				"name" : name,
				"description" : description,
				"subactivitiesCol" : subactivitiesCol,
			});
		}

	});
