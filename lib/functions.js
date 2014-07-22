/**
 * Homepage Functions
 * Version: 0.02
 * Description: Common functions file; contains generally useful functions.
 *
 * Research: http://diveintohtml5.info/storage.html
 */

/** Rounds 'num' to the number of decimal 'places' */
function roundDecimal(num, places) {
	return +(Math.round(num + "e+" + places)  + "e-" + places);
}

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

	if( regx.test(url) )
		return true;
	else
		return false;
}

/** Feed Checker (XML) */
function check_feed(url) {
	var regx = new RegExp ( 'http:\/\/[a-zA-Z.\/%]*.xml', 'g' );

	if( regx.test(url) )
		return true;
	else
		return false;
}

/** Row ID Finder; returns null if failed */
function get_row_idnum(id) {
	var regx = new RegExp ( "row-([0-9]{1,})", 'g');

	match = regx.exec(id);

	$.each(match, function(ind, item) {
		if(ind != 0) {
			if(item != undefined) {
				match_return = item;
			}
		}
	});

	return match_return;
}

/** Col ID Finder; returns null if failed */
function get_col_idnum(id) {
	var regx = new RegExp ( "col-([0-9]{1,})", 'g');

	var match_return = null;

	match = regx.exec(id);

	$.each(match, function(ind, item) {
		if(ind != 0) {
			if(item != undefined)
				match_return = item;
		}
	});

	return match_return;
}

/** Finds column id from a classes string */
function get_col_from_class(classes) {
	var regx = new RegExp ( 'col-([0-9]*)-controls', 'g');

	var match_return = null;

	match = regx.exec(classes);

 	$.each(match, function(ind, item) {
		if(ind != 0) {
			if(item != undefined)
				match_return = item;
		}
	});

	return match_return;
}


//===Edit Mode===
/** Enable */
function enableEditMode() {
	//$('.edit-control').fadeIn();
	$('body').addClass('edit-mode-on');
	$('.edit-control, .edit-control-header').show("blind", {direction: "up"});
	$('.edit-element').show("blind", {direction: "up"});
}

/** Disable */
function disableEditMode() {
	//$('.edit-control').fadeOut();
	$('body').removeClass('edit-mode-on');
	$('.edit-control, .edit-control-header').hide("blind", {direction: "up"});
	$('.edit-element').hide("blind", {direction: "up"});
}


/** Row Control Generator */
function create_row_edit_buttons(target) {
	var widthlist = [
		["fullwidth", "Full WIdth"],
		["onethird", "One Third"],
		["twothird", "Two Thirds"],
		["onesixth", "One Sixth"]
	];

	var widgetlist = get_widget_list();

	var widgetlist_el = '';

	$.each(widgetlist, function(i, item) {
		widgetlist_el = widgetlist_el +
			'<option val="'+item[0]+'">'+item[1]+'</option>';
	});

	if(typeof(target) === 'undefined') {
		$('.edit-row-control').append(
			'<button type="button" class="remove" title="Remove Row"><img src="icons/circle-x.svg" alt="Remove Row" /></button>'
		);

		$('.row').append(
			'<select class="addcolumninput edit-element" name="coltype">'+widgetlist_el+'</select>'
		);

		$('.row').append(
			'<button type="button" class="addcolumn" title="Add Widget"><img src="icons/plus.svg"/ > Add Widget</button>'
		);


		// Bind buttons @ l:204
	} else {
		// Append this to the row controls
		$('#row-'+target+' .edit-row-control').append(
			'<button type="button" class="edit-element remove" title="Remove Row"><img src="icons/circle-x.svg" alt="Remove Row" /></button>'
		);

		// Append these to the end of the row (row parent)
		$('#row-'+target).append(
			'<select class="addcolumninput edit-element" name="coltype">'+widgetlist_el+'</select>'
		);


		$('#row-'+target).append(
			'<button type="button" class="edit-element addcolumn" title="Add Widget"><img src="icons/plus.svg" / > Add Widget</button>'
		);

		//TODO Bind buttons


	}
}

/** Standard button creator */
function create_edit_buttons(target) {
	if(typeof(target) === 'undefined') {
		$('.edit-control').append(
			'<button type="button" class="edit" title="Edit Widget"><img src="icons/pencil.svg" alt="Edit Widget" /></button>'+
			'<button type="button" class="remove" title="Remove Widget"><img src="icons/circle-x.svg" alt="Remove Widget" /></button>'
		);

		// Bind controls

		// Rows
		$.each($('.row .edit-row-control button.remove'), function(i, elem) {
			$(elem).on('click', function() {
				console.log( 'Remove Row' );
				console.log ($(elem).parent().prop('class') );
				var id = get_row_idnum( $(elem).parent().prop('class') );
				console.log( id );
				remove_row( id );
			});
		});

		$.each($('.row .addcolumn'), function(i, elem) {
			$(elem).on('click', function() {
				console.log( 'Add Column' );
				console.log( $(elem).parent().prop('id'));
			});
		});

		// TODO Row level widget add


		// Columns/Widgets
		$.each($('.col button.edit'), function(i, elem) {
			$(elem).on('click', function() {
				console.log($(elem).parent().prop('class'));
				console.log( get_col_from_class( $(elem).parent().prop('class') ) );

				//TODO Show current widget's controls
			});
		});
		$.each($('.col button.remove'), function(i, elem) {
			$(elem).on('click', function() {
				var column = get_col_from_class( $(elem).parent().prop('class') );

				console.log('Removal for widget: '+column);

				//TODO Remove the widget
				widget_remove(column);
				$('#col-'+column).slideUp("normal", function() {
					$('#col-'+column).remove();
				});
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
	}
}


function enable_save() {
	$('#data-manager').show("blind", {direction: "down"});
}


function remove_row(id) {
	$.each(window.list["rows"][id], function(i, col) {
		// Remove columns/widgets
		widget_remove( col );
	});

	// Remove row
	window.list["rows"].splice(id, 1);

	// TODO Remove row markup
	$('#row-'+id).slideUp("normal", function() {
		$('#row-'+id).remove();
	})

	enable_save();
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

	if($('#edit').prop('checked') == true)
		enableEditMode();
	else
		disableEditMode();

	$('#edit').on('change', function() {
		if($(this).prop('checked') == true) {
			console.log('Edit Mode Enabled');
			enableEditMode();
		} else {
			console.log('Edit Mode Disabled');
			disableEditMode();
		}
	});

	$('#data-manager [name="save-settings"]').on('click', function() {
		console.log('Saving the settings.');

		saveData("rows", window.list["rows"]);
		saveData("columns", window.list["columns"]);

		$('#data-manager').hide("blind", {"direction": "down"});
		// Reload the page?
	});
}
