/**
 * Homepage Functions
 * Version: 0.04
 * Description: Common functions file; contains generally useful functions.
 *
 * Research: http://diveintohtml5.info/storage.html
 */

var save_type = null;
var init_edit = false;

/** Rounds 'num' to the number of decimal 'places' */
function roundDecimal(num, places) {
	return +(Math.round(num + "e+" + places)  + "e-" + places);
}

/** Searches array for string */
function in_array(needle, haystack, exact) {
	for( var key in haystack ) {
		if( exact == true ) {
			if(haystack[key] === needle)
				return true;
		} else {
			if(haystack[key] == needle)
				return true;
		}
	}

	return false;
}

/** Searches array for key */
function key_in_array(needle, haystack, exact) {
	for( var key in haystack ) {
		if(exact) {
			if( needle === key)
				return true;
		} else {
			if( needle == key )
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
	$('.edit-row-control').show("blind", {direction: "up"});
	$('.inv-edit-element').hide("blind", {direction: "up"});
	$('.edit-element').show("blind", {direction: "up"});
	$('#content').sortable({disabled: false});
	$('.row-inner').sortable({disabled: false, items: '> .col'});
	$('h1#site-title').hide({direction: "left"});
	$('input[name="site-title"]').show({direction: "left"});
}

/** Disable */
function disableEditMode() {
	//$('.edit-control').fadeOut();
	$('body').removeClass('edit-mode-on');
	$('.edit-control, .edit-control-header').hide("blind", {direction: "up"});
	$('.edit-row-control').hide("blind", {direction: "up"});
	$('.inv-edit-element').show("blind", {direction: "up"});
	$('.edit-element').hide("blind", {direction: "up"});
	$('#content').sortable({disabled: true});
	$('.row-inner').sortable({disabled: true, items: '> .col'});
	$('h1#site-title').show({direction: "left"});
	$('input[name="site-title"]').hide({direction: "left"});
}


/** Row Control Generator */
function create_row_edit_buttons(target) {
	//console.log('Creating row edit buttons for... '+target);

	var widthlist = [
		["onethird", "One Third"],
		["twothird", "Two Thirds"],
		["onesixth", "One Sixth"],
		["fullwidth", "Full Width"]
	];

	var widthlist_el = '';

	$.each(widthlist, function(i, item) {
		widthlist_el = widthlist_el +
			'<option val="'+item[0]+'">'+item[1]+'</option>';
	});

	var widgetlist = get_widget_list();

	var widgetlist_el = '';

	$.each(widgetlist, function(i, item) {
		widgetlist_el = widgetlist_el +
			'<option val="'+item[0]+'">'+item[1]+'</option>';
	});

	if(typeof(target) === 'undefined') {
		$('.edit-row-control').append(
			'<button type="button" class="edit-element remove" title="Remove Row" style="display: none;"><img src="icons/circle-x.svg" alt="Remove Row" /></button>'
		);

		$('.row').append(
			'<select class="addcolumnwidth edit-element" name="colwidth" style="display: none;">'+widthlist_el+'</select>'
		);

		$('.row').append(
			'<select class="addcolumninput edit-element" name="coltype" style="display: none;">'+widgetlist_el+'</select>'
		);

		$('.row').append(
			'<button type="button" class="edit-element addcolumn" title="Add Widget" style="display: none;"><img src="icons/plus.svg"/ > Add Widget</button>'
		);
	} else {
		// Append this to the row controls
		$('#row-'+target+' .edit-row-control').append(
			'<button type="button" class="edit-element remove" title="Remove Row"><img src="icons/circle-x.svg" alt="Remove Row" /></button>'
		);

		// Append these to the end of the row (row parent)
		$('#row-'+target).append(
			'<select class="addcolumnwidth edit-element" name="colwidth">'+widthlist_el+'</select>'
		);

		$('#row-'+target).append(
			'<select class="addcolumninput edit-element" name="coltype">'+widgetlist_el+'</select>'
		);


		$('#row-'+target).append(
			'<button type="button" class="edit-element addcolumn" title="Add Widget"><img src="icons/plus.svg" / > Add Widget</button>'
		);

		if($('#edit').prop('checked') == false)
			$('#row-'+target+' .edit-element').hide(); // Safeguard hiding
	}
}

/** Standard button creator */
function create_edit_buttons(target) {
	if(typeof(target) === 'undefined') {
		$('.edit-control').append(
			'<button type="button" class="edit" title="Edit Widget"><img src="icons/pencil.svg" alt="Edit Widget" /></button>'+
			'<button type="button" class="remove" title="Remove Widget"><img src="icons/circle-x.svg" alt="Remove Widget" /></button>'
		);

		$('#content').append('<div id="row-edit">'+
			'<button type="button" class="edit-element addrow" id="add-row" style="display: none;"><img src="icons/plus.svg" /> Add Row</button>'+
		'</div>');

		$('#add-row').on('click', function() {
			var rowtarget = '#content';

			var rowcount = 0;
			if(window.list["rows"] != undefined)
				rowcount = window.list["rows"].length;

			var newrow = parseInt(rowcount);

			window.list["rows"][newrow] = new Array();

			// Add row element
			$('#add-row').before(
				'<div id="row-'+newrow+'" class="row"><div class="row-inner">'+
					'<h2 class="edit-control-header">Row #'+newrow+'<div class="edit-row-control row-'+newrow+'-control"></div></h2>'+
				'</div></div>'
				);

			enable_save();

			create_row_edit_buttons(newrow);

			$('#row-'+newrow+' .edit-row-control button.remove').on('click', function() {
				remove_row( newrow );
			});

			// Bind column add controls
			$('#row-'+newrow+' .addcolumn').on('click', function() {
				var row_id = '#row-'+newrow;

				var col_width = $(row_id+' .addcolumnwidth option:selected').attr('val');
				var col_type = $(row_id+' .addcolumninput option:selected').attr('val');

				widget_add(newrow, col_type, col_width);
			});
		});

		// Bind controls

		// Rows
		$.each($('.row .edit-row-control button.remove'), function(i, elem) {
			$(elem).on('click', function() {
				var id = get_row_idnum( $(elem).parent().prop('class') );

				remove_row( id );
			});
		});

		$.each($('.row .addcolumn'), function(i, elem) {
			$(elem).on('click', function() {
				var parent_row = '#'+$(elem).parent().prop('id');
				var parent_row_id = get_row_idnum( parent_row );

				var col_width = $(parent_row+' .addcolumnwidth option:selected').attr('val');

				var col_type = $(parent_row+' .addcolumninput option:selected').attr('val');

				widget_add(parent_row_id, col_type, col_width);
			});
		});


		// Columns/Widgets
		$.each($('.col button.edit'), function(i, elem) {
			$(elem).on('click', function() {
				//TODO Show current widget's controls
			});
		});
		$.each($('.col button.remove'), function(i, elem) {
			$(elem).on('click', function() {
				var column = get_col_from_class( $(elem).parent().prop('class') );

				// Remove the widget
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

		$(target+' button.edit').on('click', function() {
			//TODO
		});
		$(target+' button.remove').on('click', function() {
			var col_id = get_col_idnum(target);

			widget_remove(col_id);
			$(target).slideUp("normal", function() {
				$(target).remove();
			});
		});
	}
}


function enable_save() {
	if(save_type != "row") {
		save_type = "normal";
		$('#data-manager .normal').show();
	}

	$('#data-manager').show("blind", {direction: "down"});
}

function enable_row_save() {
	if(save_type == "normal")
		$('#data-manager .normal').hide();

	save_type = "row";
	$('#data-manager .rowsave').show();

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
	});

	enable_save();
}


/** INITS */

//===UI Generators===
/** Layout Generator: Rows and Columns */
function initPage(target) {
	$('h1#site-title').html(window.title);
	$('head title').html(window.title);
	$('#sitetitleinput').val(window.title);

	window.widgetRegistry;

	$.each(window.list["rows"], function(currentRow, item) {
		// Row title and removal control
		$(target).append(
			'<div id="row-'+currentRow+'" class="row"><div class="row-inner">'+
				'<h2 class="edit-control-header" style="display: none;">Row #'+currentRow+'<div class="edit-row-control row-'+currentRow+'-control" style="display: none;"></div></h2>'+
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
			'<div id="row-'+currentRow+'-control edit-row-control" style="display: none;"></div>'
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

	// Sortable feature

	$.each($('.col'), function(i, column) {
		var parentRow = $(column).parent().prop('id');
		$(parentRow+' .row-inner').sortable({
			appendTo: "parent",
			cursor: "move",
			tolerance: "intersect",
			items: "> .col",
			update: function(event, ui) {
				var parentRow = $(ui.item[0]).closest('.row').prop('id');

				var parentRow_idnum = get_row_idnum('#'+parentRow);
				this.rowColumns = new Array();

				var row = this;

				$.each( $('#'+parentRow+' .col'), function(i, col) {
					row.rowColumns.push( get_col_idnum( $(col).prop('id') ) );
				});

				window.list["rows"][parentRow_idnum] = this.rowColumns;

				enable_save();
			}
		});
	});

	$('#content').sortable({
		appendTo: "parent",
		cursor: "move",
		tolerance: "intersect",
		items: "> .row",
		update: function(event, ui) {
			enable_row_save();
		}
	});
}


function initEditMode() {
	create_edit_buttons();

	if($('#edit').prop('checked') == true) {
		console.log('Edit Mode Enabled');
		enableEditMode();
	} else {
		console.log('Edit Mode Disabled');
		disableEditMode();
	}

	$('#edit').on('change', function() {
		if($(this).prop('checked') == true) {
			console.log('Edit Mode Enabled');
			enableEditMode();
		} else {
			console.log('Edit Mode Disabled');
			disableEditMode();
		}
	});

	if(init_edit == false) {
		$('#sitetitleinput').on('keyup', function() {
			window.title = $('#sitetitleinput').val();
			$('h1#site-title').html(window.title);
			$('head title').html(window.title);
			enable_save();
		});

		// Save data buttons
		$('#data-manager [name="save-settings"]').on('click', function() {
			console.log('Saving the settings.');

			setData("title", window.title);
			saveData("rows", window.list["rows"]);
			saveData("columns", window.list["columns"]);

			$('#data-manager').hide("blind", {"direction": "down"});
		});

		$('#data-manager [name="save-row-settings"]').on('click', function() {
			$('#data-manager [name="save-row-settings"]').attr('disabled', 'disabled');
			console.log('Saving settings and refreshing the layout.');

			//Update row settings upon saving
			this.newRowLayout = new Array();
			var sort = this;
			// Get new row order
			$('.row').each( function(i, row) {
				var row_idnum = parseInt(get_row_idnum('#'+$(row).attr('id')));
				sort.newRowLayout.push(window.list["rows"][row_idnum]);
			});

			window.list["rows"] = this.newRowLayout;

			// Save all changes
			saveData("rows", window.list["rows"]);
			saveData("columns", window.list["columns"]);

			$('#data-manager').hide("blind", {"direction": "down"}, function() {
				$('#data-manager .normal, #data-manager .rowsave').hide();
			});

			// Refresh the page layout
			$('#content').slideUp("normal", function() {
				$('#content').html(' ');
				initPage('#content');
				initEditMode();
				$('#data-manager [name="save-row-settings"]').removeAttr('disabled');
			}).slideDown();
		});
		init_edit = true;
	}
}

function initDialogues() {
	/** Dialogue Buttons */
	$('#button_settings').on('click', function() {
		$('#settings').show();
		$('#dimmer').show();
	});

	$('#settings .close').on('click', function() {
		$('#settings').hide();
		$('#dimmer').hide();
	});

	/** Closes the relevant parent overlay window */
	$('.back').on('click', function() {
		$(this).closest('.overlay-dialogue').hide();
	});

	/** Select all the settings content */
	$('#thesettings').on('click', function() {
		$('#thesettings').select();
	});

	/** Settings */
	$('#button_backupsettings').on('click', function() {
		$('#backupsettings').show();
		backupSettings();
	});

	$('#button_restoresettings').on('click', function() {
		$('#restoresettings').show();
	});

	$('#restoresettings-go').on('click', function() {
		// TODO notify of overwrite
		var newsettings = $('#newsettings').val();

		restoreSettings(newsettings);
	});
}
