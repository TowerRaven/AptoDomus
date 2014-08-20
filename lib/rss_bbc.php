<?php
header('Content-Type: application/json');

$type = $_GET['type'];

/*
$url= urldecode($_GET['site']);
*/

function curl_get_file_contents($url) {
	$c = curl_init();
	curl_setopt($c, CURLOPT_RETURNTRANSFER, 1);
	curl_setopt($c, CURLOPT_URL, $url);
	$contents = curl_exec($c);

	if($contents) return $contents;
	else return false;
}

switch($type) {
	case "news":
		//Get data
		$url = "http://feeds.bbci.co.uk/news/rss.xml";
		$data = curl_get_file_contents($url);

		//Parse data for json encoding
		$simplexml = simplexml_load_string( $data );
		$temp = json_decode( json_encode( $simplexml->channel) );

		echo json_encode( $temp->item );
		//echo $json;
		break;
	case "weather":
		$location = $_GET['location'];

		//Get data
		$url = "http://open.live.bbc.co.uk/weather/feeds/en/".$location;

		$data_obs = curl_get_file_contents($url.'/observations.rss');

		$data_3day = curl_get_file_contents($url.'/3dayforecast.rss');

		echo json_encode( $data_obs );
		echo json_encode( $data_3day );
		break;
}
