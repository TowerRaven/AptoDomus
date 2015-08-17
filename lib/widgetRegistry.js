/**
 * Widget registry and default widgets
 * Version: 0.3
 *
 * 'name' is used in identifying it to localStorage
 * 'displayname' is used when the user is selecting it
 * 'update' is used to update the JSON with new settings
 * 'script' is used to output any functional javascript
 * 'output' is used when the finished thing is appearing to the end user
 *
 * form and output take shape as functions you have defined
 *
 * See following links for hook (widget registry) system:
 * 	http://www.velvetcache.org/2010/08/19/a-simple-javascript-hooks-system
 */
var widgetRegistry = {
	widgets: {},

	register: function( name, displayname, output, script, defaults ) {
		if( 'undefined' == typeof( widgetRegistry.widgets[name] ) )
			widgetRegistry.widgets[name] = {};
		if( 'undefined' == typeof( widgetRegistry.widgets[name]["output"] ) )
			widgetRegistry.widgets[name].output = output;
		if( 'undefined' == typeof( widgetRegistry.widgets[name]["script"] ) )
			widgetRegistry.widgets[name].script = script;
		if( 'undefined' == typeof( widgetRegistry.widgets[name]["displayname"] ) )
			widgetRegistry.widgets[name].displayname = displayname;
		if( 'undefined' == typeof( widgetRegistry.widgets[name]["defaults"] ) )
			widgetRegistry.widgets[name].defaults = defaults;
	},

	output: function( name, arguments ) {
		if( 'undefined' != typeof( widgetRegistry.widgets[name] ) )
			for( i = 0; i < widgetRegistry.widgets[name].output.length; i++ )
				if( true != widgetRegistry.widgets[name].output( arguments ) ) { break; }
	},


	script: function( name, arguments ) {
		if( 'undefined' != typeof( widgetRegistry.widgets[name] ) )
			for( i = 0; i < widgetRegistry.widgets[name].script.length; i++ )
				if( true != widgetRegistry.widgets[name].script( arguments ) ) { break; }
	},


	defaults: function( name ) {
		if( 'undefined' != typeof( widgetRegistry.widgets[name] ) )
			if(widgetRegistry.widgets[name].defaults == null)
				return null;
			else
				return widgetRegistry.widgets[name].defaults;
	},


	name: function( name ) {
		if( 'undefined' != typeof( widgetRegistry.widgets[name] ) )
			for( i = 0; i < widgetRegistry.widgets[name].displayname.length; i++ )
				return widgetRegistry.widgets[name].displayname;
	}
};


/** Returns numbered array with key and name pairs */
function get_widget_list() {
	var widget_list = [];

	for (var key in widgetRegistry.widgets) {
		if( widgetRegistry.widgets.hasOwnProperty(key) ) {
			widget_list.push([key, widgetRegistry.widgets[key]["displayname"]]);
		}
	}

	return widget_list;
}


/** Outputs the widget and its script */
function widget( name, args ) {
	widgetRegistry.output( name, args );
	widgetRegistry.script( name, args );
}

/** Adds a new widget, accepts JSON data and the intended row.
 *	Automatically generates widget column id. Returns ID of new column.
 *	Default data is determined by type, width from the UI
 */
function widget_add( row, type, width ) {
	// Find the highest widget ID in existing rows
	var last_widget = -1;

	$.each(window.list["rows"], function(currentRow, widgets) {
		$.each(widgets, function(currentWidget, value) {
			if(last_widget < value)
		  		last_widget = value;
		});
	});

	// Go one higher
	var id = parseInt(last_widget)+1;
	id = id.toString();

	window.list["rows"][row].push(id);

	// Compile data object
	var data = {};

	data["widget"] = type;
	data["data"] = widgetRegistry.defaults( type );
	data["width"] = width;

	window.list["columns"][id] = {};

	window.list["columns"][id] = data;

	// Output new widget to frontend
	var args = [];
	args.push( id );
	args.push( window.list["columns"][id]["data"] );

	$('#row-'+row+' .row-inner').append('<div id="col-'+id+'" class="col"><div class="inner"></div></div>');

	initColumn(id);

	// Add edit controls
	create_edit_buttons('#col-'+id);
	
	$('.edit-control, .edit-control-header').show("blind", {direction: "up"});

	// Notify controls of change
	enable_save();

	return id;
}


/** Removes the widget */
function widget_remove( id ) {
	// Deep copy (recursive) of list["rows"] and list["columns"] globals
	// (we'll be modifying the originals, jQuery.each uses .length)
	var rows = $.extend( true, {}, window.list["rows"] );
	var cols = $.extend( true, {}, window.list["columns"] );

	$.each(rows, function(i, item) {
		console.log(item);
		if( in_array( id, item ) ) {
			console.log('Column '+id+' found in '+i+', removing.');
			remove_from_array(id, window.list["rows"][i]);
			enable_save();
		}
	});

	return true;
}

/**
 * Creates controls for widgets. Assumes hidden FIXME
 */
function widget_edit_controls( id, header, float, hidden ) {
	var style = '';

	var possible_float_vals = ['left', 'right', 'inline'];

	if( typeof( float ) != 'undefined' && in_array(float, possible_float_vals) )
		style = 'style="float: '+float+';"';

	if( header == false || typeof( header ) == 'undefined' ) {
		return '<div '+style+' class="edit-control edit-manipulate col-'+id+'-controls" style="display: none;"></div>';

	} else if ( header == true ) {
		var title = widgetRegistry.name( window.list["columns"][id]["widget"] );

		if( title != false ) {
			return '<h2 class="edit-control-header" style="display: none;">'+title+' <div '+style+' class="edit-control edit-manipulate col-'+id+'-controls" style="display: none;"></div></h2>';
		} else {
			return false;
		}
	}
	return false;
}


/**
 *	Updates localStorage with settings
 */
function widget_save_all() {
	saveData('rows', window.list["rows"]);
	saveData('columns', window.list["columns"]);
}

/** Returns a string from the id number,
 *	optional second argument 'class' or 'id'
 */
function widget_id_string( id, idorclass ) {
	if( typeof( idorclass ) == 'undefined' )
		return 'col-'+id;
	else if( idorclass == 'class' )
		return '.col-'+id;
	else if( idorclass == 'id' )
		return '#col-'+id;
	else
		return false;
}