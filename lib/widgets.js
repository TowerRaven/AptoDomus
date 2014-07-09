/**
 * Widget registry and default widgets
 *
 * name is used in identifying it to localStorage
 * displayname is used when the user is selecting it
 * form is used for inputting data
 * output is used when the finished thing is appearing to the end user
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
	}
};

function widget( name, args ) {
	widgetRegistry.output( name, args );
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

		$(args[0]).html(
			'<form id="searchform" method="get" action="'+saction+'">'+
				'<input name="'+queryname+'" id="s" type="text" placeholder="Search&#133;" />'+
				'<input value="Search" type="submit">'+
				'<div style="display: none; float: right;" class="edit-control edit-manipulate"></div>'+
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
		console.log('Link List Output');
		console.log(args);

		$(args[0]).html('<ul></ul>');

		$.each(args[1], function(i, item) {
			$(args[0]+' ul').append('<li><a href="'+item["url"]+'">'+item["name"]+'</a></li>');
		});

		$(args[0]).prepend('<div style="float: right; display: none" class="edit-control edit-manipulate"></div>');

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
		console.log('News Output');

		//var feed = read_feed(args[1]["url"]);

		//console.log(feed);

		$(args[0]).html('<p>This will be a news feed of: '+args[1]["url"]+' (and it will '+args[1]["style"]+')');

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
		console.log('Info Output');
		$(args[0]).append('<h3>Welcome</h3>');
		$(args[0]).append('<p>I\'m your new Homepage! Check out the <a href="">documentation</a> to find out how to use me.</p>');
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
