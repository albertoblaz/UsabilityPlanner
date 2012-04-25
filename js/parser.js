	
	// Parsing XML
	(function() {

		$.get('xml/projectStagesDataDevelopers.xml', function(xml) {
			var $methodsDOM = $('.method');
			var methodCol = new MethodCollection();
			
			// Find every method in XML file and create an object to represent it
			$(xml).find('method').each(function(i) {
				var method = new Method();

			    var jqObject = $methodsDOM.eq(i);
				
				var methodView = new MethodView(jqObject);
				
				var constraints  = $(this).find('constraint');
			    
			    arrayMethods.push(m);
			});

			console.log(arrayMethods[1].constraints);
		});

	})();

