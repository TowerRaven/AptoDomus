/**
 * Homepage Functions v.0.01 
 * Description: Common functions file; contains generally useful functions.
 * 
 * Research: http://diveintohtml5.info/storage.html
 */

/** Searches array for string */
function in_array(needle, haystack) {
	var count = haystack.length;
	
	for(i=0;i<count;i++) {
		if(haystack[i] === needle)
			return true;
	}
	
	return false;
}

/** localStorage functions */
function supports_html5_storage() {
	try {
		return 'localStorage' in window && window['localStorage'] !== null;
	} catch (e) {
		return false;
	}
}

function setData(key, data) {
	// Handle conversion/validation
	localStorage.setItem(key, data);
	
	if(localStorage.getItem(key) == data) {
		return  true;
	} else {
		return false;
	}
}

function getData(key) {
	return localStorage.getItem(key);
}


// Regular Expressions
/** URL Checker */
function check_url(url) {
	var regx = /(https?|ftp):\/\/[www.]?[a-zA-Z]*.[a-zA-Z]*.?[a-zA-Z]*\//g;
	
	if( regx.match(url) )
		return true;
	else
		return false;
}
