<?php
header('Content-Type: text/xml');

$url= urldecode($_GET['site']);

function curl_get_file_contents($url) {
	$c = curl_init();
	curl_setopt($c, CURLOPT_RETURNTRANSFER, 1);
	curl_setopt($c, CURLOPT_URL, $url);
	$contents = curl_exec($c);
	
	if($contents) return $contents;
	else return false;
}

echo curl_get_file_contents($url);