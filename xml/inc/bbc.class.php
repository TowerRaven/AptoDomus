<?php
class bbc {
	const DEBUG = false;
	private $type;
	private $kind;
	private $args;
	private $data;
	private $xml;

	private $feeds = array(
		'news'		=> array(
			'world'     => 'http://feeds.bbci.co.uk/news/rss.xml?edition=int',
            'uk'        => 'http://feeds.bbci.co.uk/news/rss.xml?edition=uk',
            'us_can'    => 'http://feeds.bbci.co.uk/news/rss.xml?edition=us'
		),
		'weather'   => array(
            '3day'          => 'http://open.live.bbc.co.uk/weather/feeds/en/%d/3dayforecast.rss', //sprintf style
            'observations'  => 'http://open.live.bbc.co.uk/weather/feeds/en/%d/observations.rss' //sprintf style
        )
	);

	function __construct($type, $kind, $args) {
		$this->type = $type;
		$this->kind = str_replace('-', '\\', $kind);

		if($type == 'weather' && $args['location'])
			$this->args['location'] = filter_var($args['location'], FILTER_SANITIZE_NUMBER_INT);

		if(!$this->checkType())
			return false;

		if(!$this->checkKind())
			return false;

		//Check location for weather, if none provided use London (safety)
		if($this->kind == "weather" && $this->args['location'] == NULL)
			$this->args['location'] = 2643743; // Set London as default locale

		if($this->fetchFeed())
			$this->parseFeed();
	}

	/** Retrieves the specified feed */
	private function fetchFeed() {
		$curl = curl_init();
		curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);

		switch($this->type) {
			case "news":
				curl_setopt($curl, CURLOPT_URL, $this->feeds[$this->type][$this->kind]);
				break;
			case "weather":
				// Format weather URL with weather location
				$url = sprintf($this->feeds[$this->type][$this->kind], $this->args['location']);

				curl_setopt($curl, CURLOPT_URL, $url);
				break;
		}

		if(!$this->data = curl_exec($curl))
			return false;

		if(self::DEBUG)
			$this->xml = $this->data;

		curl_close($curl);

		return true;
	}

	/** Parses feed to some form of standard (TBD) */
	private function parseFeed() {
		switch($this->type) {
			case "news":
				$simplexml = simplexml_load_string( $this->data, null, LIBXML_NOCDATA );
				$this->data = json_decode( json_encode( $simplexml->channel ) );
				return true;
				break;
			case "weather":
				$simplexml = simplexml_load_string( $this->data, null, LIBXML_NOCDATA );
				$this->data = json_decode( json_encode( $simplexml->channel ) );
				return true;
				break;
		}
	}

	/** Returns the processed feed in array format */
	public function outputFeed() {
		return $this->data;
	}

	public function outputXML() {
		if(self::DEBUG)
			return $this->xml;
		else
			return false;
	}

	/** Checks for existence of the type */
	private function checkType() {
		if(array_key_exists($this->type, $this->feeds))
			return true;
		return false;
	}

	/** Checks for existence of the kind */
	private function checkKind() {
		if(array_key_exists($this->kind, $this->feeds[$this->type]))
			return true;
		return false;
	}
}
