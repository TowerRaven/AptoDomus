<?php
header('Content-Type: application/json');

$type = $_GET['type'];

$url= urldecode($_GET['site']);

function curl_get_file_contents($url) {
	$c = curl_init();
	curl_setopt($c, CURLOPT_RETURNTRANSFER, 1);
	curl_setopt($c, CURLOPT_URL, $url);
	$contents = curl_exec($c);

	if($contents) return $contents;
	else return false;
}

$data = curl_get_file_contents($url);

switch($type) {
	case "news":
		//Parse data for json encoding
		$simplexml = simplexml_load_string($data);
		$json = json_encode($simplexml);
		echo $json;
		break;
	case "weather":

		break;
}
