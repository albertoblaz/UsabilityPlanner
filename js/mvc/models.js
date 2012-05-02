	
	UP.Weight = function(constraint, value) {
		// Private vars
		var constraint = constraint;
		var value = value;
		
		// Public API
		var obj = {};
		obj.weightOfConstraint = function(c) {
			if (constraint == c) {
				return value;
			}
		};
		
		return obj;
	}
	
	/*
	UP.Weight = Backbone.Model.extend({
		defaults: {
			constraint: "",
			numWeight: 0
		},

		initialize: function(constraint, numWeight) {
			this.set({
				"constraint" : constraint,
				"numWeight" : numWeight
			});
		},

		weightOfConstraint : function(constraintName) {
			if (constraintName === this.constraint) {
				return numWeight;
			}
		}
	});
	*/

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
		},
		
		calculateValue: function() {
			// Según la constraint seleccionada, se aplicará el peso correspondiente al valor total
			//this.value += ;
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

			// En cuanto una constraint ha sido seleccionada, los modelos de Methods deben recalcular su valor
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
