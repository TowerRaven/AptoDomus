/**
 * Homepage Functions v.0.01
 * Description: Common functions file; contains generally useful functions.
 *
 * Research: http://diveintohtml5.info/storage.html
 */

/** Searches array for string */
function in_array(needle, haystack, exact) {

	var count = haystack.length;

	for(i=0;i<count;i++) {
		if( exact == true ) {
			if(haystack[i] === needle)
				return true;
		} else {
			if(haystack[i] == needle)
				return true;
		}
	}

	return false;
}


/** Removes an item from an array */
function remove_from_array(item, array) {
	if(typeof(item) == 'number')
		item = item.toString();

	if(array.indexOf(item) == -1)
		return false;
	else
		array.splice(array.indexOf(item), 1);
}


function read_feed(url) {
	var enc_url = encodeURIComponent(url);

	console.log(enc_url);

	var response;

	$.ajax({
		cache: false,
		url: "lib/rss.php?site="+enc_url,
		dataType: "xml",
		success: function(data) {
			console.log(data);
		},
		error: function( jqXHR, textStatus, errorThrown) {
			console.log(textStatus+' - '+errorThrown);
		}
	});

	return response;
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

/** Row ID Finder; returns null if failed */
function get_row_idnum(id) {
	var regx = new RegExp ( "#row-([0-9]*)", 'g');

	match = regx.exec(id);

	if(match != null)
		return match[1];
	else
		return null;
}

/** Col ID Finder; returns null if failed */
function get_col_idnum(id) {
	var regx = new RegExp ( "#col-([0-9]*)", 'g');

	match = regx.exec(id);

	if(match != null)
		return match[1];
	else
		return null;
}

/** Finds column id from a classes string */
function get_col_from_class(classes) {
	var regx = new RegExp ( 'col-([0-9]*)-controls', 'g');

	match = regx.exec(classes);

	if(match != null)
		return match[1];
	else
		return null;
}


//===Edit Mode===
/** Enable */
function enableEditMode() {
	//$('.edit-control').fadeIn();
	$('body').addClass('edit-mode-on');
	$('.edit-control, .edit-control-header').slideDown();
	$('.edit-element').slideDown();
}

/** Disable */
function disableEditMode() {
	//$('.edit-control').fadeOut();
	$('body').removeClass('edit-mode-on');
	$('.edit-control, .edit-control-header').slideUp();
	$('.edit-element').slideUp();
}


/** Row Control Generator */
function create_row_edit_buttons(target) {
	if(typeof(target) === 'undefined') {
		$('.edit-row-control').append(
			'<button type="button" class="remove" title="Remove Row"><img src="icons/circle-x.svg" alt="Remove Row" /></button>'
		);
		//TODO Bind button
	} else {
		$('#row-'+target+' .edit-row-control').append(
			'<button type="button" class="remove" title="Remove Row"><img src="icons/circle-x.svg" alt="Remove Row" /></button>'
		);
		//TODO Bind button
	}
}

/** Standard button creator */
function create_edit_buttons(target) {
	if(typeof(target) === 'undefined') {
		$('.edit-control').append(
			'<button type="button" class="edit" title="Edit Widget"><img src="icons/pencil.svg" alt="Edit Widget" /></button>'+
			'<button type="button" class="remove" title="Remove Widget"><img src="icons/circle-x.svg" alt="Remove Widget" /></button>'
		);

		//TODO Create the row add/remove controls

		//TODO Bind controls

		$.each($('button.edit'), function(i, elem) {
			$(elem).on('click', function() {
				console.log($(elem).parent().prop('class'));
				console.log( get_col_from_class( $(elem).parent().prop('class') ) );

				//TODO
			});
		});
		$.each($('button.remove'), function(i, elem) {
			$(elem).on('click', function() {
				console.log($(elem).parent().prop('class'));
				console.log( get_col_from_class( $(elem).parent().prop('class') ) );
				//TODO
			});
		});
	} else {
		$(target+' .edit-control').append(
			'<button type="button" class="edit" title="Edit"><img src="icons/pencil.svg" alt="Edit" /></button>'+
			'<button type="button" class="remove" title="Remove"><img src="icons/circle-x.svg" alt="Remove" /></button>'
		);

		$(target+' button.add').on('click', function() {
			console.log('New Add Button Clicked');
			console.log(this);
		});
		$(target+' button.remove').on('click', function() {
			console.log('New Remove Button Clicked');
			console.log(this);
		});

		//TODO Bind Controls
	}
}


/** INITS */

//===UI Generators===
/** Layout Generator: Rows and Columns */
function initPage(target) {
	window.widgetRegistry;

	$.each(window.list["rows"], function(currentRow, item) {
		// Row title and removal control
		$(target).append(
			'<div id="row-'+currentRow+'" class="row"><div class="row-inner">'+
				'<h2 class="edit-control-header">Row #'+currentRow+'<div class="edit-row-control row-'+currentRow+'-control"></div></h2>'+
			'</div></div>'
			);

		// Give the row control its buttons
		create_row_edit_buttons(currentRow);

		// Load the columns/widgets
		$.each(item, function(i, col) {
			$('#row-'+currentRow+' .row-inner').append('<div id="col-'+col+'" class="col"><div class="inner"></div></div>');

			initColumn(col);
		});

		// TODO Add a "new widget" control
		$(target).append(
			'<div id="row-'+currentRow+'-control edit-row-control"></div>'
		);
	});
}

/** Column/Widget Generator, called by initPage */
function initColumn(colId) {
	// Get column information
	var column = window.list["columns"][colId];

	$('#col-'+colId).addClass(column["widget"]+" "+column["width"]);

	var args = [];

	args.push(colId);

	if(column["data"] != undefined || column["data"] != null)
		args.push(column["data"]);

	// Note arguments are passed as an array, where 0 is the target and 1 is the data
	widget(column["widget"], args );
}


function initEditMode() {
	create_edit_buttons();

	$('#edit').on('change', function() {
		if($(this).prop('checked') == true) {
			console.log('Edit Mode Enabled');
			enableEditMode();
		} else {
			console.log('Edit Mode Disabled');
			disableEditMode();
		}
	});
}
