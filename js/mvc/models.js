	
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
	
	UP.Counter = Backbone.Model.extend({
		initialize: function() {
			this.set({
				value : 0
			});
		},

		increment: function() {
			this.set(this.value++);
			console.log(this.value);
		},

		decrement: function() {
			this.value--;
		}
	});

	
	UP.Method = Backbone.Model.extend({
		defaults: {
			weights: [],
			content: "",
			selected: true,
			value: 0
		},
		
		initialize: function(weights) {
			this.set({
				"weights": weights,
				"content": this.defaults.content,
				"selected": this.defaults.selected,
				"value": this.defaults.value
			});
		},
		
		calculateValue: function() {
			// Según la constraint seleccionada, se aplicará el peso correspondiente al valor total
			//this.value += ;
		}
		
	});
	
	
	UP.Constraint = Backbone.Model.extend({
	
		defaults: {
			selected: false
		},
		
		initialize: function(name, description) {
			this.set({
				"name" : name,
				"description" : description,
				"selected" : this.defaults.selected
			});
		},
		
		changeSelection: function() {
			this.selected = !this.selected;
			console.log(this);
			// En cuanto una constraint ha sido seleccionada, los modelos de Methods deben recalcular su valor
		},
		
		unselectConstraint: function() {
			this.selected = false;
			// En cuanto una constraint ha sido deseleccionada, los modelos de Methods deben recalcular su valor
		}
		
	});
	
	
	UP.Subactivity = Backbone.Model.extend({
		
		defaults: {
			name : "",
			description : "",
			methodsCol : []
		},
		
		initialize: function(name, description, methodsCollection) {
			this.set({
				"name" : this.defaults.name,
				"description" : this.defaults.description,
				"methodsCol" : this.defaults.methodsCol
			});
		}
		
	});
	
	
	UP.Activity = Backbone.Model.extend({
		
		defaults: {
			name : "",
			description : "",
			subactivitiesCol : []
		},
		
		initialize: function(name, description, subactivitiesCol) {
			this.set({
				"name" : this.defaults.name,
				"description" : this.defaults.description,
				"subactivitiesCol" : this.defaults.subactivitiesCol
			});
		}
		
	});
