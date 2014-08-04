/**
 * Homepage
 * Version: 0.04
 * Dependencies: jQuery (v2+).
 */
var home_version = "0.04";

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
	initLocalStorage(home_version);

	console.log(logUsage());

	/**
	 * initPage generates the layout and populates it with widgets
	 */
	initPage('#content');

	initEditMode();

	//TODO Remove
	$("[name='resetls']").on('click', function() {
		$('#content').slideUp("normal", function() {
			$('#content').html(' ');

			resetLocalStorage();

			initPage('#content');

			initEditMode();
		}).slideDown();
		console.log('Urgh, so satisfying :Q');
	});
});
