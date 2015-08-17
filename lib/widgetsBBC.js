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
/*
// Weather
widgetRegistry.register(
	'bbcweather',
	'BBC Weather',
	function(args) {return weather(args);},
	function(args) {return weather_script(args);},
	{
		"location": "2643743",
		"type": "3day",
		"unit": "f"
	}
);
	function weather( args ) {
		var target = widget_id_string( args[0], 'id' );

		$(target).html(
			widget_edit_controls( args[0], true, 'right' )+
			'<span class="current"></span><span class="forecast"></span>'+
			'<div class="edit-element"><select name="weather-unit">'+
				'<option val="c">Celsius</option>'+
				'<option val="f">Fahrenheit</option>'+
			'</select>'+
			'<input type="text" placeholder="Location ID" name="location" />'+
			'<button type="button" class="submitupdate">Update</button>'+
			'</div>'
		);
		return true;
	}
	function weather_script( args ) {
		console.log('weather_script');
		console.log( args[0] );
		this.target = widget_id_string( args[0],'id' );

		//TODO Find a more reliable method of determining targets
		var that = this;

		// TODO Change to args based location, note, retrieved from weather.com
		var location = "33591";
		var unit = "c";

		$.ajax({
			url: "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%3D%22"+location+"%22%20AND%20u%3D%22"+unit+"%22&format=json&diagnostics=true&callback=",
			dataType: "json",
			context: that.target,
			success: function(data) {
				weather_callback( data, this);
	      	}
		});
		return true;
	}
	function weather_callback( data, target ) {
		console.log('Weather callback');
		console.log(data);
		window.testweather = data;
		//console.log(data["query"]["results"]["channel"]["item"]["description"]);
		var result = data["query"]["results"]["channel"];
		console.log(result);
		$(target+' span.current').append(
			result["location"]["city"]+', '+result["location"]["country"]+'<br />'+
			result["item"]["condition"]["text"]+'<br />'+
			result["item"]["condition"]["temp"]+' '+result["units"]["temperature"]
		);
	}
	*/