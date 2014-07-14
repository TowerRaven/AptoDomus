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
	localStorage[key] = jsonstr;
}

/** Parses the string from localStorage into JSON */
function parseLocalData(string) {
	return $.parseJSON(string);
}

/** Outputs how much storage (estimated) is being used */
function logUsage() {
	//TODO Convert output to variable for usage in UI
	for(var x in localStorage)
		console.log(x+"="+((localStorage[x].length * 2)/1024/1024).toFixed(2)+" MB");
}

/** Will load the various valid key groups into window… variables (just a precaution)
 *	Also pre-populates if the user hasn't created any before.
 */
function initLocalStorage() {
	if( window.list == undefined )
			window.list = new Array();

	// Rows
	window.list["rows"] = new Array();
	if( (window.rows = getData('rows') ) == undefined ) {
		// Defaults
		setData('rows', '{"0":["0"],"1":["1","2","3"],"2":["4"]}');
		window.list["rows"] = parseLocalData(getData('rows'));
	} else {
		window.list["rows"] = parseLocalData(getData('rows'));
	}

	// Columns
	window.list["columns"] = new Array();
	if( (window.columns = getData('columns') ) == undefined ) {
		// Defaults
		setData('columns', '{"0":{"widget":"search","data":"google","width":"fullwidth"},"1":{"widget":"links","data":[{"name":"Reddit","url":"http://reddit.com/"},{"name":"ArsTechnica","url":"http://arstechnica.com/"},{"name":"Tower Designs","url":"http://towerdesigns.co.uk/"}],"width":"onethird"},"2":{"widget":"intro","data":null,"width":"onethird"},"3":{"widget":"empty","data":null,"width":"onethird"},"4":{"widget":"news","data":{"url":"http://feeds.bbci.co.uk/news/rss.xml","style":"scroll"},"width":"fullwidth"}}');
		window.list["columns"] = parseLocalData(getData('columns'));
	} else {
		window.list["columns"] = parseLocalData(getData('columns'));
	}
}


function resetLocalStorage() {
	setData('rows', '{"0":["0"],"1":["1","2","3"],"2":["4"]}');
	window.list["rows"] = parseLocalData(getData('rows'));

	setData('columns', '{"0":{"widget":"search","data":"google","width":"fullwidth"},"1":{"widget":"links","data":[{"name":"Reddit","url":"http://reddit.com/"},{"name":"ArsTechnica","url":"http://arstechnica.com/"},{"name":"Tower Designs","url":"http://towerdesigns.co.uk/"}],"width":"onethird"},"2":{"widget":"intro","data":null,"width":"onethird"},"3":{"widget":"empty","data":null,"width":"onethird"},"4":{"widget":"news","data":{"url":"http://feeds.bbci.co.uk/news/rss.xml","style":"scroll"},"width":"fullwidth"}}');
	window.list["columns"] = parseLocalData(getData('columns'));
}
