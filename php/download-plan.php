<?php

header("Cache-Control: public"); 
header("Content-Type: application/octet-stream");
header("Content-Disposition: attachment; filename=plan.csv");

if (isset($_POST['msg'])) {

	$filename = "../plan.csv";


	$csv = $_POST['msg'];

	// Creating the '.csv' file

	$fp = fopen( $filename, 'w' );
	if ( $fp ) {
		fwrite( $fp, $csv );
		fclose( $fp );
	}

}



	// Getting the data by an AJAX POST request
/*
	$json_str = $_POST['msg'];
	$json_str = str_replace('\"', '"', $json_str);


	// Decoding JSON data and converting it into PHP Objects

	$methods = json_decode($json_str);


	// Initializing the content of the '.csv' file

	$csv = "Method;Value;";


	// Parsing the constraints name (just getting the first method for that)

	$weights = $methods[0]->weights;

	foreach ( $weights as $w ) {
		$constraint  = $w->constraint;
		$csv .= ($constraint . ";");
	}

	$csv .= "\r\n";


	// Now, we parse the entire string for every method

	foreach ( $methods as $method ) {
		$name    = $method->name;
		$value   = $method->value;

		$csv .= ($name . ";" . $value . ";");

		$weights = $method->weights;
		foreach ( $weights as $w ) {
			$weightValue = $w->value;
			$csv .= ($weightValue . ";");
		}

		$csv .= "\r\n";
	}


	// Creating the '.csv' file

	$fp = fopen( $filename, 'w' );
	if ( $fp ) {
		fwrite( $fp, $csv );
		//fwrite( $fp, $json_str );
		fclose( $fp );
	}

	echo 1;
*/

?>