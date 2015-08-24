<?php
/**
 * CORS-centric XML feed processor
 * version: 0.1
 * description: Processes XML feeds and returns them in JSONP
 */
define('PROCESSOR_INIT', true);

// Allow cross-domain requests
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET'); // POST too?

// Tell our target what data we're using
header('Content-Type: application/javascript');

// Get the config & feedreader class
require_once('feedreader.class.php');

/**
 * General purpose filter function for strings
 */
function string_purify($string) {
    return filter_var( $string, FILTER_SANITIZE_STRING, FILTER_FLAG_STRIP_LOW | FILTER_FLAG_STRIP_HIGH );
}


/**
 * Class auto loader
 */
function __autoload($className) {
	if(file_exists('inc/'.$className.'.class.php')) {
		require('inc/'.$className.'.class.php');
		return true;
	}
	
	return false;
}


// Retrieve & validate get request
$source = string_purify($_GET['source']);
$type = string_purify($_GET['type']);
$kind = string_purify($_GET['kind']);
$args = array();

if($type == 'weather') {
    if(!$_GET['location']) {
        //TODO throw out error
    } else {
        $args['location'] = filter_var($_GET['location'], FILTER_SANITIZE_NUMBER_INT);
		if($args['location'] == 0)
			$args['location'] = 2643743;
    }
}

// Retrieve XML feed
$reader = new feedReader($source, $type, $kind, $args);

// Parse XML feed and output as JSONP
echo $reader->getFeed();