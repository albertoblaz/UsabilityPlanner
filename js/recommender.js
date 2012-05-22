
	UP.Recommender = Backbone.Model.extend({
		initialize: function() {
			// Business Attributes
			this.set({
				"planner"     : new UP.Planner(),
				"fileManager" : new UP.FileManager(),
				"csvParser"   : new UP.CSVParser(),
				"xmlParser"   : new UP.XMLParser(UP.constants.XML)
			});


			this.get('fileManager').on('downloadReady', function() {
				this.trigger('downloadReady');
			}, this);


			var plan = this.get('xmlParser').parse();
			console.log(plan);
			this.get('planner').loadInitPlan(plan);
		},


		downloadPlan: function() {
			var success = false;

			var plan = this.get('planner').savePlan();
			var csv  = this.get('csvParser').generateCSVFrom(plan);
			this.get('fileManager').downloadFile(csv, success);
		},


		uploadPlan: function(file) {
			var success = false;

			var csv  = this.get('fileManager').uploadFile(file);
			var plan = this.get('csvParser').generatePlanFrom(csv);
			success  = this.get('planner').loadNewPlan(plan);

			return success;
		}

	});
