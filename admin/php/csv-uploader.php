<?php

	// Getting the parameter by POST request
	if ( isset($_POST['parameter']) ) {
		$param = $_POST['parameter'];
	} else {
		echo 0;
		return false;
	}


	// The parameter must be one of the versions we support
	if ( !strcmp($param, 'activities.xml') && !strcmp($param, 'stages.xml') ) {
		echo "no coinciden";
		echo 0;
		return false;
	}


	// Copying the new content uploaded and writing it into the file
	$file = ( $_FILES['files'] );

	$name = $file['tmp_name'];
	$size = $file['size'];

	$fp = fopen( $name, 'r' );
	if ( $fp ) {
		$content = fread( $fp, $size );
		echo $content;
		fclose( $fp );
	}


	// For security reason, we force to remove the temporary content uploaded, but not our existent file
	@unlink( $_FILES['files'] );

/*
	// TODO poner bien la ruta
	//$path = '../assets/xml/' . $param;
	$path = '../' . $param;

	$fp = fopen( $path, 'w' );
	if ( $fp ) {
		echo $content;
		fwrite( $fp, $content );
		fclose( $fp );
	}


	// Finally, we give a response to the client and finish the execution of this scrip.
	//for security reason, we force to remove all uploaded file
	@unlink( $_FILES['files'] );
*/

	//echo 1;
	return true;

?>
