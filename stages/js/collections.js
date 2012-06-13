	
	/**
	 * @module UP
	 * @submodule Collections
	 * @class WeightCollection
	 * @extends Backbone.Collection
	 */	
	UP.WeightCollection = Backbone.Collection.extend({
	
		/**
		 * The type of model object contained by the collection
		 * @property model
		 * @type Weight
		 */
		model: UP.Weight
		
	});

	
	
	/**
	 * @module UP
	 * @submodule Collections
	 * @class WeightCollection
	 * @extends Backbone.Collection
	 */	
	UP.MethodCollection = Backbone.Collection.extend({
	
		/**
		 * The type of model object contained by the collection
		 * @property model
		 * @type Method
		 */
		model: UP.Method,
		
		
		/**
		 * @method comparator
		 * @param method {Method} The object used to make a comparison when sorting
		 * @return value {number} The value of the method compared
		 */
		comparator: function(method) {
			return method.getValue();
		}
		
	});

	
	
	/**
	 * @module UP
	 * @submodule Collections
	 * @class WeightCollection
	 * @extends Backbone.Collection
	 */	
	UP.ConstraintCollection = Backbone.Collection.extend({
	
		/**
		 * The type of model object contained by the collection
		 * @property model
		 * @type Constraint
		 */
		model: UP.Constraint
		
	});


	
	/**
	 * @module UP
	 * @submodule Collections
	 * @class WeightCollection
	 * @extends Backbone.Collection
	 */	
	UP.SubactivityCollection = Backbone.Collection.extend({
	
		/**
		 * The type of model object contained by the collection
		 * @property model
		 * @type Subactivity
		 */
		model: UP.Subactivity
		
	});


	
	/**
	 * @module UP
	 * @submodule Collections
	 * @class WeightCollection
	 * @extends Backbone.Collection
	 */	
	UP.ActivityCollection = Backbone.Collection.extend({
	
		/**
		 * The type of model object contained by the collection
		 * @property model
		 * @type Activity
		 */
		model: UP.Activity
		
	});
	