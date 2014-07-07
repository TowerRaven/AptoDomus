/**
 * Homepage v.0.01
 * Dependencies: jQuery (v2+).
 */

$(document).ready(function() {
	// Hide the JavaScript warning
	$('#js-notice').addClass('hidden');
	
	// Detect local storage
	if(!supports_html5_storage()) {
		$('#ls-notice').removeClass('hidden');
	} else {
		$('#dimmer').addClass('hidden');
	}
	
	
	init();
	
	console.log(links);
});