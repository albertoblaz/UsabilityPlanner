<?php
	$file = ( $_FILES['files'] );

	$name = $file['tmp_name'];
	$size = $file['size'];

	$fp = fopen( $name, 'r' );
	$csv = fread( $fp, $size );
	fclose( $fp );

	echo $csv;

	//for security reason, we force to remove all uploaded file
	@unlink( $_FILES['files'] );
?>