<?php
	header( 'Access-Control-Allow-Origin: *');

	if(isset($_GET['username']) && isset($_GET['password']) && isset($_GET['token']) && isset($_GET['action'])) {
		$header = "Device-Signature: 485430330021fc0f\r\n";
		$header.= "API-Key: 485430330021fc0f\r\n";
		if( 'token' != $_GET['action']) {
			$header.= "X-Auth: " . $_GET['token'] . "\r\n";
		}

		$method = 'GET';
		if( 'token' == $_GET['action']) {
			$method = 'POST';
		}

		$opts = array(
			'http'=>array(
				'method'=>$method,
				'header'=>$header
			)
		);
		$context = stream_context_create($opts);
		echo file_get_contents( 'https://hackathon.postbank.de/bank-api/gold/postbankid/' . $_GET['action'] . '?username=' . $_GET['username'] . '&password=' . $_GET['password'], false, $context);
	} else {
		echo('parameter missing');
	}
?>
