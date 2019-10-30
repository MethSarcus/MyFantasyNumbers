<?php
//supress warnings & errors
error_reporting(0);

//sets the base of the url we want to hit
define ('HOSTNAME', 'http://fantasy.espn.com/');

//access the api - remember we have to send in a leading '/'
$url=HOSTNAME.$_GET['path'];

//set up curl (Client Uniform Resource Locator)
	//  Initiate curl
	$ch = curl_init();
	// allow us to include a header in the return (we are setting to false as we don't need to)
	curl_setopt($session, CURLOPT_HEADER, false);
	// Will return the response, if false it print the response (we want to capture it in a variable $result)
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	// Set the url
	curl_setopt($ch, CURLOPT_URL,$url);
	// Execute
	$result=curl_exec($ch);
	// Closing
	curl_close($ch);

//we want json back so set the correct mimetype
header("Content-Type: text/plain");

//give it to me!
echo $result;
?>