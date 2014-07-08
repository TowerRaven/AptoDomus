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
	
	/*console.log(window.list["rows"]);
	
	console.log(window.list["columns"]);
	
	widget('links', window.list["columns"][1]["data"]);*/
	
	//widgetRegistry.output('linklist', list["columns"][1].data);
	
	//widgetRegistry.form('linklist', list["columns"][1].data);
	
	//console.log(widgetRegistry.name('linklist'));
	
	
	// Widget initialisation
});