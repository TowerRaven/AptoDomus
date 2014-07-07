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
	if( window.list == undefined )
			window.list = new Array();
	
	// Rows
	window.list["rows"] = new Array();
	if( (window.columns = getData('rows') ) == undefined ) {
		// Defaults
		setData('rows', '{"0":[0],"1":[1,2,3],"2":[4]}');
		window.columns = parseLocalData(getData('rows'));
	} else {
		window.columns = parseLocalData(getData('rows'));
	}
	
	// Columns
	window.list["columns"] = new Array();
	if( (window.columns = getData('columns') ) == undefined ) {
		// Defaults
		setData('columns', '{"0":{"widget":"search","data":"google"},"1":{"widget":"links","data":{"0":{"name":"Reddit","url":"http://reddit.com/"},"1":{"name":"ArsTechnica","url":"http://arstechnica.com/"},"2":{"name":"Tower Designs","url":"http://towerdesigns.co.uk/"}}},"2":{"widget":"intro","data":null},"3":{"widget":"empty","data":null},"4":{"widget":"news","data":"http://feeds.bbci.co.uk/news/rss.xml"}}');
		window.columns = parseLocalData(getData('columns'));
	} else {
		window.columns = parseLocalData(getData('columns'));
	}
	
	$.each(links, function(i, item) {
		window.list["links"].push(i);
	});
	
	console.log(list);
	// RSS Feeds
	
	
	// Weather
	
	
	// Timers
	
	
	
}