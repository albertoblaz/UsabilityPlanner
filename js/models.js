	
	/**
	 * @module UP
	 * @submodule Models
	 * @class Slider
	 * @extends Backbone.Model
	 */	
	UP.Slider = Backbone.Model.extend({
	
		/**
		 * @method initialize
		 * @constructor
		 */
		initialize: function() {
		
			this.set({
			
				/**
				 * @property sliderValue
				 * @type number
				 * @default "constans.SLIDER_VALUE"
				 */
				"sliderValue" : UP.constants.SLIDER_VALUE
			});
			
		},

		
		/**
		 * @method updateValue
		 * @param newValue {Number} 
		 */
		updateValue: function(newValue) {
			this.set({
				"sliderValue" : newValue
			});
		},

		
		/**
		 * @method getValue
		 * @return sliderValue {number}
		 */
		getValue: function() {
			return this.get('sliderValue');
		}

	});


	
	/**
	 * @module UP
	 * @submodule Models
	 * @class Weight
	 * @extends Backbone.Model
	 */	
	UP.Weight = Backbone.Model.extend({
	
		/**
		 * @method initialize
		 * @constructor
		 */
		initialize: function(method, value) {
		
			this.set({
			
				/**
				 * @property method
				 * @type Method
				 */
				"method" : method,
				
				/**
				 * @property value
				 * @type number
				 */
				"value" : value
			});
			
		},

		
		/**
		 * @method incrementMethodValue
		 */
		incrementMethodValue: function() {
			var value = this.get('value');
			console.log("Incrementando valor: " + value + " al method: " + this.get('method').get('name') );
			this.get('method').incrementValue(value);
		},

		
		/**
		 * @method decrementMethodValue
		 */
		decrementMethodValue: function() {
			var value = this.get('value');
			this.get('method').decrementValue(value);
		},


		/**
		 * @method compareNameWith
		 * @param name {string} 
		 * @return equals {boolean}
		 */
		compareNameWith: function(name) {
			return this.get('method').compareNameWith(name);
		},

		
		/**
		 * @method getMethodName
		 * @return name {string}
		 */
		getMethodName: function() {
			return this.get('method').getName();
		},

		
		/**
		 * @method getValue
		 * @return value {string}
		 */
		getValue: function() {
			return this.get('value');
		},

		
		/**
		 * @method changeValue
		 * @param newValue {number}
		 */
		changeValue: function(newValue) {
			this.set({ "value" : newValue });
		},

		
		/**
		 * @method toCSV
		 * @return csv {string}
		 */
		toCSV: function() {
			return ";" + this.get('value');
		}

	});

	
	
	/**
	 * @module UP
	 * @submodule Models
	 * @class Counter
	 * @extends Backbone.Model
	 */	
	UP.Counter = Backbone.Model.extend({
	
		/**
		 * @method initialize
		 * @param totalCounter {TotalCounter}
		 * @constructor
		 */
		initialize: function(totalCounter) {
		
			this.set({
			
				/**
				 * @property value
				 * @type number
				 * @default "0"
				 */
				value : 0,
				
				/**
				 * @property totalCounter
				 * @type TotalCounter
				 */
				totalCounter : totalCounter
			});
			
		},

		
		/**
		 * @method toCSV
		 * @param newValue {number}
		 */
		updateValue: function(newValue) {
			var oldValue = this.get('value');
			this.set({ value : newValue });

			console.log("updating counter");

			this.get('totalCounter').decrement(oldValue);
			this.get('totalCounter').increment(newValue);
		}

	});


	
	/**
	 * @module UP
	 * @submodule Models
	 * @class TotalCounter
	 * @extends Backbone.Model
	 */	
	UP.TotalCounter = Backbone.Model.extend({
	
		/**
		 * @method initialize
		 * @constructor
		 */
		initialize: function() {
		
			this.set({
			
				/**
				 * @property value
				 * @type number
				 * @default "0"
				 */
				value : 0
			});
			
		},

		
		/**
		 * @method increment
		 * @param amount {number} 
		 */
		increment: function(amount) {
			var newValue = this.get('value') + amount;
			this.set({ value : newValue });
		},

		
		/**
		 * @method decrement
		 * @param amount {number}
		 */
		decrement: function(amount) {
			var newValue = this.get('value') - amount;
			this.set({ value : newValue });
		}

	});


	
	/**
	 * @module UP
	 * @submodule Models
	 * @class Method
	 * @extends Backbone.Model
	 */	
	UP.Method = Backbone.Model.extend({
	
		/**
		 * @method initialize
		 * @param name {string}
		 * @param description {string}
		 * @param url {string}
		 * @constructor
		 */
		initialize: function(name, description, url) {
		
			this.set({
			
				/**
				 * @property name
				 * @type string
				 */
				"name"             : name,
				
				/**
				 * @property description
				 * @type string
				 */
				"description"      : description,
				
				/**
				 * @property url
				 * @type string
				 */
				"url"              : url,
				
				/**
				 * @property weightCollection
				 * @type WeightCollection
				 * @default "new WeightCollection"
				 */
				"weightCollection" : new UP.WeightCollection(),
				
				/**
				 * @property selected
				 * @type boolean
				 * @default "false"
				 */
				"selected"         : false,
				
				/**
				 * @property value
				 * @type number
				 * @default "0"
				 */
				"value"            : 0,
				
				/**
				 * @property numIncrements
				 * @type number
				 * @default "0"
				 */
				"numIncrements"    : 0
			});
			
		},

		
		/**
		 * @method incrementValue
		 * @param weightValue {number}
		 */
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


		/**
		 * @method decrementValue
		 * @param weightValue {number}
		 */
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


		/**
		 * @method normalizeValue
		 * @param totalValue {number}
		 * @return newTotalvalue {number}
		 */
		normalizeValue: function(totalValue) {
			var newTotalValue = 0;

			var nInc = this.get('numIncrements');
			if ( nInc ) {
				newTotalValue = totalValue / (nInc * UP.constants.MAX_WEIGHT_VALUE);
			}

			return newTotalValue;
		},
		
		
		/**
		 * @method denormalizeValue
		 * @return totalValue {number}
		 */
		denormalizeValue: function() {
			return this.get('value') * this.get('numIncrements') * UP.constants.MAX_WEIGHT_VALUE;
		},

		
		/**
		 * @method addWeight
		 * @param weight {Weight}
		 */
		addWeight: function(weight) {
			this.get('weightCollection').add( weight );
		},

		
		/**
		 * @method addWeightCollection
		 * @param col {WeightCollection}
		 */
		addWeightCollection: function(col) {
			var self = this;
			col.each(function(w) {
				self.addWeight( w );
			});
		},

		
		/**
		 * @method removeWeights
		 */
		removeWeights: function() {
			this.get('weightCollection').reset();
		},


		/**
		 * @method changeOrderView
		 */
		changeOrderView: function() {
			this.trigger('updatePosition');
		},


		/**
		 * @method hideMethod
		 * @param sliderValue {number}
		 */
		hideMethod: function(sliderValue) {
			if ( this.get('numIncrements') == 0 && this.get('value') == 0) {
				this.trigger('showNeutral');
			} else {
				this.trigger('hideMethod', { sliderValue : sliderValue } );
			}
		},

		
		/**
		 * @method changeSelection
		 */
		changeSelection: function() {
			var selected = this.get('selected');
			this.set({ "selected" : !selected });
		},

		
		/**
		 * @method selectMethod
		 */
		selectMethod: function() {
			if ( this.get('value') > 0 ) {
				this.set({ "selected" : true });
			}
		},

		
		/**
		 * @method selectMethodAndSubactivity
		 */
		selectMethodAndSubactivity: function() {
			this.selectMethod();
			this.trigger('select');
		},

		
		/**
		 * @method unselectMethod
		 */
		unselectMethod: function() {
			this.set({ "selected" : false });
		},

		
		/**
		 * @method isSelected
		 * @return selected {boolean}
		 */
		isSelected: function() {
			return this.get('selected');
		},

		
		/**
		 * @method getName
		 * @return name {string}
		 */
		getName: function() {
			return this.get('name');
		},


		/**
		 * @method getDescription
		 * @return dscription {string}
		 */
		getDescription: function() {
			return this.get('description');
		},

		
		/**
		 * @method getURL
		 * @return url {string}
		 */
		getURL: function() {
			return this.get('url');
		},

		
		/**
		 * @method getValue
		 * @return value {number}
		 */
		getValue: function() {
			return this.get('value');
		},

		
		/**
		 * @method getWeights
		 * @return weightCollection {WeightCollection}
		 */
		getWeights: function() {
			return this.get('weightCollection');
		},

		
		/**
		 * @method compareNameWith
		 * @param name {string}
		 * @return equals {boolean}
		 */
		compareNameWith: function(name) {
			return this.get('name') === name;
		},

		
		/**
		 * @method weightsToCSV
		 * @return output {string}
		 */
		weightsToCSV: function() {
			var output = "";

			this.get('weightCollection').each(function(w) {
				output += w.toCSV();
			});

			return output;
		},

		
		/**
		 * @method toCSV
		 * @return csv {string}
		 */
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
	

	
	/**
	 * @module UP
	 * @submodule Models
	 * @class Constraint
	 * @extends Backbone.Model
	 */	
	UP.Constraint = Backbone.Model.extend({
	
		/**
		 * @method initialize
		 * @param name {string}
		 * @param description {string}
		 * @constructor
		 */
		initialize: function(name, description) {
		
			this.set({
			
				/**
				 * @property name
				 * @type string
				 */
				"name"             : name,
				
				/**
				 * @property description
				 * @type string
				 */
				"description"      : description,
				
				/**
				 * @property weightCollection
				 * @type WeightCollection
				 * @default "new WeightCollection"
				 */
				"weightCollection" : new UP.WeightCollection(),
				
				/**
				 * @property selected
				 * @type boolean
				 * @default "false"
				 */
				"selected"         : false
			});
			
		},

		
		/**
		 * @method changeSelection
		 */
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

		
		/**
		 * @method selectConstraint
		 */
		selectConstraint: function() {
			this.incrementMethodsValue();
			this.set({ "selected" : true });
		},

		
		/**
		 * @method unselectConstraint
		 */
		unselectConstraint: function() {
			this.decrementMethodsValue();
			this.set({ "selected" : false });
		},

		
		/**
		 * @method isSelected
		 * @return selected {boolean}
		 */
		isSelected: function() {
			return this.get('selected');
		},

		
		/**
		 * @method incrementMethodsValue
		 */
		incrementMethodsValue: function() {
			this.get('weightCollection').each(function(w) {
				w.incrementMethodValue();
			});
		},

		
		/**
		 * @method decrementMethodsValue
		 */
		decrementMethodsValue: function() {
			this.get('weightCollection').each(function(w) {	
				w.decrementMethodValue();
			});
		},

		
		/**
		 * @method addWeight
		 * @param weight {Weight}
		 */
		addWeight: function(weight) {
			this.get('weightCollection').add( weight );
		},

		
		/**
		 * @method addWeightCollection
		 * @param col {WeightCollection}
		 */
		addWeightCollection: function(col) {
			var self = this;
			col.each(function(w) {
				self.addWeight( w );
			});
		},

		
		/**
		 * @method replaceWeights
		 * @param weights {WeightCollection}
		 */
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

		
		/**
		 * @method compareNameWith
		 * @param name {string}
		 * @return equals {boolean}
		 */
		compareNameWith: function(name) {
			return this.get('name') === name;
		},

		
		/**
		 * @method getName
		 * @return name {string}
		 */
		getName: function() {
			return this.get('name');
		},

		
		/**
		 * @method getWeights
		 * @return weightCollection {WeightCollection}
		 */
		getWeights: function() {
			return this.get('weightCollection');
		},

		
		/**
		 * @method toCSV
		 * @return csv {string}
		 */
		toCSV: function() {
			return ";" + this.get('name');
		}
		
	});


	
	/**
	 * @module UP
	 * @submodule Models
	 * @class Subactivity
	 * @extends Backbone.Model
	 */	
	UP.Subactivity = Backbone.Model.extend({
	
		/**
		 * @method initialize
		 * @param name {string}
		 * @param description {string}
		 * @param methodCollection {MethodCollection}
		 * @constructor
		 */
		initialize: function(name, description, methodCollection) {
			
			this.set({
			
				/**
				 * @property name
				 * @type string
				 */
				"name"             : name,
				
				/**
				 * @property description
				 * @type string
				 */
				"description"      : description,
				
				/**
				 * @property methodCollection
				 * @type MethodCollection
				 */
				"methodCollection" : methodCollection,
				
				/**
				 * @property selected
				 * @type boolean
				 * @default "false"
				 */
				"selected"         : false
			});

			// When a new plan is loaded, the new methods are selected
			// so the containing subactivity must be selected too
			methodCollection.on('select', this.selectSubactivity, this);
		},


		/**
		 * @method changeSelection
		 */
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

		
		/**
		 * @method selectSubactivity
		 */
		selectSubactivity: function() {
			this.set({ "selected" : true });
			this.trigger('changeDisplayList');
		},

		
		/**
		 * @method unselectSubactivity
		 */
		unselectSubactivity: function() {
			this.set({ "selected" : false });
			this.trigger('changeDisplayList');
		},

		
		/**
		 * @method sortMethods
		 */
		sortMethods: function() {
			this.get('methodCollection').sort();
		},


		/**
		 * @method changeOrderMethodsView
		 */
		changeOrderMethodsView: function() {
			this.get('methodCollection').each(function(method) {
				method.changeOrderView();
			});
		},


		/**
		 * @method hideMethods
		 * @param sliderValue {number}
		 */
		hideMethods: function(sliderValue) {
			this.get('methodCollection').each(function(method) {
				method.hideMethod(sliderValue);
			});

			this.trigger('updateLastMethod');
		},

		
		/**
		 * @method getMethods
		 * @return methodCollection {MethodCollection}
		 */
		getMethods: function() {
			return this.get('methodCollection');
		},

		
		/**
		 * @method getSelectedMethods
		 * @return methodCollection {MethodCollection}
		 */
		getSelectedMethods: function() {
			var methods = new UP.MethodCollection();

			this.get('methodCollection').each(function(m) {
				if ( m.isSelected() ) {
					methods.add( m );
				}
			});

			return methods;
		},

		
		/**
		 * @method countSelectedMethods
		 * @return count {number}
		 */
		countSelectedMethods: function() {
			return this.getSelectedMethods().length;
		},

		
		/**
		 * @method isSelected
		 * @return selected {boolean}
		 */
		isSelected: function() {
			return this.get('selected');
		}

	});
	
	
	
	/**
	 * @module UP
	 * @submodule Models
	 * @class Activity
	 * @extends Backbone.Model
	 */	
	UP.Activity = Backbone.Model.extend({
	
		/**
		 * @method initialize
		 * @param name {string}
		 * @param description {string}
		 * @param counter {Counter} 
		 * @param subactivitiesCollection {SubactivityCollection} 
		 * @constructor
		 */
		initialize: function(name, description, counter, subactivitiesCollection) {
		
			this.set({
			
				/**
				 * @property name
				 * @type string
				 */
				"name"                    : name,
				
				/**
				 * @property description
				 * @type string
				 */
				"description"             : description,
				
				/**
				 * @property counter
				 * @type Counter
				 */
				"counter"                 : counter,
				
				/**
				 * @property subactivitiesCollection
				 * @type SubactivityCollection
				 */
				"subactivitiesCollection" : subactivitiesCollection
			});

			subactivitiesCollection.on('updateCounter', this.updateCounter, this);
			subactivitiesCollection.on('change:selected', this.updateView, this);
			this.updateView();
		},

		
		/**
		 * @method updateView
		 */
		updateView: function() {
			var count = 0;
			this.get('subactivitiesCollection').each(function(sub) {
				if ( sub.isSelected() ) {
					count++;
				}
			});

			if ( count == 0 ) {
				this.trigger('hideHeader');
			} else {
				this.trigger('showHeader');
			}
		},

		
		/**
		 * @method sortMethods
		 */
		sortMethods: function() {
			this.get('subactivitiesCollection').each(function(sub) {
				sub.sortMethods();
			});
		},

		
		/**
		 * @method changeOrderMethodsView
		 */
		changeOrderMethodsView: function() {
			this.get('subactivitiesCollection').each(function(sub) {
				sub.changeOrderMethodsView();
			});
		},

		
		/**
		 * @method hideMethods
		 * @param sliderValue {number} 
		 */
		hideMethods: function(sliderValue) {
			this.get('subactivitiesCollection').each(function(sub) {
				sub.hideMethods(sliderValue);
			});

			this.updateCounter();
		},

		
		/**
		 * @method updateMethods
		 * @param sliderValue {number}
		 */
		updateMethods: function(sliderValue) {
			this.get('subactivitiesCollection').each(function(sub) {
				sub.sortMethods();
				sub.changeOrderMethodsView();
				sub.hideMethods(sliderValue);
			});

			this.updateCounter();
		},

		
		/**
		 * @method getMethods
		 * @return methodCollection {MethodCollection}
		 */
		getMethods: function() {
			var methods = new UP.MethodCollection();

			this.get('subactivitiesCollection').each(function(sub) {
				sub.getMethods().each(function(m) {
					methods.add( m );
				});
			});

			return methods;
		},

		
		/**
		 * @method getSelectedMethods
		 * @return methodCollection {MethodCollection}
		 */
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

		
		/**
		 * @method countSelectedMethods
		 * @return count {number}
		 */
		countSelectedMethods: function() {
			var count = 0;

			this.get('subactivitiesCollection').each(function(sub) {
				if ( sub.isSelected() ) {
					count += sub.countSelectedMethods();
				}
			});

			return count;
		},

		
		/**
		 * @method isSelected
		 */
		updateCounter: function() {
			var count = this.countSelectedMethods();
			this.get('counter').updateValue(count);
		}

	});
