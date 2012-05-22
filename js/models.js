
	UP.Slider = Backbone.Model.extend({
		initialize: function() {
			this.set({
				"sliderValue" : UP.constants.SLIDER_VALUE
			});
		},


		updateValue: function(newValue) {
			this.set({
				"sliderValue" : newValue
			});
		},


		getValue: function() {
			return this.get('sliderValue');
		}

	});


	UP.Weight = Backbone.Model.extend({
		initialize: function(method, value) {
			this.set({
				"method" : method,
				"value" : value
			});
		},


		incrementMethodValue: function() {
			var value = this.get('value');
			console.log("Incrementando valor: " + value + " al method: " + this.get('method').get('name') );
			this.get('method').incrementValue(value);
		},


		decrementMethodValue: function() {
			var value = this.get('value');
			this.get('method').decrementValue(value);
		},


		compareNameWith: function(name) {
			return this.get('method').compareNameWith(name);
		},


		getMethodName: function() {
			return this.get('method').getName();
		},


		getValue: function() {
			return this.get('value');
		},


		changeValue: function(newValue) {
			this.set({ "value" : newValue });
		},


		toCSV: function() {
			return ";" + this.get('value');
		}

	});

	
	UP.Counter = Backbone.Model.extend({
		initialize: function(totalCounter) {
			this.set({
				value : 0,
				totalCounter : totalCounter
			});
		},


		updateValue: function(newValue) {
			var oldValue = this.get('value');
			this.set({ value : newValue });

			console.log("updating counter");

			this.get('totalCounter').decrement(oldValue);
			this.get('totalCounter').increment(newValue);
		}

	});


	UP.TotalCounter = Backbone.Model.extend({
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
		initialize: function(name, description, url) {
			this.set({
				"name"             : name,
				"description"      : description,
				"url"              : url,
				"weightCollection" : new UP.WeightCollection(),
				"selected"         : false,
				"value"            : 0,
				"numIncrements"    : 0
			});
		},


		incrementValue: function(weightValue) {
			// Denormalizing the method value
			var totalValue = this.denormalizeValue();

			// Adding the weightValue to the totalValue
			totalValue += weightValue;

			// Incrementing the counter of increments
			var oldNumIncrements = this.get('numIncrements');
			this.set({ "numIncrements" : oldNumIncrements + 1 });

			// Normalizing again the new value and updating the attribute
			var normalizedValue = this.normalizeValue(totalValue);
			this.set({ "value" : normalizedValue });

			// Calling the controller to update the view
			this.trigger('render');
		},


		decrementValue: function(weightValue) {
			// Denormalizing the method value
			var totalValue = this.denormalizeValue();

			// Substracting the weightValue to the totalValue
			totalValue -= weightValue;

			// Decrementing the counter of increments
			var oldNumIncrements = this.get('numIncrements');
			this.set({ "numIncrements" : oldNumIncrements - 1 });

			// Normalizing again the new value and updating the attribute
			var normalizedValue = this.normalizeValue(totalValue);
			this.set({ "value" : normalizedValue });

			// Calling the controller to update the view
			this.trigger('render');
		},


		normalizeValue: function(totalValue) {
			var newTotalValue = 0;

			var nInc = this.get('numIncrements');
			if ( nInc ) {
				newTotalValue = totalValue / (nInc * UP.constants.MAX_WEIGHT_VALUE);
			}

			return newTotalValue;
		},


		denormalizeValue: function() {
			return this.get('value') * this.get('numIncrements') * UP.constants.MAX_WEIGHT_VALUE;
		},


		addWeight: function(w) {
			this.get('weightCollection').add(w);
		},


		addWeightCollection: function(col) {
			var self = this;
			col.each(function(w) {
				self.addWeight( w );
			});
		},


		removeWeights: function() {
			this.get('weightCollection').reset();
		},


		changeOrderView: function() {
			this.trigger('updatePosition');
		},


		hideMethod: function(sliderValue) {
			this.trigger('hideMethod', { sliderValue : sliderValue } );
		},


		changeSelection: function() {
			var selected = this.get('selected');
			this.set({ "selected" : !selected });
		},


		selectMethod: function() {
			if ( this.get('value') > 0 ) {
				this.set({ "selected" : true });
			}
		},


		selectMethodAndSubactivity: function() {
			this.selectMethod();
			this.trigger('select');
		},


		unselectMethod: function() {
			this.set({ "selected" : false });
		},


		isSelected: function() {
			return this.get('selected');
		},


		getName: function() {
			return this.get('name');
		},


		getValue: function() {
			return this.get('value');
		},


		getWeights: function() {
			return this.get('weightCollection');
		},


		compareNameWith: function(name) {
			return this.get('name') === name;
		},


		weightsToCSV: function() {
			var output = "";

			this.get('weightCollection').each(function(w) {
				output += w.toCSV();
			});

			return output;
		},


		toCSV: function() {
			console.log(this.get('name'));
			console.log(typeof this.get('name'));

			var name    = this.get('name') + ";" ;
			var value   = this.get('value');
			var weights = this.weightsToCSV();

			console.log(name);
			console.log(value);
			console.log(weights);

			return (name + value + weights);
		}

	});
	

	UP.Constraint = Backbone.Model.extend({		
		initialize: function(name, description) {
			this.set({
				"name"             : name,
				"description"      : description,
				"weightCollection" : new UP.WeightCollection(),
				"selected"         : false
			});
		},


		changeSelection: function() {
			var wasSelected = this.get('selected');

			if ( !wasSelected ) {	// If it was not selected, now it is, so it increments the method value
				this.incrementMethodsValue();
			} else {
				this.decrementMethodsValue();
			}

			this.set({ "selected" : !wasSelected });

			this.trigger("updateMethods");
		},


		selectConstraint: function() {
			this.incrementMethodsValue();
			this.set({ "selected" : true });
		},


		unselectConstraint: function() {
			this.decrementMethodsValue();
			this.set({ "selected" : false });
		},


		isSelected: function() {
			return this.get('selected');
		},


		incrementMethodsValue: function() {
			this.get('weightCollection').each(function(w) {
				w.incrementMethodValue();
			});
		},


		decrementMethodsValue: function() {
			this.get('weightCollection').each(function(w) {	
				w.decrementMethodValue();
			});
		},


		addWeight: function(w) {
			this.get('weightCollection').add(w);
		},


		addWeightCollection: function(col) {
			var self = this;
			col.each(function(w) {
				self.addWeight( w );
			});
		},


		replaceWeights: function(weights) {
			var self = this;

			weights.each(function(newW) {
				self.get('weightCollection').each(function(oldW) {
					if ( newW.compareNameWith(oldW.getMethodName()) ) {
						oldW.changeValue( newW.getValue() );
					}
				});
			});
		},


		compareNameWith: function(name) {
			return this.get('name') === name;
		},


		getName: function() {
			return this.get('name');
		},


		getWeights: function() {
			return this.get('weightCollection');
		},


		toCSV: function() {
			return ";" + this.get('name');
		}
		
	});


	UP.Subactivity = Backbone.Model.extend({
		initialize: function(name, description, methodCollection) {
			this.set({
				"name"             : name,
				"description"      : description,
				"methodCollection" : methodCollection,
				"selected"         : false
			});

			// When a new plan is loaded, the new methods are selected
			// so the containing subactivity must be selected too
			methodCollection.on('select', this.selectSubactivity, this);
		},


		changeSelection: function() {
			var wasSelected = this.get('selected');
			this.set({ "selected" : !wasSelected });

			if ( wasSelected ) {
				this.get('methodCollection').each(function(m) {
					m.unselectMethod();
				});
			} else {
				this.get('methodCollection').each(function(m) {
					m.selectMethod();
				});
			}

			this.trigger('updateCounter');
		},


		selectSubactivity: function() {
			this.set({ "selected" : true });
			this.trigger('changeDisplayList');
		},


		unselectSubactivity: function() {
			this.set({ "selected" : false });
			this.trigger('changeDisplayList');
		},

/*
		unselectSubactivity: function() {
			this.set({ "selected" : false });
			this.get('methodCollection').each(function(m) {
				m.unselectMethod();
			});
		},
*/

		sortMethods: function() {
			this.get('methodCollection').sort();
		},


		changeOrderMethodsView: function() {
			this.get('methodCollection').each(function(method) {
				method.changeOrderView();
			});
		},


		hideMethods: function(sliderValue) {
			this.get('methodCollection').each(function(method) {
				method.hideMethod(sliderValue);
			});

			this.trigger('updateLastMethod');
		},


		getMethods: function() {
			return this.get('methodCollection');
		},


		getSelectedMethods: function() {
			var methods = new UP.MethodCollection();

			this.get('methodCollection').each(function(m) {
				if ( m.isSelected() ) {
					methods.add( m );
				}
			});

			return methods;
		},


		countSelectedMethods: function() {
			return this.getSelectedMethods().length;
		},


		isSelected: function() {
			return this.get('selected');
		}

	});
	
	
	UP.Activity = Backbone.Model.extend({
		initialize: function(name, description, counter, subactivitiesCollection) {
			this.set({
				"name"                    : name,
				"description"             : description,
				"counter"                 : counter,
				"subactivitiesCollection" : subactivitiesCollection
			});

			subactivitiesCollection.on('updateCounter', this.updateCounter, this);
		},


		sortMethods: function() {
			this.get('subactivitiesCollection').each(function(sub) {
				sub.sortMethods();
			});
		},


		changeOrderMethodsView: function() {
			this.get('subactivitiesCollection').each(function(sub) {
				sub.changeOrderMethodsView();
			});
		},


		hideMethods: function(sliderValue) {
			this.get('subactivitiesCollection').each(function(sub) {
				sub.hideMethods(sliderValue);
			});

			this.updateCounter();
		},


		updateMethods: function(sliderValue) {
			this.get('subactivitiesCollection').each(function(sub) {
				sub.sortMethods();
				sub.changeOrderMethodsView();
				sub.hideMethods(sliderValue);
			});

			this.updateCounter();
		},


		getMethods: function() {
			var methods = new UP.MethodCollection();

			this.get('subactivitiesCollection').each(function(sub) {
				sub.getMethods().each(function(m) {
					methods.add( m );
				});
			});

			return methods;
		},


		getSelectedMethods: function() {
			var methods = new UP.MethodCollection();

			this.get('subactivitiesCollection').each(function(sub) {
				if ( sub.isSelected() ) {
					sub.getSelectedMethods().each(function(m) {
						methods.add( m );
					});
				}
			});

			return methods;
		},


		countSelectedMethods: function() {
			var count = 0;

			this.get('subactivitiesCollection').each(function(sub) {
				if ( sub.isSelected() ) {
					count += sub.countSelectedMethods();
				}
			});

			return count;
		},


		updateCounter: function() {
			var count = this.countSelectedMethods();
			this.get('counter').updateValue(count);
		}

	});
