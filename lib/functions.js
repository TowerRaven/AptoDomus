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


//===UI Generators===
/** Layout Generator: Rows and Columns */
function initPage(target) {
	window.widgetRegistry;

	$.each(window.list["rows"], function(i, item) {
		var currentRow = i;

		$(target).append('<div id="row-'+i+'" class="row"><div class="row-inner"></div></div>');

		$.each(item, function(i, col) {
			$('#row-'+currentRow+' .row-inner').append('<div id="col-'+col+'" class="col"><div class="inner"></div></div>');

			initColumn(col);
		});
	});
}

/** Column/Widget Generator, called by initPage */
function initColumn(colId) {
	// Get column information
	var column = window.list["columns"][colId];

	$('#col-'+colId).addClass(column["widget"]+" "+column["width"]);

	var args = [];

	args.push('#col-'+colId);

	if(column["data"] != undefined || column["data"] != null)
		args.push(column["data"]);

	// Note arguments are passed as an array, where 0 is the target and 1 is the data
	widget(column["widget"], args );
}


//===Edit Mode===
/** Enable */
function enableEditMode() {
	//$('.edit-control').fadeIn();
	$('.edit-control').removeClass('control-hidden');
}

/** Disable */
function disableEditMode() {
	//$('.edit-control').fadeOut();
	$('.edit-control').addClass('control-hidden');
}

/** Standard button creator */
function create_edit_buttons(target) {
	if(typeof(target) === 'undefined') {
		$('.edit-control').append(
			'<button type="button" class="add" title="Add"><img src="icons/plus.svg" alt="Add" /></button>'+
			'<button type="button" class="remove" title="Remove"><img src="icons/minus.svg" alt="Remove" /></button>'
		);
	} else {
		$(target+' .edit-control').append(
			'<button type="button" class="add" title="Add"><img src="icons/plus.svg" alt="Add" /></button>'+
			'<button type="button" class="remove" title="Remove"><img src="icons/minus.svg" alt="Remove" /></button>'
		);
	}
}

function initEditMode() {
	$('#edit').on('change', function() {
		if($(this).prop('checked') == true) {
			console.log('Edit Mode Enabled');
			enableEditMode();
		} else {
			console.log('Edit Mode Disabled');
			disableEditMode();
		}
	});

	create_edit_buttons();
}

//===Other===
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
