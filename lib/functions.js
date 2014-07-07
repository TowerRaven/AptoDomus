/**
 * Homepage Functions v.0.01 
 * Description: Common functions file; contains generally useful functions.
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