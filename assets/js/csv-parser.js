	
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


		organizeDataInArrays: function(csv) {
			this.CSVToArray(csv);
		},

		
		/**
		 * @method generatePlanFrom
		 * @param csv {string} 
		 * @return newPlan {Plan}
		 */
		generatePlanFrom: function(csv) {
			var data = this.CSVToArray(csv);

			var newConstraints = new UP.ConstraintCollection();
			var newActivities  = new UP.ActivityCollection();
			var sliderValue;

			var actName, subName, methodName, constraintName;
			var oldActName, oldSubName, title;

			var activity, subactivity, method, selected;

			var arrayConstraintsName = [];
			var arrayMethodsName = [];

			var row;
			for ( var i=0; i < data.length; i++ ) {
				row = data[i];

				title = row[0];
				if (title === "Filter Value") {
					sliderValue = row[1];
				} else if (title != "Activities" && title != "Constraints") {

					if ( row.length === 6) {		// Methods
						actName    = row[0];
						subName    = row[1];
						methodName = row[2];
						selected   = row[3];

						if ( oldActName != actName ) {
							subactivity = new UP.Subactivity(subName);
							activity    = new UP.Activity(actName);
							activity.addSubactivity(subactivity);
							newActivities.add(activity);

						} else if ( oldSubName != subName ) {
							subactivity = new UP.Subactivity(subName);
							activity.addSubactivity(subactivity);
						}

						method = new UP.Method(methodName, "", "", selected);
						subactivity.addMethod(method);

						if ( selected === "Yes" ) {
							arrayMethodsName.push( methodName );
						}

						oldActName = actName;
						oldSubName = subName;

					} else if ( row.length === 3) {		// Constraints
						constraintName = row[0];
						selected = row[1];

						if ( selected === "Yes" ) {
							arrayConstraintsName.push( constraintName );
						}

						constraint = new UP.Constraint(constraintName, "", selected);
						newConstraints.add(constraint);
				
					} else if ( row.length === 4) {		// Cost Benefits
						subName  = row[1];
						costName = row[2];

						costBenefit = new UP.CostBenefitChild(costName);

						newActivities.each(function(act) {
							act.getSubactivities().each(function(sub) {
								sub.addCostBenefit( costBenefit );
							});
						});

					}

				} // if

			} // for

			var length = arrayConstraintsName.length;
			var str = "Plan uploaded.\n\nSelected constraints (" + length + "): ";
			for (var i=0; i < length; i++) {
				if ( i === length-1 ) {
					str += arrayConstraintsName[i] + ".\n\n";
				} else {
					str += arrayConstraintsName[i] + ", ";
				}
			}

			var length = arrayMethodsName.length;
			str += "Selected methods (" + length + "): ";
			for (var i=0; i < length; i++) {
				if ( i === length-1 ) {
					str += arrayMethodsName[i] + ".\n\n";
				} else {
					str += arrayMethodsName[i] + ", ";
				}
			}

			alert(str);

			var plan = new UP.Plan( newConstraints, newActivities );
			plan.setSliderValue( sliderValue );

			return plan;
		},
		
		
		/**
		 * @method generateCSVFrom
		 * @param plan {Plan} 
		 * @return csv {string}
		 */
		generateCSVFrom: function(plan) {
			var csv = "";

			var constraints = plan.getConstraints();
			var activities  = plan.getActivities();
			var sliderValue = plan.getSliderValue();


			// Converting the methods
			csv += "Activities;Subactivities;Methods;Selected;Recommendation;\r\n";
			activities.each(function(act) {
				csv += act.selectedToCSV();
			});

			csv += "\r\n\r\n";
			csv += "Filter Value;" + sliderValue + ";\r\n"
			csv += "\r\n\r\n";


			// Converting the constraints
			csv += "Constraints;Selected;\r\n";
			constraints.each(function(c) {
				csv += c.toCSV() + ";\r\n";
			});
			csv += "\r\n\r\n\r\n";

		
			// Converting the activities and cost benefits
			csv += "Activities;Subactivities;Cost Benefits Selected;\r\n";
			activities.each(function(act) {
				csv += act.costBenefitsToCSV();
			});
			csv += "\r\n\r\n\r\n";

			return csv;
		}

	});
