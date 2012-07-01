<?php

	$filename = '../' . $_POST['filename'];
	$xml      = $_POST['msg'];

	$fp = fopen( $filename, 'w' );
	if ( $fp ) {
		fwrite( $fp, "");
		fclose( $fp );
	}

	$fp = fopen( $filename, 'w' );
	if ( $fp ) {
		fwrite( $fp, $xml );
		fclose( $fp );
		echo 1;
	} else {
		echo 0;
	}

?>
