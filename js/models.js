
	UP.Weight = Backbone.Model.extend({
		initialize: function(constraint, value) {
			this.set({
				"constraint" : constraint,
				"value" : value
			});
/*
			var self = this;
			this.constraint.on("change", function() {
				self.trigger('change', self.value);
				self.value *= (-1);
			});
*/
		}

	});


	UP.Slider = Backbone.Model.extend({
		initialize: function() {
			this.set({
				slidervalue : 1
			});
		},

		updateValue: function(newvalue) {
			this.set({
				slidervalue: newvalue
			});
		}
	});

	
	UP.Counter = Backbone.Model.extend({
		initialize: function() {
			this.set({
				value : 0
			});
		},

		increment: function(amount) {
			var inc;
			if (amount > 0)   inc = amount;
			else              inc = 1;

			this.set({
				value: this.get('value') + inc
			});
		},

		decrement: function() {
			var inc;
			if (amount > 0)   inc = amount;
			else              inc = 1;

			this.set({
				value: this.get('value') - inc
			});
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
/*
			var self = this;
			weights.each(function(w) {
				_.extend(w, Backbone.Events);
				w.on('change', function() {
					return self.calculateValue(w.value);
				});
			});
*/
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

/*		
		calculateValue: function(weightValue) {
			var oldValue = this.get('value');

			this.set({
				value : oldValue + weightValue
			});
		},
*/
		updateView: function() {
			this.trigger('updatePosition');
			//this.change();
		},
		
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
	_.extend(UP.Constraint, Backbone.Events);	
	
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
				"subactivitiesCol" : subactivitiesCol
			});
		}
		
	});
