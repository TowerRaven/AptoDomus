/**
 * Functions that rely on a server backend.
 */


/** 
 * Reads various xml feeds, could probably be improved
 *	Depends upon aptocarousel.js
 */
function read_feed(type, args) {
	this.target = args.target;
	var that = this;

	switch(type) {
		case "bbcnews":
			var newsgroup = -1;
			$.ajax({
				cache: false,
				url: "lib/rss_bbc.php?&type=news",
				dataType: "json",
				context: args["target"],
				success: function(data) {
					var started = false,
						carouselData = new Array();

					// Compile carouselData from BBC News XML data
					$.each(data, function(i, item) {
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

			break;
	}
}