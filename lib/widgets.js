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
			if(widgetRegistry.widgets[name].defaults === null)
				return null;
			else
				for( i = 0; i < widgetRegistry.widgets[name].defaults.length; i++ )
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
	widgetRegistry.script( name, args[0] );
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

	//TODO Add edit controls
	create_edit_buttons('#col-'+id);

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

	console.log(window.list["rows"]);

	$.each(rows, function(i, item) {
		console.log(item);
		if( in_array( id, item ) ) {
			console.log('Column '+id+' found in '+i+', removing');
			remove_from_array(id, window.list["rows"][i]);
			enable_save();
		}
	});

	return true;
}

/** Widget shuffle */
function widget_shuffle( row, newIndex ) {
	//TODO
}

/**
 *
 */
function widget_edit_controls( id, header, float ) {
	var style = '';

	var possible_float_vals = ['left', 'right', 'inline'];

	if( typeof( float ) != 'undefined' && in_array(float, possible_float_vals) )
		style = 'style="float: '+float+';"';

	if( header == false || typeof( header ) == 'undefined' ) {
		return '<div '+style+' class="edit-control edit-manipulate col-'+id+'-controls"></div>';

	} else if ( header == true ) {
		var title = widgetRegistry.name( window.list["columns"][id]["widget"] );

		if( title != false ) {
			return '<h2 class="edit-control-header">'+title+' <div '+style+' class="edit-control edit-manipulate col-'+id+'-controls"></div></h2>';
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


/***** Default Widgets *******/

// Search
widgetRegistry.register(
	'search',
	'Search',
	function(args) {return search(args);},
	function(args) {return search_script(args);},
	"google"
);
	function search(args) {
		var target = widget_id_string(args[0], 'id')+' .inner';
		var providers = {
			'google': {
				'queryname': 'q',
				'url': 'https://www.google.com/search'
			},
			'duckduckgo': {
				'queryname': 'q',
				'url': 'https://duckduckgo.com/'
			}
		};

		// TODO Provider
		var saction = 'https://www.google.com/search';
		var queryname = 'q';

		$(target).html(
			widget_edit_controls( args[0], true, 'right' )+
			'<form id="searchform" method="get" action="'+saction+'">'+
				'<input name="'+queryname+'" id="s" type="text" placeholder="Search&#133;" />'+
				'<input value="Search" type="submit">'+
			'</form>'
			);
		return true;
	}

	function search_script() {
		return true;
	}

	function search_update(args) {

		console.log('Search Form Output');
		console.log(args);
		return true;
	}


// Link List
widgetRegistry.register(
	'links',
	'Link List',
	function(args) {return linklist(args);},
	function(args) {return linklist_script(args);},
	[{"url": "http://www.example.com/", "name": "Example Link"}]
);
	function linklist( args ) {
		var target = widget_id_string(args[0], 'id')+' .inner';

		$(target).html(
			widget_edit_controls( args[0], true, 'right' )+
			'<ul></ul>'
		);

		$.each(args[1], function(i, item) {
			$(target+' ul').append(
				'<li class="item-'+i+'"><a href="'+item["url"]+'">'+
				item["name"]+'</a> <button type="button" class="submitremoval edit-element" title="Remove Item"><img src="icons/circle-x.svg" alt="Remove Item"/></button></li>'
			);
		});

		$(target+' ul').append(
			'<li class="edit-element"><input type="text" name="url" placeholder="URL (http://www.example.com/)" /><input type="text" name="name" placeholder="Name (Example Site)" /><button type="button" class="submitadd" title="Add Item"><span class="img-helper"><img src="icons/plus.svg" /></span> Add Item</button></li>'
		);

		return true;
	}
	function linklist_script( args ) {
		var id = '#col-'+args[0];
		var idnum = args[0];

		// ADD LINK
		$(id+' .submitadd').on('click', function() {
			var breakfunc = false;

			// Retrieve & Validate
			var link_url = $(id+' [name="url"]').val();
			if( !check_url(link_url) ) {
				$(id+' [name="url"]').addClass('invalid');
				breakfunc = true;
			} else {
				//So we don't confuse the user about what is wrong
				$(id+' [name="url"]').removeClass('invalid');
			}

			var link_name = $(id+' [name="name"]').val();
			if( link_name.length < 1 ) {
				$(id+' [name="name"]').addClass('invalid');
				breakfunc = true;
			} else {
				//So we don't confuse the user about what is wrong
				$(id+' [name="name"]').removeClass('invalid');
			}

			if(breakfunc == true) {
				if($(id+' .invalid-val').length < 1) {
					$(id+' li.edit-element').append(
						'<p class="invalid-val">Invalid URL (make sure it includes http://) or the name is too short (must be at least one character).</p>'
					);
				}
				return;
			}

			// Remove any error messages if we progressed past that stage
			if($(id+' .invalid-val').length > 0) {
				$(id+' .invalid-val').remove();
				$(id+' .invalid').removeClass('invalid');
			}


			// Update lists["columns"]
			window.list["columns"][idnum]["data"].push({"name": link_name, "url": link_url});

			var itemnum = window.list["columns"][idnum]["data"].length-1;

			console.log('Column '+idnum+': New list item '+itemnum+' created.');

			// Output new list item
			$(id+' ul li.edit-element').before(
				'<li class="item-'+itemnum+'"><a href="'+link_url+'">'+
				link_name+'</a> <button type="button" class="submitremoval edit-element" title="Remove Item"><img src="icons/circle-x.svg" alt="Remove Item"/></button></li>'
			);

			// Bind new remove button
			$(id+' .item-'+itemnum+' .submitremoval').on('click', function() {
				var regx = new RegExp('item-([0-9]*)', 'g');

				var result = regx.exec( $(this).parent().prop('class') );

				console.log(result);

				var target_item = parseInt(result[1]);

				console.log('Removing '+target_item);

				// Remove from data; splice item is +1 because index is based on length
				window.list["columns"][target_col]["data"].splice(target_item, 1);

				// Remove the item from the list
				$(this).parent().remove();

				enable_save();
			});

			// Update save button
			enable_save();
		});

		// Remove existing link
		$(id+' .submitremoval').on('click', function() {
			var regx = new RegExp('item-([0-9]*)', 'g');

			var result = regx.exec( $(this).parent().prop('class') );

			console.log(result);

			var target_item = parseInt(result[1]);

			var target_col = get_col_idnum( $(this).closest('.col').prop('id') );

			console.log(target_item);
			// Remove from data
			window.list["columns"][target_col]["data"].splice(target_item, 1);

			// Remove the item from the list
			$(this).parent().remove();

			enable_save();
		});
	}


// RSS Feeds
widgetRegistry.register(
	'news',
	'News Feed',
	function(args) {return rss(args);},
	function(args) {return rss_script(args);},
	{
		"url": "http://feeds.bbci.co.uk/news/rss.xml",
		"style": "scroll"
	}
);
	function rss( args ) {

		var target = widget_id_string( args[0], 'id' );

		/** TODO Reenable and work on server
		var feed = read_feed(args[1]["url"]);

		console.log(feed);
		*/
		//FIXME args[1] is undefined
		$(target).html(
			widget_edit_controls( args[0], true, 'right' )+
			'<p>This will be a news feed of: '+args[1]["url"]+' (and it will '+args[1]["style"]+')'
		);

		return true;
	}
	function rss_script( args ) {
		console.log('RSS Script Output');
		console.log(args);
		return true;
	}

// Weather
widgetRegistry.register(
	'weather',
	'Weather',
	function(args) {return weather(args);},
	function(args) {return weather_script(args);},
	null
);
	function weather( args ) {
		console.log('Weather Output');
		console.log(args);
		var target = widget_id_string( args[0], 'id' );

		$(target).html(
			widget_edit_controls( args[0], true, 'right' )
		);
		return true;
	}
	function weather_form( args ) {
		console.log('Weather Form Output');
		console.log(args);
		return true;
	}

// Timers
widgetRegistry.register(
	'timer',
	'Timer',
	function(args) {return timer(args);},
	function(args) {return timer_script(args);},
	null
);
	function timer( args ) {
		console.log('Timer Output');
		console.log(args);
		var target = widget_id_string( args[0], 'id' );

		$(target).html(
			widget_edit_controls( args[0], true, 'right' )
		);
		return true;
	}
	function timer_script( args ) {
		console.log('Timer Form');
		console.log(args);
		return true;
	}


// Info panel
widgetRegistry.register(
	'intro',
	'Introduction Panel',
	function(args) {return infopanel(args);},
	function(args) {return infopanel_script(args);},
	null
);
	function infopanel( args ) {
		target = widget_id_string(args[0], 'id')+' .inner';
		console.log('Info Output');
		$(target).append( widget_edit_controls( args[0], false, 'right' ) );
		$(target).append( '<h3>Welcome</h3>' );
		$(target).append( '<p>I\'m your new Homepage! Check out the <a href="">documentation</a> to find out how to use me.</p>' );
		$(target).append( '<h2>Alpha!</h2>' );
		$(target).append( '<p>I\'m a growing app, my features are incomplete and things may change, hit the "Reset Local Storage" if things appear to be broken&#133; I\'ve probably updated the way things are stored!</p>' );
		return true;
	}
	function infopanel_script( args ) {

	}


widgetRegistry.register(
	'empty',
	'Empty',
	function(args) {return empty_widget(args);},
	function(args) {return empty_widget_script(args);},
	null
);
	function empty_widget( args ) {
		var target = widget_id_string( args[0], 'id' );

		$(target).html(
			widget_edit_controls( args[0], true, 'right' )
		);
	}
	function empty_widget_script( args ) { }


widgetRegistry.register(
	'checklist',
	'Checklist',
	function(args) { return checklist(args); },
	function(args) { return checklist_script(args); },
	null
);
	function checklist(args) {
		var target = widget_id_string( args[0], 'id' );

		$(target).html(
			widget_edit_controls( args[0], true, 'right' )
		);
	}
	function checklist_script(args) {

	}
