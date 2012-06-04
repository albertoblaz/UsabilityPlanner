	
	/**
	 * @module UP
	 * @submodule Util
	 * @class CSVParser
	 * @extends Backbone.Model
	 */	
	UP.CSVParser = Backbone.Model.extend({

		/**
		 * @method CSVToArray
		 * @param strData {string} 
		 * @param strDelimiter {string} 
		 */
		CSVToArray: function(strData, strDelimiter) {
			// The code of this method has been extracted from:  http://stackoverflow.com/questions/1293147/javascript-code-to-parse-csv-data

			// Check to see if the delimiter is defined. If not, // then default to comma.
			strDelimiter = (strDelimiter || ";");

			// Create a regular expression to parse the CSV values.
			var objPattern = new RegExp(
				(
					// Delimiters.
					"(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +

					// Quoted fields.
					"(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

					// Standard fields.
					"([^\"\\" + strDelimiter + "\\r\\n]*))"

				), "gi"
			);


			// Create an array to hold our data. Give the array a default empty first row.
			var arrData = [[]];

			// Create an array to hold our individual pattern matching groups.
			var arrMatches = null;


			// Keep looping over the regular expression matches until we can no longer find a match.
			while (arrMatches = objPattern.exec( strData )){

					// Get the delimiter that was found.
					var strMatchedDelimiter = arrMatches[ 1 ];

					// Check to see if the given delimiter has a length (is not the start of string) and if it matches field delimiter. 
					// If id does not, then we know that this delimiter is a row delimiter.
					if ( strMatchedDelimiter.length && (strMatchedDelimiter != strDelimiter) ) {

							// Since we have reached a new row of data, add an empty row to our data array.
							arrData.push( [] );
					}


					// Now that we have our delimiter out of the way, let's check to see which kind of value we captured (quoted or unquoted).
					if ( arrMatches[ 2 ] ) {

							// We found a quoted value. When we capture this value, unescape any double quotes.
							var strMatchedValue = arrMatches[ 2 ].replace( new RegExp( "\"\"", "g" ), "\"" );

					} else {

							// We found a non-quoted value.
							var strMatchedValue = arrMatches[ 3 ];

					}


					// Now that we have our value string, let's add it to the data array.
					arrData[ arrData.length - 1 ].push( strMatchedValue );
			}

			// Return the parsed data.
			return( arrData );
		},

		
		/**
		 * @method generatePlanFrom
		 * @param csv {string} 
		 * @return newPlan {Plan}
		 */
		generatePlanFrom: function(csv) {
			var data = this.CSVToArray(csv);

			var newConstraints = new UP.ConstraintCollection();
			var newMethods     = new UP.MethodCollection();

			var constraintsName = data[0];
			var name, c;
			for ( var i=2; i < constraintsName.length; i++) {
				name = constraintsName[i];
				c = new UP.Constraint(name);
				newConstraints.add( c );
			}

			var dataMethod, name, m;
			for ( var i=1; i < data.length; i++ ) {
				dataMethod = data[i];
				name = dataMethod[0];
				m = new UP.Method( name );


				var weightValue, w, c;
				for ( var j=2; j < dataMethod.length; j++ ) {
					weightValue = parseInt( dataMethod[j] );
					w = new UP.Weight( m, weightValue);
					m.addWeight( w );
					c = newConstraints.at( j-2 );
					c.addWeight( w );
				}

				newMethods.add( m );
			}

			var newPlan = new UP.Plan( newConstraints, null );
			newPlan.setNewMethods( newMethods );

			return newPlan;
		},
		
		
		/**
		 * @method generateCSVFrom
		 * @param plan {Plan} 
		 * @return csv {string}
		 */
		generateCSVFrom: function(plan) {
			var constraints = plan.getConstraints();
			var methods = plan.getSelectedMethods();

			var csv = "Method;Value";

			constraints.each(function(c) {
				csv += c.toCSV();
			});

			methods.each(function(m) {
				csv += ("\r\n" + m.toCSV());
			});

			return csv;
		}

	});