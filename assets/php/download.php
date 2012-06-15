<?php

if (isset($_POST['msg'])) {

	$filename = "../plan.csv";


	$csv = $_POST['msg'];

	// Creating the '.csv' file

	$fp = fopen( $filename, 'w' );
	if ( $fp ) {
		fwrite( $fp, $csv );
		fclose( $fp );

		echo 1;
	}

}

?>
