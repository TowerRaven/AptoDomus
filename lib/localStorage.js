/**
 * Local Storage Functions
 * Version: 0.9
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
	var usage = new Array();
	usage[0] = new Array();
	//TODO Convert output to variable for usage in UI
	for(var x in localStorage) {
		usage[0][x] = ((localStorage[x].length * 2)/1024); // KB
	}

	var total = 0.0;
	for(var y in usage[0])
		total = usage[0][y] + total;

	total = roundDecimal(total, 2);

	return [usage, total];
}

/** Storage updater routine
 *  Types:
 * 		0	/ nothing, just a minor version update
 *		1	/ reset... early usage, resets data to defaults
 *		2	/ process update, takes the old data and changes it fittingly
 *	Type 2 requires, "process" key with widgets being updated and old / new format
 *	May use hook system a la widgets
 */
function storageUpdater(oldversion, newversion) {
	console.log('Updating from version '+oldversion+' to '+newversion);
	// Add routines to update between versions; iterate until most recent
	versions = {"0.02": [{"type": 1}]};

	return;
}


/** Will load the various valid key groups into window… variables (just a precaution)
 *	Also pre-populates if the user hasn't created any before.
 */
function initLocalStorage(version) {
	if( window.userversion == undefined)
		window.userversion;
	if( window.list == undefined )
		window.list = new Array();

	if( (window.userversion = getData('version')) == null ) {
		// Refresh data to be sure
		resetLocalStorage();

		window.userversion = version;
		setData('version', version);
	}
	if( window.userversion != version) {
		// TODO Warn user data is being updated
		storageUpdater(window.userversion, newversion);
		// TODO Remove warning
	}

	// Rows
	window.list["rows"] = new Array();
	if( getData('rows') == null ) {
		// Defaults
		setData('rows', '{"0":["0"],"1":["1","2","3"],"2":["4"]}');
		window.list["rows"] = parseLocalData(getData('rows'));
	} else {
		window.list["rows"] = parseLocalData(getData('rows'));
	}

	// Columns
	window.list["columns"] = new Array();
	if( getData('columns') == null ) {
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
