/**
 * Functions that rely on a server backend.
 */


/** 
 * Reads various xml feeds, could probably be improved
 *	Depends upon aptocarousel.js
 */
function read_feed(type, args) {	
	switch(type) {
		case "bbcnews":
			var newsgroup = -1;
			$.ajax({
				cache: false,
				url: "xml/processor.php?source=bbc&type=news&kind="+args["kind"],
				dataType: "json",
				context: args["target"],
				success: function(data) {
					var started = false,
						carouselData = new Array();

					// Compile carouselData from BBC News XML data
					$.each(data["item"], function(i, item) {
						if(i % 3 == 0) { //Every 3 items?
							if(started == true)
								carouselData[newsgroup]["content"] += '</ul>';

							started = true;

							newsgroup++;

							carouselData[newsgroup] = {};

							carouselData[newsgroup].content = '<ul class="group-'+newsgroup+' slide"><div class="content">';
						}
						carouselData[newsgroup]["content"] += '<li><h2><a href="'+item["guid"]+'">'+item["title"]+'</a></h2><p>'+item["description"]+'</p>';

						if(i == data.length)
							carouselData[newsgroup]["content"] += '</div></ul>';
					});

					//Generate & output news feed markup

					$(args["target"]).addClass('aptocarousel');

					$(args["target"]+' .newscarousel').append('<div class="slides"></div>');

					$.each(carouselData, function(index, value) {
						$(args["target"]+' .slides').append(value.content);
					});

					$(args["target"]+' .newscarousel').append('<div class="aptocarousel-controls"></div>');
					$(args["target"]+' .aptocarousel-controls').append('<button type="button" class="previous">Previous</button>');
					$(args["target"]+' .aptocarousel-controls').append('<button type="button" class="next">Next</button>');

					$(args["target"]).aptocarousel();

					$(args["target"]+' .previous_button').html('<img src="icons/chevron-left.svg" alt="Previous" />');
					$(args["target"]+' .next_button').html('<img src="icons/chevron-right.svg" alt="Next" />');

				},
				error: function( jqXHR, textStatus, errorThrown) {
					console.log(textStatus+' - '+errorThrown);
					return false;
				}
			});
			break;
			
		case "bbcweather":
			var kind = args["kind"],
				result;
			
			$.ajax({
				cache: false,
				url: "xml/processor.php?source=bbc&type=weather&kind="+args["kind"]+"&location="+args["location"],
				dataType: "json",
				context: args["target"],
				success: function(data, textStatus) {
					$(args["target"]+' .weather').html('');
					
					var location_pattern = /^BBC Weather - Forecast for ([a-zA-Z, ]*)/i;
					var location = location_pattern.exec(data["title"]);

					$(args["target"]+' .weather').append('<h3>For '+location[1]+'</h3>');
					
					switch(args["kind"]) {
						case "3day":
							$.each(data["item"], function(i, item) {
								result = parseWeather(item);
								$(args["target"]+' .weather').append('<ul class="item-'+i+' weather-item"></ul>');
								$(args["target"]+' .weather .item-'+i).append(
									'<li><span class="day">'+result["title"]["day"]+'</span> &#150; <span>'+result["title"]["cloud"]+'</span></li>'+
									'<li class="temp">Min. '+result["description"]["Minimum Temperature"]+'</li>'
								);
								if(result["description"]["Maximum Temperature"] != undefined)
									$(args["target"]+' .weather .item-'+i).append(
										'<li class="temp">Max. '+result["description"]["Maximum Temperature"]+'</li>'
									);
							});
							break;
						case "observations":
							//TODO Uses different layout, parseWeather won't work without modification
							result = parseWeather(data["item"]);
							$(args["target"]+' .weather').append('<ul class="item-'+i+' weather-item"></ul>');
							$(args["target"]+' .weather .item-'+i).append(
								'<li><span class="day">'+result["title"]["day"]+'</span> &#150; <span class="skies">'+result["title"]["cloud"]+'</span></li>'+
								'<li class="temp">Min. '+result["description"]["Minimum Temperature"]+'</li>'+
								'<li class="temp">Max. '+result["description"]["Maximum Temperature"]+'</li>'						
							);
							break;
					}
				},
				error: function( jqXHR, textStatus, errorThrown) {
					console.log(textStatus+' - '+errorThrown);
					return false;
				}
			});
			break;
	}
}

function parseWeather(data) {
	var title_pattern = /((mon|tues|wednes|thurs|fri|satur|sun)day): ([a-z\W]*), [a-z0-9\W:]*$/i;
	var desc_pattern = /^([a-z\s]*): ([a-z0-9:°\(\)% ]*)$/i;
	var result;
	var fini = {"title": {}, "description": {}};
	
	result = title_pattern.exec(data["title"]); //[0] = data, [1] = full day, [2] = part-day (mon/tues/wednes/etc), [3] = cloud
	
	fini["title"]["day"] = result[1];
	fini["title"]["cloud"] = result[3];
	
	result = data["description"].split(', ');
	
	$.each(result, function(i, item) {
		item_result = desc_pattern.exec(item);
		fini["description"][item_result[1]] = item_result[2];
	});
	
	return fini;
}
