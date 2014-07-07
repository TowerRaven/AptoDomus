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
 */
var widgetRegistry = {
	widgets: [],
	
	register: function( name, displayname, form, output ) {
		if( 'undefined' == typeof( widgetRegistry.widgets[name] ) ) {
			widgetRegistry.widgets[name]["output"] = [];
			widgetRegistry.widgets[name]["form"] = [];
		}
		widgetRegistry.widgets[name]["output"].push( output );
		widgetRegistry.widgets[name]["form"].push( form );
		widgetRegistry.widgets[name]["displayname"].push( displayname );
	},
	
	output: function( name, arguments ) {
		if( 'undefined' != typeof( widgetRegistry.widgets[name] ) )
			for( i = 0; i < widgetRegistry.widgets[name]["output"].length; i++ )
				if( true != widgetRegistry.widgets[name]["output"][i]( arguments ) ) { break; }
	},
	
	form: function( name, arguments ) {
		if( 'undefined' != typeof( widgetRegistry.widgets[name] ) )
			for( i = 0; i < widgetRegistry.widgets[name]["form"].length; i++ )
				if( true != widgetRegistry.widgets[name]["form"][i]( arguments ) ) { break; }
	}
};

/** 
 * Registers a widget with the widgetRegistry (ease-of-use)
 * Alternatively use 	widgetRegistry.register(name, callback)
 */
function register_widget(name, displayname, form, output) {
	return widgetRegistry.register(name, callback);
}

/** 
 * Runs the attached hook with passed arguments
 * Alternatively use 	widgetRegistry.call(name, args);
 */
function widget(name, args) {
	widgetRegistry.output(name, args);
}

/**
 * 
 */
function widget_form(name, args) {
	widgetRegistry.form(name, args);
}

/***** Default Widgets *******/
function link_list(data) {
	console.log('Link List Output');
	console.log(data);
}

function link_form(data) {
	console.log('Link List Form Output');
	console.log(data);
}

register_widget('links', 'Link List', 'link_form', 'link_list');


// Scrap (Gut or Junk)
/*
$.each(links, function(i, item) {
	window.list["links"].push(i);
});
*/