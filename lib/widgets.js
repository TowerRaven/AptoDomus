/**
 * Widget registry and default widgets
 *
 * 'name' is used in identifying it to localStorage
 * 'displayname' is used when the user is selecting it
 * 'form' is used for inputting data TODO Change this to data?
 * 'output' is used when the finished thing is appearing to the end user
 *
 * form and output take shape as functions you have defined
 *
 * See following links for hook (widget registry) system:
 * 	http://www.velvetcache.org/2010/08/19/a-simple-javascript-hooks-system
 */
var widgetRegistry = {
	widgets: {},

	register: function( name, displayname, output, form ) {
		if( 'undefined' == typeof( widgetRegistry.widgets[name] ) )
			widgetRegistry.widgets[name] = {};
		if( 'undefined' == typeof( widgetRegistry.widgets[name]["output"] ) )
			widgetRegistry.widgets[name].output = output;
		if( 'undefined' == typeof( widgetRegistry.widgets[name]["form"] ) )
			widgetRegistry.widgets[name].form = form;
		if( 'undefined' == typeof( widgetRegistry.widgets[name]["displayname"] ) )
			widgetRegistry.widgets[name].displayname = displayname;
	},

	output: function( name, arguments ) {
		if( 'undefined' != typeof( widgetRegistry.widgets[name] ) )
			for( i = 0; i < widgetRegistry.widgets[name].output.length; i++ )
				if( true != widgetRegistry.widgets[name].output( arguments ) ) { break; }
	},


	form: function( name, arguments ) {
		if( 'undefined' != typeof( widgetRegistry.widgets[name] ) )
			for( i = 0; i < widgetRegistry.widgets[name].form.length; i++ )
				if( true != widgetRegistry.widgets[name].form( arguments ) ) { break; }
	},


	name: function( name ) {
		if( 'undefined' != typeof( widgetRegistry.widgets[name] ) )
			for( i = 0; i < widgetRegistry.widgets[name].form.length; i++ )
				return widgetRegistry.widgets[name].displayname;
	}
};

function widget( name, args ) {
	widgetRegistry.output( name, args );
}


/** Adds a new widget */
function widget_add( row, id, data ) {

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
			console.log(window.list["rows"]);
			//TODO Notify edit controls of change (trigger save button)
		}
	});

	return true;
}

/** Updates data of existing widget */
function widget_update( id, data ) {

}

/** Widget shuffle */
function widget_shuffle( row, newIndex ) {

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
		var title = widgetRegistry.name( list["columns"][id]["widget"] );

		if( title != false ) {
			return '<h2 class="edit-control-header">'+title+' <div '+style+' class="edit-control edit-manipulate col-'+id+'-controls"></div></h2>'
		} else {
			return false;
		}
	}
	return false;
}

/** Returns a string from the id number,
 *	optional second argument 'class' or 'id'
 */
function widget_id_string( id, idorclass ) {
	console.log('Widget ID string for: '+id+' formatted as '+idorclass);
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
	function(args) {return search_form(args);}
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

		// TODO Providor
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

	function search_form(args) {

		console.log('Search Form Output');
		console.log(args);
		return true;
	}


// Link List
widgetRegistry.register(
	'links',
	'Link List',
	function(args) {return linklist(args);},
	function(args) {return linklist_form(args);}
);
	function linklist( args ) {
		var target = widget_id_string(args[0], 'id')+' .inner';

		$(target).html(
			widget_edit_controls( args[0], true, 'right' )+
			'<ul></ul>'
		);

		$.each(args[1], function(i, item) {
			$(target+' ul').append(
				'<li><a href="'+item["url"]+'">'+
				item["name"]+'</a></li>'
			);
		});

		return true;
	}
	function linklist_form( args ) {
		console.log('Link List Form Output');
		console.log(args);
		return true;
	}


// RSS Feeds
widgetRegistry.register(
	'news',
	'News Feed',
	function(args) {return rss(args);},
	function(args) {return rss_form(args);}
);
	function rss( args ) {

		var target = widget_id_string( args[0], 'id' );

		/** TODO Reenable and work on server
		var feed = read_feed(args[1]["url"]);

		console.log(feed);
		*/

		$(target).html(
			widget_edit_controls( args[0], true, 'right' )+
			'<p>This will be a news feed of: '+args[1]["url"]+' (and it will '+args[1]["style"]+')'
		);

		return true;
	}
	function rss_form( args ) {
		console.log('RSS Form Output');
		console.log(args);
		return true;
	}

// Weather
widgetRegistry.register(
	'weather',
	'Weather',
	function(args) {return weather(args);},
	function(args) {return weather_form(args);}
);
	function weather( args ) {
		console.log('Weather Output');
		console.log(target);
		console.log(args);
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
	function(args) {return timer_form(args);}
);
	function timer( args ) {
		console.log('Timer Output');
		console.log(args);
		return true;
	}
	function timer_form( args ) {
		console.log('Timer Form');
		console.log(args);
		return true;
	}


// Info panel
widgetRegistry.register(
	'intro',
	'Introduction Panel',
	function(args) {return infopanel(args);},
	function(args) {return infopnale_form(args);}
);
	function infopanel( args ) {
		target = widget_id_string(args[0], 'id')+' .inner';
		console.log('Info Output');
		$(target).append( widget_edit_controls( args[0], false, 'right' ) );
		$(target).append( '<h3>Welcome</h3>' );
		$(target).append( '<p>I\'m your new Homepage! Check out the <a href="">documentation</a> to find out how to use me.</p>' );
		return true;
	}
	function infopanel_form( args ) {

	}


// Scrap (Gut or Junk)
/*
$.each(links, function(i, item) {
	window.list["links"].push(i);
});
*/
