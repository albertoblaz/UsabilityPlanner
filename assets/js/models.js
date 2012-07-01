	
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
		},


		/**
		 * @method getValue
		 * @return sliderValue {number}
		 */
		setValue: function(value) {
			this.set({ 'sliderValue' : value });
			this.trigger('render');
		}

	});


	/**
	 * @module UP
	 * @submodule Models
	 * @class CostBenefit
	 * @extends Backbone.Model
	 */	
	UP.CostBenefit = Backbone.Model.extend({

		/**
		 * @method initialize
		 * @param name {string}
		 * @param description {string}
		 * @param weightCollection {WeightCollection}
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
				 * @property name
				 * @type string
				 */
				"description"      : description,
			
				/**
				 * @property name
				 * @type string
				 */
				"selected"         : false,

				/**
				 * @property costBenefitCollection
				 * @type CostBenefitCollection
				 */
				"costBenefitCollection" : new UP.CostBenefitCollection()

			});

		},

		
		changeSelection: function() {
			var oldState = this.get('selected');
			
			if ( oldState === false ) {
				this.selectCostBenefit();
			} else {
				this.unselectCostBenefit();
			}

		},

		
		selectCostBenefit: function() {
			this.set({ "selected" : true });
			this.selectAllChildren();
		},

		
		unselectCostBenefit: function() {
			this.set({ "selected" : false });
			this.unselectAllChildren();
		},
		
		
		selectAllChildren: function() {
			var col = this.get('costBenefitCollection');
			col.each(function(cb) {
				cb.selectFromParent();
			});
		},


		unselectAllChildren: function() {
			var col = this.get('costBenefitCollection');
			col.each(function(cb) {
				cb.unselectFromParent();
			});
		},


		compareNameWith: function(name) {
			return this.get('name') === name;
		},


		getName: function() {
			return this.get('name');
		},


		getDescription: function() {
			return this.get('description');
		},


		addCostBenefit: function(cb) {
			var col = this.get('costBenefitCollection').add( cb );
			//col.on('check', this.checkAllSelected, this);
		},


		addCostBenefits: function(list) {
			var col = this.get('costBenefitCollection');
			list.each(function(cb) {
				col.add( cb );
			});
		},


		isSelected: function() {
			return this.get('selected');
		}

	});	


	/**
	 * @module UP
	 * @submodule Models
	 * @class CostBenefitChild
	 * @extends UP.CostBenefit
	 */	
	UP.CostBenefitChild = UP.CostBenefit.extend({

		/**
		 * @method initialize
		 * @param name {string}
		 * @param description {string}
		 * @param weightCollection {WeightCollection}
		 * @constructor
		 */
		initialize: function(name, description, weightCollection) {
			this.set({

				/**
				 * @property name
				 * @type string
				 */
				"name"             : name,

				/**
				 * @property name
				 * @type string
				 */
				"description"      : description,

				/**
				 * @property weightCollection
				 * @type WeightCollection
				 */
				"weightCollection" : new UP.WeightCollection(),
	
				/**
				 * @property selected
				 * @type boolean
				 */
				"selected"         : false,

				/**
				 * @property visible
				 * @type boolean
				 */
				"visible"          : false

			});

		},


		show: function() {
			this.set({ "visible" : true });
		},


		hide: function() {
			this.set({ "visible" : false });
		},


		changeSelection: function() {
			var oldState = this.get('selected');
			
			if ( oldState === false ) {
				this.selectCostBenefit();
			} else {
				this.unselectCostBenefit();
			}
/*
			var oldVisible = this.get('visible');
			this.set({ 'visible' : !oldVisible });
*/

//			this.trigger('check');
		},


		selectFromParent: function() {
			this.selectCostBenefit();
			this.trigger('checkInput');
/*
			var selected = true;
			var col = this.get('weightCollection');

			col.each(function(w) {
				var sub = w.getMeasurable();
				if ( !sub.isSelected() ) {
					selected = false;
				}
			});

			if ( selected ) {
				this.selectCostBenefit();
				this.trigger('checkInput');
			}
*/
		},


		unselectFromParent: function() {
			this.unselectCostBenefit();
			this.trigger('uncheckInput');
/*
			var selected = true;
			var col = this.get('weightCollection');

			col.each(function(w) {
				var sub = w.getMeasurable();
				if ( !sub.isSelected() ) {
					selected = false;
				}
			});


			if ( selected ) {
				this.unselectCostBenefit();
				this.trigger('uncheckInput');
			}
*/
		},


		selectCostBenefit: function() {
			var selected = this.get('selected');
			if ( !selected ) {
				this.set({ "selected" : true });
				this.incrementValue();
			}
		},

		
		unselectCostBenefit: function() {
			this.set({ "selected" : false });
			this.decrementValue();
		},
		
		
		incrementValue: function() {
			this.get('weightCollection').each(function(w) {
				w.incrementValue();
			});
		},
		
		
		decrementValue: function() {
			this.get('weightCollection').each(function(w) {	
				w.decrementValue();
			});
		},


		compareNameWith: function(name) {
			return this.get('name') === name;
		},


		getName: function() {
			return this.get('name');
		},


		getDescription: function() {
			return this.get('description');
		},


		addWeight: function(w) {
			this.get('weightCollection').add( w );
		},


		addWeights: function(ww) {
			var col = this.get('weightCollection');

			ww.each(function(w) {
				col.add( w );
			});
		},


		isSelected: function() {
			return this.get('selected');
		}, 	


		isVisible: function() {
			return this.get('visible');
		}, 


		setVisible: function(param) {
			this.set({ 'visible' : param });
		},


		toCSV: function() {
			return this.get('name');
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
		initialize: function(measurable, value) {
		
			this.set({
			
				/**
				 * @property method
				 * @type Method
				 */
				"measurable" : measurable,
				
				/**
				 * @property value
				 * @type number
				 */
				"value" : value
			});
			
		},

		
		/**
		 * @method incrementValue
		 */
		incrementValue: function() {
			var value = this.get('value');
			this.get('measurable').incrementValue(value);
		},

		
		/**
		 * @method decrementValue
		 */
		decrementValue: function() {
			var value = this.get('value');
			this.get('measurable').decrementValue(value);
		},


		/**
		 * @method compareNameWith
		 * @param name {string} 
		 * @return equals {boolean}
		 */
		compareNameWith: function(name) {
			return this.get('measurable').compareNameWith(name);
		},

		
		/**
		 * @method getMethodName
		 * @return name {string}
		 */
		getMethodName: function() {
			return this.get('measurable').getName();
		},

		
		/**
		 * @method getValue
		 * @return value {string}
		 */
		getValue: function() {
			return this.get('value');
		},

	
		getMeasurable: function() {
			return this.get('measurable');
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
		 * @method updateValue
		 * @param newValue {number}
		 */
		updateValue: function(newValue) {
			var oldValue = this.get('value');
			this.set({ value : newValue });

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
		initialize: function(name, description, url, selected) {
			if ( selected === "Yes" ) {
				selected = true;
			} else {
				selected = false;
			}

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
				"selected"         : false || selected,

				/**
				 * @property enabled
				 * @type boolean
				 * @default "false"
				 */
				"enabled"         : false,
							
				/**
				 * @property value
				 * @type number
				 * @default "0"
				 */
				"value"            : 100,
				
				/**
				 * @property textValue
				 * @type string
				 * @default '""'
				 */
				"textValue"        : "",

				/**
				 * @property inappropiate
				 * @type boolean
				 * @default "false"
				 */
				"inappropiate"     : false,

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
			var value = 0;
			var textValue = "";
			var currentValue = this.getValue();
			var inappropiate = this.isInappropiate();

			switch ( weightValue ) {  
				case 0 : inappropiate = true;   break;
				case 1 : value =   -2;   break;
				case 2 : value =   -1;   break;
				case 3 : value =    0;   break;
				case 4 : value =    1;   break;
				case 5 : value =    2;   break;
			}

			currentValue += value;

			if  ( inappropiate === true ) {
				textValue = UP.constants.VALUE[5];
			} else {
				if ( currentValue < 100 ) {
					textValue = UP.constants.VALUE[4];
				} else if ( currentValue === 100 ) {
					textValue = UP.constants.VALUE[3];
				} else if ( currentValue === 101 ) {
					textValue = UP.constants.VALUE[2];
				} else if ( currentValue === 102 ) {
					textValue = UP.constants.VALUE[1];
				} else if ( currentValue >= 103 ) {
					textValue = UP.constants.VALUE[0];
				}
			}

			this.set({
				"value"         : currentValue,
				"textValue"     : textValue,
				"inappropiate"  : inappropiate,
				"numIncrements" : this.get('numIncrements') + 1
			});

			// Calling the controller to update the view
			this.trigger('render');
		},


		/**
		 * @method decrementValue
		 * @param weightValue {number}
		 */
		decrementValue: function(weightValue) {
			var value = 0;
			var textValue = "";
			var currentValue = this.getValue();
			var inappropiate = this.isInappropiate();

			switch ( weightValue ) {  
				case 0 : inappropiate = false;   break;
				case 1 : value =   -2;   break;
				case 2 : value =   -1;   break;
				case 3 : value =    0;   break;
				case 4 : value =    1;   break;
				case 5 : value =    2;   break;
			}

			currentValue += value * (-1);

			if  ( inappropiate === true ) {
				textValue = UP.constants.VALUE[5];
			} else {
				if ( currentValue < 100 ) {
					textValue = UP.constants.VALUE[4];
				} else if ( currentValue === 100 ) {
					textValue = UP.constants.VALUE[3];
				} else if ( currentValue === 101 ) {
					textValue = UP.constants.VALUE[2];
				} else if ( currentValue === 102 ) {
					textValue = UP.constants.VALUE[1];
				} else if ( currentValue >= 103 ) {
					textValue = UP.constants.VALUE[0];
				}
			}

			this.set({
				"value"         : currentValue,
				"textValue"     : textValue,
				"inappropiate"  : inappropiate,
				"numIncrements" : this.get('numIncrements') - 1
			});

			// Calling the controller to update the view
			this.trigger('render');
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
			if ( this.get('numIncrements') === 0 && !this.isInappropiate()	&& this.getValue() === 100 ) {
				this.trigger('showNeutral');
			} else {
				var param = { sliderValue : sliderValue };
				this.trigger('hideMethod', param);
			}
		},

		
		/**
		 * @method changeSelection
		 */
		changeSelection: function() {
/*
			var selected = this.get('selected');
			this.set({ "selected" : !selected });
*/
			var enabled = this.get('enabled');
			this.set({ "enabled" : !enabled });
		},

		
		/**
		 * @method selectMethod
		 */
		selectMethod: function() {
			if ( this.get('value') > 0 ) {
				this.set({
					"selected" : true
				});
			}
		},

		enableMethod: function() {
			this.set({
				"enabled"  : true
			});

			this.trigger('disable');
		},

				
		/**
		 * @method unselectMethod
		 */
		unselectMethod: function() {
			this.set({
				"selected" : false
			});
		},


		/**
		 * @method disableMethod
		 */
		disableMethod: function() {
			this.set({
				"enabled"  : false
			});

			this.trigger('disable');
		},
	
	
		/**
		 * @method isSelected
		 * @return selected {boolean}
		 */
		isSelected: function() {
			return this.get('selected');
		},


		isEnabled: function() {
			return this.get('enabled');
		},


		/**
		 * @method isInappropiate
		 * @return inappropiate {boolean}
		 */
		isInappropiate: function() {
			return this.get('inappropiate');
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
		 * @method getTextValue
		 * @return textValue {string}
		 */
		getTextValue: function() {
			return this.get('textValue');
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
			var name     = this.get('name') + ";" ;
			var enabled  = this.get('enabled');
			var value    = this.get('textValue');

			if ( enabled === true ) {
				enabled = "Yes;";
			} else {
				enabled = "No;";
			}

			return (name + enabled + value);
		},


		showLast: function() {
			this.trigger('showLast');
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
		initialize: function(name, description, selected) {
		
			if ( selected === "Yes") {
				selected = true;
			} else {
				selected = false;
			}

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
				"selected"         : false || selected

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
				w.incrementValue();
			});
		},

		
		/**
		 * @method decrementMethodsValue
		 */
		decrementMethodsValue: function() {
			this.get('weightCollection').each(function(w) {	
				w.decrementValue();
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
			var name = this.get('name') + ";";
			var selected = this.get('selected');

			if ( selected ) {
				selected = "Yes";
			} else {
				selected = "No";
			}

			return (name + selected);
		},

		replaceData: function( newC ) {
			if ( this.isSelected() ) {
				this.unselectConstraint();
			}

			if ( newC.isSelected() ) {
				this.selectConstraint();
			}
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
		initialize: function(name, description) {
			
			this.set({
			
				/**
				 * @property name
				 * @type string
				 */
				"name"                         : name,
				
				/**
				 * @property description
				 * @type string
				 */
				"description"                  : description,
				
				/**
				 * @property methodCollection
				 * @type MethodCollection
				 */
				"methodCollection"             : new UP.MethodCollection(),

				/**
				 * @property costBenefitCollection
				 * @type CostBenefitCollection
				 */
				"costBenefitCollection"        : new UP.CostBenefitCollection(),
			
				/**
				 * @property selected
				 * @type boolean
				 * @default "false"
				 */
				"selected"                     : false,

				/**
				 * @property costValue
				 * @type Number
				 * @default "100"
				 */
				"costValue"                    : 100

			});

		},


		/**
		 * @method changeSelection
		 */
		changeSelection: function() {
			var wasSelected = this.get('selected');
			this.set({ "selected" : !wasSelected });

			if ( wasSelected ) {
				this.hideBenefits();
				this.get('methodCollection').each(function(m) {
					m.unselectMethod();
					m.disableMethod();
				});
			} else {
				this.showBenefits();
				this.get('methodCollection').each(function(m) {
					m.selectMethod();
					m.enableMethod();
				});
			}

			this.trigger('updateCounter');
			//this.trigger('displayBenefits');
		},

		
		/**
		 * @method selectSubactivity
		 */
		selectSubactivity: function() {
			this.set({ "selected" : true });
			this.trigger('changeDisplayList');
			//this.trigger('displayBenefits');
			this.showBenefits();
		},


		/**
		 * @method unselectSubactivity
		 */
		unselectSubactivity: function() {
			this.set({ "selected" : false });
			this.trigger('changeDisplayList');
			this.hideBenefits();
		},
	
	
		showBenefits: function() {
			var col = this.get('costBenefitCollection');
			col.each(function(cb) {
				cb.show();
			});
		},


		hideBenefits: function() {
			var col = this.get('costBenefitCollection');
			col.each(function(cb) {
				cb.hide();
			});
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
			var col = this.get('methodCollection');

			col.each(function(method) {
				method.changeOrderView();
			});

			var lastMethod = col.at( col.length-1 );
			lastMethod.showLast();
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
		},


		addCostBenefit: function(cb) {
			this.get('costBenefitCollection').add( cb );
		},


		/**
		 * @method incrementValue
		 * @param weightValue {Number}
		 */
		incrementValue: function(weightValue) {
			var value        = 0;
			var currentValue = this.get('costValue');

			switch ( weightValue ) {  
				case 1 : value =   -2;   break;
				case 2 : value =   -1;   break;
				case 3 : value =    0;   break;
				case 4 : value =    1;   break;
				case 5 : value =    2;   break;
			}

			currentValue += value;
			this.set({ 'costValue' : currentValue });
		},


		/**
		 * @method decrementValue
		 * @param weightValue {Number}
		 */
		decrementValue: function(weightValue) {
			var value        = 0;
			var currentValue = this.get('costValue');

			switch ( weightValue ) {  
				case 1 : value =   -2;   break;
				case 2 : value =   -1;   break;
				case 3 : value =    0;   break;
				case 4 : value =    1;   break;
				case 5 : value =    2;   break;
			}

			currentValue -= value;

			this.set({ 'costValue' : currentValue });
		},

		getCostValue: function() {
			return this.get('costValue');
		},

		toCSV: function() {
			var output = this.get('name') + ";";

			this.get('methodCollection').each(function(m) {
				output += m.toCSV()
			});

			return output;
		},


		selectedToCSV: function() {
			var name = this.get('name');
			var output = "";

			this.get('methodCollection').each(function(m) {
				if ( m.isSelected() ) {
					output += name + ";" + m.toCSV() + ";\r\n";
				}
			});

			return output;
		},

		costBenefitsToCSV: function() {
			var name = this.get('name');
			var output = "";

			this.get('costBenefitCollection').each(function(cb) {
				if ( cb.isSelected() ) {
					output += name + ";" + cb.toCSV() + ";\r\n";
				}
			});

			return output;
		},

		addMethod: function(m) {
			this.get('methodCollection').add( m );
		},

		replaceData: function(newS) {
			var oldMethods = this.get('methodCollection');
			var newMethods = newS.getMethods();

			oldMethods.each(function(oldM) {
				oldM.enableMethod();
				oldM.unselectMethod();
			});

			oldMethods.each(function(oldM) {
				newMethods.each(function(newM) {
					if ( newM.compareNameWith(oldM.getName()) ) {
						oldM.selectMethod();
						if ( !newM.isSelected() ) {
							oldM.disableMethod();
						}
					}
				});
			});

			var oldCosts = this.get('costBenefitCollection');
			var newCosts = newS.get('costBenefitCollection');

			oldCosts.each(function(cb) {
				cb.unselectFromParent();
			});

			oldCosts.each(function(oldCB) {
				newCosts.each(function(newCB) {
					if ( newCB.compareNameWith(oldCB.getName()) ) {
						oldCB.selectFromParent();
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
		initialize: function(name, description, counter) {
		
			this.set({
			
				/**
				 * @property name
				 * @type string
				 */
				"name"                        : name,
				
				/**
				 * @property description
				 * @type string
				 */
				"description"                 : description,
				
				/**
				 * @property counter
				 * @type Counter
				 */
				"counter"                     : counter,
				
				/**
				 * @property subactivitiesCollection
				 * @type SubactivityCollection
				 */
				"subactivitiesCollection"     : new UP.SubactivityCollection(),

				/**
				 * @property costBenefitWeightCollection
				 * @type SubactivityCollection
				 */
				"costBenefitWeightCollection" : new UP.WeightCollection()
			});

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
				this.trigger('hideActivityRow');
			} else {
				this.trigger('showHeader');
				this.trigger('showActivityRow');
			}

			//this.checkAllSubactivitiesSelected();
		},


		checkAllSubactivitiesSelected: function() {
			var self = this;
			var col = this.get('subactivitiesCollection');
			var noSelected = false;

			col.each(function(sub) {
				if ( sub.isSelected() ) {
					self.trigger('showActivityRow');
					noSelected = true;
					return noSelected;
				}
			});

			
			if ( noSelected == false ) {
				this.trigger('hideActivityRow');
			}

			return noSelected;
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
		 * @method getSubactivities
		 * @return subactivities
		 */
		getSubactivities: function() {
			return this.get('subactivitiesCollection');
		},


		/**
		 * @method getSubactivities
		 * @return subactivities
		 */
		getSelectedSubactivities: function() {
			var col = new UP.SubactivityCollection();

			this.get('subactivitiesCollection').each(function(sub) {
				if ( sub.isSelected() ) {
					col.add( sub );
				}
			});

			return col;
		},


		/**
		 * @method isSelected
		 */
		updateCounter: function() {
			var count = this.countSelectedMethods();
			this.get('counter').updateValue(count);
		},


		costBenefitsToCSV: function() {
			var subs = this.getSelectedSubactivities();

			var output = "";
			subs.each(function(s) {
				output += s.costBenefitsToCSV();
			});

			output = this.insertActivityName(output);
			return output;
		},


		selectedToCSV: function() {
			var subs = this.getSelectedSubactivities();

			var output = "";
			subs.each(function(s) {
				output += s.selectedToCSV();
			});

			output = this.insertActivityName(output);
			return output;
		},


		insertActivityName: function(text) {
			var name = this.get('name') + ";";
			var guess = "\r\n";

			var oldIndex = 0;
			var index = text.indexOf(guess);

			var output = "";
			while(index >= 0) {
				index+=2;
				output += name + text.substring(oldIndex, index);
				oldIndex = index;
				index = text.indexOf(guess, index);
			}

			return output;
		},

		addSubactivity: function(sub) {
			var col = this.get('subactivitiesCollection');

			col.add( sub );
			col.on('updateCounter', this.updateCounter, this);
			col.on('change:selected', this.updateView, this);
		},

		replaceData: function(newA) {
			this.unselectAllSubactivities();

			var oldSubs = this.get('subactivitiesCollection');
			var newSubs = newA.getSubactivities();

			oldSubs.each(function(oldS) {
				newSubs.each(function(newS) {
					if ( newS.compareNameWith(oldS.getName()) ) {
						oldS.selectSubactivity();
						oldS.replaceData( newS );
					}
				});
			});
		},

		getName: function() {
			return this.get('name');
		},

		compareNameWith: function(name) {
			return this.get('name') === name;
		},

		unselectAllSubactivities: function() {
			this.get('subactivitiesCollection').each(function(s) {
				s.unselectSubactivity();
			});
		}

	});
