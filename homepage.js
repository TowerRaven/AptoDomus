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

	/**
	 * initLocalStorage creates window.list of main localStorage containers
	 * Currently that includes:
	 * 	window.list["rows"]
	 * 	window.list["columns"]
	 */
	initLocalStorage();

	console.log(logUsage());

	/**
	 * initPage generates the layout and populates it with widgets
	 */
	initPage('#content');

	initEditMode();
	
	//TODO Remove
	$("[name='resetls']").on('click', function() {
		console.log('Reset Button');
		
		$('#content').slideUp();
		
		$('#content').html(' ');
		
		resetLocalStorage();
		
		initPage('#content');
		
		initEditMode();
		
		$('#content').slideDown();
	});
});
