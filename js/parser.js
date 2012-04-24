
//$(document).ready(function() {

	function Method(jqObject, constraints) {
		this.jqObject    = jqObject;
		this.constraints = constraints;
		this.selected    = true;
		this.valoration  = 0;

		var obj = {};

		obj.constraints = constraints;
	
		obj.calculateValoration = (function(constraint) {
			constraints.each(function(i) {
				var that = $(this);
				var weight;

				if (that.val() === constraint) {
					weight = that.attr('weight');
					this.valoration += weight;
				}
			});
		});

		return obj;
	}

	var arrayMethods = new Array();


	function parseXML() {

		$.get('xml/projectStagesDataDevelopers.xml', function(xml) {
			var $methodsDOM = $('.method');

			// Find every method in XML file and create an object to represent it
			$(xml).find('method').each(function(i) {
			    var jqObject = $methodsDOM.eq(i);
		           var constraints  = $(this).find('constraint');
			    var m = Method(jqObject, constraints);
			    arrayMethods.push(m);
			});

			console.log(arrayMethods[1].constraints);
		});

	};

	parseXML();

//});