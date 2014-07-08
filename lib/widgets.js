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
	widgets: [],
	
	register: function( name, displayname, output, form ) {
		if( 'undefined' == typeof( widgetRegistry.widgets[name] ) )
			widgetRegistry.widgets[name] = [];
		if( 'undefined' == typeof( widgetRegistry.widgets[name]["output"] ) )
			widgetRegistry.widgets[name]["output"] = [];
		if( 'undefined' == typeof( widgetRegistry.widgets[name]["form"] ) )
			widgetRegistry.widgets[name]["form"] = [];
		if( 'undefined' == typeof( widgetRegistry.widgets[name]["displayname"] ) )
			widgetRegistry.widgets[name]["displayname"] = [];
			
		widgetRegistry.widgets[name]["output"].push( output );
		widgetRegistry.widgets[name]["form"].push( form );
		widgetRegistry.widgets[name]["displayname"].push( displayname );
	},
	
	output: function( name, arguments ) {
		if( 'undefined' != typeof( widgetRegistry.widgets[name] ) )
			for( i = 0; i < widgetRegistry.widgets[name]["output"].length; i++ )
				if( true != widgetRegistry.widgets[name]["output"][i]( arguments ) ) { break; }
	},
	
	// TODO Consider changing form to data and reusing for saving of said data
	form: function( name, arguments ) {
		if( 'undefined' != typeof( widgetRegistry.widgets[name] ) )
			for( i = 0; i < widgetRegistry.widgets[name]["form"].length; i++ )
				if( true != widgetRegistry.widgets[name]["form"][i]( arguments ) ) { break; }
	},
	
	name: function( name ) {
		if( 'undefined' != typeof( widgetRegistry.widgets[name] ) )
			for(i = 0; i < widgetRegistry.widgets[name]["displayname"].length; i++)
				return widgetRegistry.widgets[name]["displayname"][i];
				
	}
};

/***** Default Widgets *******/

// Search
widgetRegistry.register(
	'search',
	'Search',
	function(args) {return search(args);},
	function(args) {return search_form(args);}
);
	function search(args) {
		console.log('Search Output');
		console.log(args);
		
		$(args[0]).html('<form id="searchform"><input name="s" id="s" type="text" placeholder="Search&#133;" /> <input value="Search" type="submit"></form>');
		
		// TODO Providor
		return true;
	}
	function search_form(args) {
		console.log('Search Form Output');
		console.log(args);
		return true;
	}


// Link List
widgetRegistry.register(
	'linklist',
	'Link List',
	function(args) {return linklist(args);},
	function(args) {return linklist_form(args);}
);
	function linklist( args ) {
		console.log('Link List Form Output');
		console.log(args);
		return true;
	}
	function linklist_form( args ) {
		console.log('Link List Output');
		console.log(args);
		return true;
	}


// RSS Feeds
widgetRegistry.register(
	'rss',
	'RSS Feed',
	function(args) {return rss(args);},
	function(args) {return rss_form(args);}
);
	function rss( args ) {
		console.log('RSS Output');
		console.log(args);
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
	'info',
	'Information Panel',
	function(args) {return infopanel(args);},
	function(args) {return infopnale_form(args);}
);
	function infopanel( args ) {
		
	}
	function infopanel_form( args ) {
		
	}


// Scrap (Gut or Junk)
/*
$.each(links, function(i, item) {
	window.list["links"].push(i);
});
*/