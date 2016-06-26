<?php
/** Handles loading feed classes and caching */
class feedReader {
	private $source;
    private $type;      //news/weather
    private $kind;      //news: uk/us/intl, weather: 3day, observations
    private $args;      //currently only ['location'] for weather
    private $feed;
	private $cachedir = 'cache/';
	private $cachepath;

	private $cachetime = 3600; // One hour (seconds)

    private $sites = array(
        'bbc',
        'yahoo'
    );

    function __construct($source = 'bbc', $type = 'news', $kind = 'uk', $args) {
		//Grabbing the various arguments
		$source = filter_var($source, FILTER_SANITIZE_STRING, FILTER_FLAG_STRIP_LOW | FILTER_FLAG_STRIP_HIGH);
		$this->source = filter_var($source, FILTER_SANITIZE_STRING, FILTER_FLAG_STRIP_LOW | FILTER_FLAG_STRIP_HIGH);
		if(!in_array($source, $this->sites))
			return '{"state": 0, "reason": "This site isn\'t available."}';

        $this->type = filter_var($type, FILTER_SANITIZE_STRING, FILTER_FLAG_STRIP_LOW | FILTER_FLAG_STRIP_HIGH);
        $this->kind = filter_var($kind, FILTER_SANITIZE_STRING, FILTER_FLAG_STRIP_LOW | FILTER_FLAG_STRIP_HIGH);
		$this->args = $args;

		//Building up the cache path
		$this->cachepath .= $this->cachedir.$this->source.'_'.$this->type.'_'.$this->kind;
		if($this->type == 'weather' && $this->args['location'] != null) {
			$this->args['location'] = filter_var($args['location'], FILTER_SANITIZE_NUMBER_INT);
			$this->cachepath .= '_'.$this->args['location'];
		}
		$this->cachepath .= '.json';

		//Load the class
        $this->feed = new $source($this->type, $this->kind, $this->args);
		if(!is_object($this->feed))
			return '{"state": 0, "reason": "Something went wrong retrieving the feed."}';
    }

	/** Returns true for current, false for outdated or not in existence */
    private function checkCache() {
		if(file_exists($this->cachepath)) {
			$filemtime = filemtime($this->cachepath);

			if( (time() - $filemtime) < $this->cachetime )
				return true;
		}
		return false;
    }

    private function cacheFeed() {
    	$json = json_encode( $this->feed->outputFeed() );

		// Create cache TODO Doesn't
		if( !$cache = fopen( $this->cachepath, 'w+' ) )
			return false;

		if( !fwrite( $cache, $json ) )
			return false;

		fclose( $cache );

		return true;
    }

    public function getFeed() {
    	if($this->checkCache())
			return file_get_contents($this->cachepath);
		else {
			if( !$this->cacheFeed() )
				return '{"state": 0, "reason": "Failed to cache the feed, contact an administrator (they probably missed some permissions)."}';
			return json_encode( $this->feed->outputFeed() );
		}
    }
}
