
	UP.Weight = Backbone.Model.extend({
		initialize: function(constraint, value) {
			this.set({
				"constraint" : constraint,
				"value" : value
			});
		},
/*
		stringify: function() {
			return {
				constraint : this.get('constraint').get('name'),
				value      : this.get('value')
			};
		},
*/
		getConstraintName: function() {
			return this.get('constraint').get('name');
		},

		stringify: function() {
			return (this.get('value') + ";" );
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
				"selected": false,
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
		},

		selectMethod: function() {
			this.set({ "selected" : true });
		},

		unselectMethod: function() {
			this.set({ "selected" : false });
		},

		isSelected: function() {
			return this.get('selected');
		},
/*
		stringify: function() {
			var weights = [];
			this.get('weights').each(function(w) {
				weights.push( w.stringify() );
			});

			return {
				name    : this.get('name'),
				value   : this.get('value'),
				weights : weights
			};
		},
*/
		stringifyWeights: function() {
			var output = "";

			this.get('weights').each(function(w) {
				output += w.stringify();
			});

			return output;
		},

		stringify: function() {
			var name    = this.get('name');
			var value   = this.get('value');
			var weights = this.stringifyWeights();

			return (name + ";" + value + ";" + weights);
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
			var wasSelected = this.get('selected');
			this.set({ "selected" : !wasSelected });
		},

		stringify: function() {
			return (this.get('name') + ";") ;
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
			var wasSelected = this.get('selected');
			this.set({ "selected" : !wasSelected });

			if ( wasSelected ) {
				this.get('methodsCol').each(function(m) {
					m.unselectMethod()
				});
			} else {
				this.get('methodsCol').each(function(m) {
					m.selectMethod()
				});
			}
		}

	});
	
	
	UP.Activity = Backbone.Model.extend({	
		initialize: function(name, description, subactivitiesCol) {
			this.set({
				"name" : name,
				"description" : description,
				"subactivitiesCol" : subactivitiesCol
			});
		}

	});
