/**
 * Local Storage Functions 
 */
function supports_html5_storage() {
	try {
		return 'localStorage' in window && window['localStorage'] !== null;
	} catch (e) {
		return false;
	}
}

/** Saves a set of data to the relevant key */
function setData(key, data) {
	// Handle conversion/validation
	localStorage.setItem(key, data);
	
	if( localStorage.getItem(key) == data ) {
		return  true;
	} else {
		return false;
	}
}

/** Retrieves a specific set of data */
function getData(key) {
	return localStorage.getItem(key);
}

/** Saves JSON to localStorage */
function saveData(key, json) {
	jsonstr = JSON.stringify(json);
	setData(key, jsonstr);
}

/** Parses the string from localStorage into JSON */
function parseLocalData(string) {
	return $.parseJSON(string);
}

/** Outputs how much storage (estimated) is being used */
function logUsage() {
	//TODO Convert to output to variable for usage in UI
	for(var x in localStorage)
		console.log(x+"="+((localStorage[x].length * 2)/1024/1024).toFixed(2)+" MB");
}

/** Will load the various valid key groups into window… variables (just a precaution)
 *	Also pre-populates if the user hasn't created any before.
 */
function init() {
	// Columns
	
	
	// Links
	if( (window.links = getData('links')) == undefined) {
		setData('links', '{"reddit": {"name": "Reddit", "url": "http://reddit.com"}, "arstechnica": {"name": "ArsTechnica", "url": "http://arstechnica.com"}, "towerdesigns": {"name": "Tower Designs", "url": "http://towerdesigns.co.uk"}}');
		window.links = parseLocalData(getData('links'));
	} else {
		window.links = parseLocalData(getData('links'));
	}
	
	// RSS Feeds
	
	
	// Weather
	
	
	// Timers
	
	
	
}