	
	UP.Admin.CSVConverter = {

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


		csvToXml: function(csv, xmlFile) {
			var self = this;

			xmlFile = assets(xmlFile);
			$.get( xmlFile, (function(xmlDoc) {
				var xml = $(xmlDoc);

				var i, j;
				var act, sub, met;
				var row, constraints = [];

				var data = self.CSVToArray(csv);

				row = data[0];

				for (j=3; j < row.length; j++) {
					constraints.push( row[j] );
				}

				for (i=1; i < data.length; i++) {
					row = data[i];

					act = row[0];
					sub = row[1];
					met = row[2];

//					var activity    = $( xml.find("activity[name=" + act + "]") );
					xml.find('activity').each(function(a) {
						var activity = $(this);
						if ( activity.attr('name') == act ) {
							activity.find('subactivity').each(function(b) {
								var subactivity = $(this);
								if ( subactivity.attr('name') == sub ) {
									subactivity.find('method').each(function(c) {
										var method = $(this);
										if ( method.attr('name') == met ) {
											method.find('constraint').each(function(d) {
												var weight = $(this);
												if ( weight.attr('name') ) {
													var weightValue = row[3+d];
													weight.attr({ 'weight' : weightValue });
												}
											});
										}
									});
								}
								
							});
						}
					});

				}


				var xmlString = (new XMLSerializer()).serializeToString(xmlDoc);
				
				$.post(UP.Admin.constants.UPLOADER, { filename : xmlFile, msg : xmlString }, function(data) {
					alert("Configuration file uploaded and updated");
				});

			}));

		},

		xmlToCsv: function(xmlFile) {
			var xmlFile = assets(xmlFile);

			$.get( xmlFile, (function(xmlDoc) {
				var xml = $(xmlDoc);

				var csv = "Activity;Subactivity;Method;";

				xml.find('constraints').find('constraint').each(function(i) {
					var c = $(this);
					csv += c.attr('name') + ";";
				});

				csv += "\r\n";



				xml.find('activity').each(function(i) {
					var act = $(this);
					var actName = act.attr('name');

					act.find('subactivity').each(function(j) {
						var sub = $(this);
						var subName = sub.attr('name');
						
						sub.find('method').each(function(k) {
							var met = $(this);
							var metName = met.attr('name');

							csv += actName + ";" + subName + ";" + metName + ";";

							met.find('constraint').each(function(l) {
								var weight = $(this);
								var value = weight.attr('weight');
								csv += value + ";";
							});

							csv += "\r\n";
						});

					});

				});

				var csvFile = xmlFile.substring( xmlFile.lastIndexOf('/')+1, xmlFile.length-4) + ".csv";
				csvFile = assets(csvFile);

				$.post(UP.Admin.constants.UPLOADER, { filename : csvFile, msg : csv }, function(data) {
					document.location.href = csvFile;
				});

			}));

		}
		
	};

	function assets(file) {
		return '../assets/xml/' + file;
	}

			
