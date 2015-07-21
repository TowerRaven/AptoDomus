/**
 * AptoCarousel Plugin
 *
 * Description: a basic carousel that doesn't demand a huge overhead.
 * Usage: $('#thecarousel').aptocarousel(settings);
 * HTML: <div id="thecarousel" class="carousel"><ul class="slides"><li class="slide></li>...</ul></div>
 * CSS: Style it yourself lazybones, example provided
 *
 * Comment: yeah, I'm gonna remake the wheel, not even that, I'm just remaking
 * the spokes, you'll hafta go make the tire.
 */
window.carousels = {};
(function($) {
  $.fn.aptocarousel = function( args ) {

    var settings = $.extend({
      autospin: true,
      timer: 5, //in seconds
      hiding_class: 'cloaked',
      next_class: 'approaching',
      previous_class: 'retreating' // TODO Implement this for previous button
    });

    //Find the slides
    var target = $(this).prop('id'),
        slides = this.find('.slide'),
        count = slides.length;
        current = 0;

    for(i=0;i<count;i++) {
      if(!i==0)
        $(slides[i]).addClass(settings.hiding_class);
      if(i==1)
        $(slides[i]).removeClass(settings.hiding_class).addClass(settings.next_class);
    }

    if(settings.autospin) {
      window.carousels[target] = setInterval(function() {
      if(current == count-1)
        current = 0;
      else
        current++;

      $(slides[current]).removeClass(settings.next_class);
      if(current+1 == count)
        $(slides[0]).addClass(settings.next_class).removeClass(settings.hiding_class);
      else
        $(slides[current+1]).addClass(settings.next_class).removeClass(settings.hiding_class);

      if(current-1 < 0)
        $(slides[count-1]).addClass(settings.hiding_class);
      else
        $(slides[current-1]).addClass(settings.hiding_class);
      }, (settings.timer*1000));
      console.log('Created interval for carousel "#'+target+'" interval # '+window.carousels[target]+'.');
    }


    $('#'+target+' .previous').on('click', function() {
      clearInterval(window.carousels[target]);
      if(current-1 < 0) {
        $(slides[count-1]).removeClass(settings.hiding_class).removeClass(settings.next_class);
        $(slides[current]).addClass(settings.hiding_class).addClass(settings.next_class);
        $(slides[current+1]).addClass(settings.hiding_class).addClass(settings.next_class);
        current = count-1;
      } else {
        $(slides[current-1]).removeClass(settings.hiding_class).removeClass(settings.next_class);
        $(slides[current]).addClass(settings.hiding_class).addClass(settings.next_class);
        $(slides[current+1]).addClass(settings.hiding_class).addClass(settings.next_class);
        current--;
      }
    });
    $('#'+target+' .next').on('click', function() {
      clearInterval(window.carousels[target]);
      if(current+1 == count) {
        $(slides[0]).removeClass(settings.hiding_class).removeClass(settings.next_class);
        $(slides[current]).addClass(settings.hiding_class).addClass(settings.next_class);
        $(slides[count-1])
        current = 0;
      } else {
        $(slides[current+1]).removeClass(settings.hiding_class).removeClass(settings.next_class);
        $(slides[current]).addClass(settings.hiding_class).addClass(settings.next_class);
        $(slides[current-1]).addClass(settings.hiding_class).addClass(settings.next_class);
        current++;
      }
    });

    return this;
  }
})(jQuery);
