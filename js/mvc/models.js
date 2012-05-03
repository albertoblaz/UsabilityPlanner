
	UP.Weight = Backbone.Model.extend({
		initialize: function(constraint, value) {
			this.constraint = constraint;
			this.value = value;

			var self = this;
			this.constraint.on("change", function() {
				self.trigger('change', self.value);
				self.value *= (-1);
			});
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

			var self = this;
			weights.each(function(w) {
				_.extend(w, Backbone.Events);
				w.on('change', function() {
					return self.calculateValue(w.value);
				});
			});

		},
		
		calculateValue: function(weightValue) {
			var oldValue = this.get('value');

			this.set({
				value : oldValue + weightValue
			});

			console.log("el valor del metodo ha cambiado = " + this.get('value'));
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
	_.extend(UP.Constraint, Backbone.Events);	
	
	UP.Subactivity = Backbone.Model.extend({
		initialize: function(name, description, methodsCol) {
			this.set({
				"name" : name,
				"description" : description,
				"methodsCol" : methodsCol,
				"selected" : false
			});
		},

		changeSelection: function() {
			var selected = this.get('selected');
			this.set({ "selected" : !selected });
		}

	});
	
	
	UP.Activity = Backbone.Model.extend({	
		initialize: function() {
		}
		
	});
