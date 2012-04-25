	
	var globalObject = function() {};
	
	var UP = new globalObject();
	
	UP.Weight = function () {
		var constraint;
		var numWeight;
		
		// Public API
		return {
			weightOfConstraint : function(constraintName) {
				if (constraintName === constraint.get("name")) {
					return numWeight;
				}
			}
		};
	};
	
	
	UP.Method = Backbone.Model.extend({
	
		defaults: {
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
				this.selected = false;
		},
		
		initialize: function(name, description) {
			this.set({
				"name" : name,
				"description" : description
				"selected" : this.defaults.selected;
			});
		},
		
		selectConstraint: function() {
			this.selected = true;
			// En cuanto una constraint ha sido seleccionada, los modelos de Methods deben recalcular su valor
		},
		
		unselectConstraint: function() {
			this.selected = false;
			// En cuanto una constraint ha sido deseleccionada, los modelos de Methods deben recalcular su valor
		}
		
	});
	
	
	UP.Subactivity = Backbone.Model.extend({
		
		defaults: {
			this.name = "";
			this.description = "";
			this.methodsCol = [];
		}
		
		initialize: function(name, description, methodsCollection) {
			this.set({
				"name" : this.defaults.name
				"description" : this.defaults.description,
				"methodsCol" : this.defaults.methodsCol
			});
		}
		
	});
	
	
	UP.Activity = Backbone.Model.extend({
		
		defaults: {
			this.name = "";
			this.description = "";
			this.subactivitiesCol = [];
		}
		
		initialize: function(name, description, subactivitiesCol) {
			this.set({
				"name" : this.defaults.name
				"description" : this.defaults.description,
				"subactivitiesCol" : this.defaults.subactivitiesCol
			});
		}
		
	});
