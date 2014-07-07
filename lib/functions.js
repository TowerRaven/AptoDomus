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

//===Regular Expressions===
/** URL Checker */
function check_url(url) {
	var regx = new RegExp ( '(https?|ftp):\/\/[www.]?[a-zA-Z]*.[a-zA-Z]*.?[a-zA-Z]*', 'g');
	
	if( url.match(regx).length >= 1 )
		return true;
	else
		return false;
}

/** Feed Checker (XML) */
function check_feed(url) {
	var regx = new RegExp ( 'http:\/\/[a-zA-Z.\/%]*.xml', 'g' );
	
	if( url.match(regx).length >= 1 )
		return true;
	else
		return false;
}
