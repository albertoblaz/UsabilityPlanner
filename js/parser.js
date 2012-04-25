	
	// Parsing XML
	(function() {

		$.get('xml/projectStagesDataDevelopers.xml', function(xml) {
			var $methodsDOM = $('.method');
			var methodCol = new UP.MethodCollection();
			
			// Find every method in XML file and create an object to represent it
			$(xml).find('method').each(function(i) {
				var constraints  = $(this).find('method').find('constraint');

				var weights = [];
				constraints.each(function(i) {
					self = $(this);
					console.log(self);
					if (self != '[]') {
						var name = self.text();
						var numberWeight = parseInt(self.attr('weight'));

						console.log(name);
						console.log(numberWeight);

						var w = new UP.Weight(name, numberWeight);
						weights.push(w);
					}
				});

				var method = new UP.Method(weights);
				var jqObject = $methodsDOM.eq(i);

				var methodView = new UP.MethodView(method, jqObject);
			});

			function createWeights(constraints) {
				var weight;
				var listWeights = [];

				

				return listWeights;
			}

		});

	})();

