
	/**
	 * @module UP
	 * @submodule App
	 * @class Recommender
	 * @extends Backbone.Model
	 */	
	UP.Recommender = Backbone.Model.extend({
	
		/**
		 * @method initialize
		 * @constructor
		 */
		initialize: function() {

			this.set({
			
				/**
				 * @property planner
				 * @type Planner
				 * @default "new Planner()"
				 */
				"planner"     : new UP.Planner(),
				
				/**
				 * @property fileManager
				 * @type FileManager
				 * @default "new FileManager()"
				 */
				"fileManager" : new UP.FileManager(),
				
				/**
				 * @property csvParser
				 * @type CSVParser
				 * @default "new CSVParser()"
				 */
				"csvParser"   : new UP.CSVParser(),
				
				/**
				 * @property xmlParser
				 * @type XMLParser
				 * @default "new XMLParser()"
				 */
				"xmlParser"   : new UP.XMLParser(UP.constants.XML)
			});


			this.get('fileManager').on('downloadReady', function() {
				this.trigger('downloadReady');
			}, this);


			var plan = this.get('xmlParser').parse();
			
			this.get('planner').loadInitPlan(plan);
		},

		
		/**
		 * @method downloadPlan
		 */
		downloadPlan: function() {
			var success = false;

			var plan = this.get('planner').savePlan();
			var csv  = this.get('csvParser').generateCSVFrom(plan);
			this.get('fileManager').downloadFile(csv, success);
		},


		/**
		 * @method uploadPlan
		 * @param file {Object}
		 */
		uploadPlan: function(file) {
			var success = false;

			var csv  = this.get('fileManager').uploadFile(file);
			var plan = this.get('csvParser').generatePlanFrom(csv);
			success  = this.get('planner').loadNewPlan(plan);

			return success;
		}

	});
