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
	if(setData(key, jsonstr))
		return true;
	else
		return false;
}

/** Parses the string from localStorage into JSON */
function parseLocalData(string) {
	return $.parseJSON(string);
}

/** Outputs how much storage (estimated) is being used */
function logUsage() {
	var usage = new Array();
	usage[0] = new Array();

	for(var x in localStorage) {
		if(x != 'length')
			usage[0][x] = ((localStorage[x].length * 2)/1024); // KB
	}

	var total = 0.0;
	for(var y in usage[0])
		total = usage[0][y] + total;

	total = roundDecimal(total, 2);

	return [usage, total];
}

/** Outputs usage to the settings dialogue */
function outputUsage() {
	var barwidth = $('.usedspacebar').width();
	var usage = logUsage();
	var percentage = usage[1] / 5120 * 100;

	$('.usedspaceval').html(usage[1]);

	// Calculate clipping of "used space" chart
	var clip = barwidth - percentage;

	clip = barwidth - clip;

	if(clip < 1)
		clip = 1;
	else
		clip = Math.round(clip);

	$('.usedspacebar').css('clip', 'rect(0px,'+clip+'px,22px,0px)');
}

/** Backup Settings; generates a JSON object to output as text */
function backupSettings() {
	var settings = {};
		settings["title"] = "";
		settings["rows"] = {};
		settings["columns"] = {};

	settings["title"] = localStorage.title;
	settings["rows"] = JSON.parse(localStorage.rows);
	settings["columns"] = JSON.parse(localStorage.columns);

	$('#thesettings').html(JSON.stringify(settings));

	return settings;
}

/** Checks settings and updates if correct */
function restoreSettings(newsettings) {
	var success = true;

	newsettings = JSON.parse(newsettings);

	if(newsettings["title"] == undefined)
		success = false;
	if(newsettings["rows"] == undefined)
		success = false;
	if(newsettings["columns"] == undefined)
		success = false;

	if(success == false) {
		console.log('Error: one or more settings is missing.');
		// TODO Alert user
	} else {
		$('#content').slideUp("normal", function() {
			$('#content').html(' ');

			saveData("title", newsettings["title"]);
			saveData("rows", newsettings["rows"]);
			saveData("columns", newsettings["columns"]);

			initPage('#content');

			initEditMode();
		}).slideDown();
	}

	console.log(newsettings);

	return success;
}

/** Storage updater routine
 *  Types:
 * 		0	/ nothing, just a minor version update
 *		1	/ reset... early usage, resets data to defaults
 *		2	/ process update, takes the old data and changes it fittingly
 *	Type 2 requires, "process" key with widgets being updated and old / new format
 *	May use hook system a la widgets
 */


/** Will load the various valid key groups into window… variables (just a precaution)
 *	Also pre-populates if the user hasn't created any before.
 */
function initLocalStorage(version) {
	if( window.userversion == undefined)
		window.userversion;
	if( window.list == undefined )
		window.list = new Array();
	if( window.title == undefined )
		window.title;

	if( (window.userversion = getData('version')) == null ) {
		// Refresh data to be sure
		resetLocalStorage();

		window.userversion = version;
		setData('version', version);
	}
	if( window.userversion != version) {
		//TODO Warn user about version
	}


	if( getData('title') == null ) {
		setData('title', 'Unnamed Homepage');
		window.title = 'Unnamed Homepage';
	} else {
		window.title = getData('title');
	}

	// Rows
	window.list["rows"] = new Array();
	if( getData('rows') == null ) {
		// Defaults
		if(window.is_server)
			setData('rows', '[["0"],["1","2","3"], ["4"]]');
		else
			setData('rows', '[["0"],["1","2","3"]]');
		window.list["rows"] = parseLocalData(getData('rows'));
	} else {
		window.list["rows"] = parseLocalData(getData('rows'));
	}

	// Columns
	window.list["columns"] = new Array();
	if( getData('columns') == null ) {
		// Defaults
		if(window.is_server)
			setData('columns', '{"0":{"widget":"search","data":"google","width":"fullwidth"},"1":{"widget":"links","data":[{"name":"Reddit","url":"http://reddit.com/"},{"name":"ArsTechnica","url":"http://arstechnica.com/"},{"name":"Tower Designs","url":"http://towerdesigns.co.uk/"}],"width":"onethird"},"2":{"widget":"intro","data":null,"width":"onethird"},"3":{"widget":"clock","data":null,"width":"onethird"},"4":{"widget":"bbcnews","data":{"url":"http://feeds.bbci.co.uk/news/rss.xml","style":"scroll"},"width":"fullwidth"}}');
		else
			setData('columns', '{"0":{"widget":"search","data":"google","width":"fullwidth"},"1":{"widget":"links","data":[{"name":"Reddit","url":"http://reddit.com/"},{"name":"ArsTechnica","url":"http://arstechnica.com/"},{"name":"Tower Designs","url":"http://towerdesigns.co.uk/"}],"width":"onethird"},"2":{"widget":"intro","data":null,"width":"onethird"},"3":{"widget":"clock","data":null,"width":"onethird"}}');

		window.list["columns"] = parseLocalData(getData('columns'));
	} else {
		window.list["columns"] = parseLocalData(getData('columns'));
	}
}


function resetLocalStorage() {
	if(window.is_server)
		setData('rows', '[["0"],["1","2","3"], ["4"]]');
	else
		setData('rows', '[["0"],["1","2","3"]]');
	window.list["rows"] = parseLocalData(getData('rows'));

	if(window.is_server)
		setData('columns', '{"0":{"widget":"search","data":"google","width":"fullwidth"},"1":{"widget":"links","data":[{"name":"Reddit","url":"http://reddit.com/"},{"name":"ArsTechnica","url":"http://arstechnica.com/"},{"name":"Tower Designs","url":"http://towerdesigns.co.uk/"}],"width":"onethird"},"2":{"widget":"intro","data":null,"width":"onethird"},"3":{"widget":"clock","data":null,"width":"onethird"},"4":{"widget":"bbcnews","data":{"url":"http://feeds.bbci.co.uk/news/rss.xml","style":"scroll"},"width":"fullwidth"}}');
	else
		setData('columns', '{"0":{"widget":"search","data":"google","width":"fullwidth"},"1":{"widget":"links","data":[{"name":"Reddit","url":"http://reddit.com/"},{"name":"ArsTechnica","url":"http://arstechnica.com/"},{"name":"Tower Designs","url":"http://towerdesigns.co.uk/"}],"width":"onethird"},"2":{"widget":"intro","data":null,"width":"onethird"},"3":{"widget":"clock","data":null,"width":"onethird"}}');
	window.list["columns"] = parseLocalData(getData('columns'));
}
