/** 
 * BBC Widgets
 * Includes
 *  - bbcnews
 *  - bbcweather *
 *
 *    * = WIP, Not Implemented
 */

// RSS Feeds
widgetRegistry.register(
	'bbcnews',
	'BBC News Feed',
	function( args ) {return rss_bbcn( args );},
	function( args ) {return rss_bbcn_script( args );},
	{
		"style": "scroll",
		"kind": "uk" //Available: uk, world, us_can
	}
);
	function rss_bbcn( args ) {

		var target = widget_id_string( args[0], 'id' );

		if(args[1]["kind"] == undefined)
			args[1]["kind"] = "uk";

		$(target).html(
			'<h2>BBC News'+
			widget_edit_controls( args[0], false, 'right' )+
			'</h2>'+

			'<div class="newscarousel"></div>'+

			'<div class="edit-element bbcnews-edit-controls">'+
				'<select name="bbcn-region" class="bbcn-region"></select>'+
				'<input type="button" class="bbcn-update" value="Change"></input>'+
			'</div>'
		);

		// Retrieve the news feed here
		read_feed("bbcnews", {"target": target, "kind": args[1]["kind"]});

		return true;
	}
	function rss_bbcn_script( args ) {
		var target = widget_id_string( args[0], 'id' ),
			regions = {
				"uk": "United Kingdom",
				"world": "World",
				"us_can": "US & Canada"
			};

			if(args[1]["type"] == undefined)
				args[1]["type"] = "uk";

			$.each(regions, function(i, val) {
				$(target+' .bbcn-region').append('<option value="'+i+'">'+val+'</option>');
			});

			// Update selected with default/chosen
			$(target+' select.bbcn-region').val(args[1]["type"]);

			// Bind update button
			$(target+' .bbcn-update').on('click', function() {
				// Get selected option
				var selected = $(target+' .bbcn-region option:selected').prop('value');

				// Update localData widgets
				window.list["columns"][args[0]]["data"]["kind"] = selected;

				// Clear current carousel
				$(target+' .newscarousel').html("");

				read_feed("bbcnews", {"target": target, "kind": selected});

				enable_save();
			});
		return true;
	}

// Weather
widgetRegistry.register(
	'bbcweather',
	'BBC Weather',
	function(args) {return weather_bbc(args);},
	function(args) {return weather_bbc_script(args);},
	{
		"location": "2643743",
		"kind": "3day"
	}
);
	function weather_bbc( args ) {
		var target = widget_id_string( args[0], 'id' );

		$(target).html(
			'<h2>BBC Weather'+
				widget_edit_controls( args[0], false, 'right' )+
			'</h2>'+

			'<div class="weather"></div>'+
			'<div class="edit-element">'+
			'<select name="weatherkind">'+
				'<option value="3day">3 Day Summary</option>'+
				'<option value="observations">Today\'s Observations</option>'+
			'</select>'+
			'<input type="text" placeholder="Location ID" name="location" />'+
			'<button type="button" class="submitupdate">Update</button>'+
			'</div>'
		);
		return true;
	}
	function weather_bbc_script( args ) {
		var target = widget_id_string( args[0],'id' );
		read_feed("bbcweather", {"target": target, "type": "weather", "kind": args[1]["kind"], "location": args[1]["location"]});

		$(target+' input[name=location]').val(args[1]["location"]);

		$(target+' .submitupdate').on('click', function() {
			var kind = $(target+' select[name=weatherkind] option:selected').prop('value');
			var location = $(target+' input[name=location]').val();

			console.log('kind: '+kind);
			console.log('location: '+location);

			if(location != args[1]["location"] || kind != args[1]["kind"]) {
				locStr = location.toString();
				if(locStr.length != 7) {
					alert('Location is incorrect, must be 7 digits. See documentation for more information.');
				} else {
					read_feed("bbcweather", {"target": target, "type": "weather", "kind": kind, "location": location});

					//Update widget settings
					if(location != args[1]["location"])
						window.list["columns"][args[0]]["data"]["location"] = location;

					if(kind != args[1]["kind"])
						window.list["columns"][args[0]]["data"]["kind"] = kind;

					enable_save();
				}
			}


		});
		return true;
	}
