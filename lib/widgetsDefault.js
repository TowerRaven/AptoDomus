/**
 * AptoDomus Non-Server Default Widgets
 * Contains:
 * 	- empty
 *  - search
 *  - links
 *  - timer *
 *  - intro
 *  - checklist *
 *  - clock
 * 
 *   * = WIP, Not implemented
 */

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
		return true;
	}
	function empty_widget_script( args ) {
		return true;
	}


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

		var provider_data = {
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
		if(args[1] != "google") {
			saction = provider_data[args[1]]['url'];
			queryname = provider_data[args[1]]['queryname'];
		}
		$(target).append(
			widget_edit_controls( args[0], true, 'right' )+
			'<form id="searchform" method="get" action="'+saction+'">'+
				'<span>'+
					'<img src="icons/searchproviders/'+args[1]+'.png" class="searchprovicon">'+
					'<button type="button" class="providerpick edit-element" style="display: none;">&#133; pick another</button>'+
				'</span>'+
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
				item["name"]+'</a> <button type="button" class="submitremoval edit-element" title="Remove Item" style="display: none;"><img src="icons/circle-x.svg" alt="Remove Item"/></button></li>'
			);
		});

		$(target+' ul').append(
			'<li class="edit-element" style="display: none;"><input type="text" name="url" placeholder="URL (http://www.example.com/)" /><input type="text" name="name" placeholder="Name (Example Site)" /><button type="button" class="submitadd" title="Add Item"><span class="img-helper"><img src="icons/plus.svg" /></span> Add Item</button></li>'
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
				var regx = new RegExp('item-([0-9]*)', 'g'),
					result = regx.exec( $(this).parent().prop('class') ),
					target_item = parseInt(result[1]);

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
			var regx = new RegExp('item-([0-9]*)', 'g'),
				result = regx.exec( $(this).parent().prop('class') ),
				target_item = parseInt(result[1]),
				target_col = get_col_idnum( $(this).closest('.col').prop('id') );

			console.log(target_item);
			// Remove from data
			window.list["columns"][target_col]["data"].splice(target_item, 1);

			// Remove the item from the list
			$(this).parent().remove();

			enable_save();
		});
	}




/*
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
*/

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
		$(target).append( widget_edit_controls( args[0], false, 'right' ) );
		$(target).append( '<h3>Welcome</h3>' );
		$(target).append( '<p>I\'m your new Homepage! Check out the <a href="docs">documentation</a> to find out how to use me. And the <a href="about.html">About Page</a> for a summary and future features.</p>' );
		$(target).append( '<h2>Alpha!</h2>' );
		$(target).append( '<p>I\'m a growing app, my features are incomplete and things may change, hit the "Reset Local Storage" if things appear to be broken&#133; I\'ve probably updated the way things are stored!</p>' );
		return true;
	}
	function infopanel_script( args ) {
		return true;
	}

/*



widgetRegistry.register(
	'checklist',
	'Checklist',
	function(args) {return checklist(args);},
	function(args) {return checklist_script(args); },
	[
		{"text": "Example checklist item", "checked": true},
		{"text": "Another checklist item", "checked": false}
	]
);
	function checklist(args) {
		var target = widget_id_string( args[0], 'id' );

		$(target).html(
			widget_edit_controls( args[0], true, 'right' )+
			'<ul></ul>'
		);

		$.each(args[1], function(i, item) {
			$(target+'> ul').append(
				'<li>'+item["text"]+' <input type="checkbox" name="'+i+'" /></li>'
			);

			if(item["checked"] == true){
				$(target+' input[name='+i+']').attr('checked', 'checked');
			}
		});




		return true;
	}
	function checklist_script(args) {
		console.log('Checklist script');

		console.log(args);
		return true;
	}
*/


widgetRegistry.register(
	'clock',
	'Clock',
	function(args) { return clock(args); },
	function(args) { return clock_script(args); },
	null
);
	function clock(args) {
		var target = widget_id_string( args[0], 'id' ),
			timezone = '';

		if(args['timezone'] == undefined)
			timezone = 'UTC+0';
		else
			timezone = args['timezone'];

		$(target).html(
			widget_edit_controls( args[0], true, 'right' )
		);

		$(target).append('<div class="clock-inner" timezone="'+timezone+'">'+
			'<div class="clock-date"></div>'+
			'<div class="clock-time"></div>'+
		'</div>');

		return true;
	}
	function clock_script(args) {
		var currentTime = new Date(),
			id = '#col-'+args[0],
			UTC_Range = [-11, +13],
			loop_count = UTC_Range[0],
			UTC_String = 'UTC';


		//TODO What is this achieving? List for control?
		while(loop_count < UTC_Range[1]) {
			if(loop_count > -1)
				UTC_String = 'UTC+';
			else
				UTC_String = 'UTC'; // Precaution

			//console.log(UTC_String+loop_count);

			loop_count++;
		}

		// TODO Create clock cycle
		setInterval(updateClockWidget, 1000, id, UTC_String);

		return true;
	}

function updateClockDate(target, timezone) {
	var now = new Date(),
		months = ['January', 'Febuary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
		date = now.getDate(),
		find = [/^([1-9]?[0|3-9]|11|12)$/, /^([2-9]?[1])$/, /^([2-9]?[2])$/],
		replace = ['$1th', '$1st', '$1nd'],
		date;

	date = now.getDate();
	date = date.toString();

	for(i=0; i < find.length; i++) {
		date = date.replace(find[i], replace[i]);
	}

	date += ' '+months[now.getMonth()]+' '+now.getFullYear();

	jQuery(target+' .clock-inner .clock-date').html(date);
}

function updateClockWidget(target, timezone) {
	var now = new Date(),
		h = ('0' + now.getHours()).slice(-2),
		m = ('0' + now.getMinutes()).slice(-2),
		s = ('0' + now.getSeconds()).slice(-2),
		time;

	time = h + ':' + m + ':' + s;

	jQuery(target+' .clock-inner .clock-time').html(time);
	updateClockDate(target, timezone);
};
