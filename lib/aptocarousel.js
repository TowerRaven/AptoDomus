/**
 * AptoCarousel Plugin
 *
 * Description: a basic carousel that doesn't demand a huge overhead.
 * Usage: $('#thecarousel').aptocarousel(args);
 * Arguments:
 *     autospin: true/false,
 *     timer: (number in seconds),
 *     hiding_class: 'cloaked' (string),
 *     next_class: 'approaching' (string),
 *     previous_class: 'retreating' (string),
 *     controls: 'all' ('all', 'toandfro', 'numbers'),
 *     current_class: 'current' (string)
 * HTML: <div id="thecarousel" class="carousel"><ul class="slides"><li class="slide></li>...</ul></div>
 * CSS: Style it yourself lazybones, example provided
 *
 * Comment: yeah, I'm gonna remake the wheel, not even that, I'm just remaking
 * the spokes, you'll hafta go make the tire.
 */
window.aptocarousels = {};
(function($) {
  $.fn.aptocarousel = function( args ) {

    if(args == undefined)
      var args = {};

    var settings = $.extend({
      // Determines if the carousel spins automatically, true or false
      autospin: (args.autospin == undefined) ? true : args.autospin,

      // How link it takes between changes, in seconds
      timer: (args.timer == undefined) ? 5 : args.timer,

      // The class used for disappearing slides
      hiding_class: (args.hiding_class == undefined) ? 'cloaked' : args.hiding_class,

      // The class used for upcoming slides
      next_class: (args.next_class == undefined) ? 'approaching' : args.next_class,

      // Class used for reverse animation TODO Implement
      previous_class: (args.previous_class == undefined) ? 'retreating' : args.previous_class,

      // Type of controls on display, 'all', 'toandfro', and 'numbers'
      controls: (args.controls == undefined) ? 'all' : args.controls,

      // Current slide button class
      current_class: (args.current == undefined) ? 'current' : args.current
    });


    //Find the slides
    var target = $(this).prop('id'),
        slides = this.find('.slide'),
        count = slides.length;
        current = 0;

    //TODO what if there are no slides?

    //Add classes to slides
    for(i=0;i<count;i++) {
      if(!i==0)
        $(slides[i]).addClass(settings.hiding_class);
      if(i==1)
        $(slides[i]).removeClass(settings.hiding_class).addClass(settings.next_class);
      if(i==0 && (settings.controls == 'all' || settings.controls == 'numbers'))
        $('#'+target+' .button-slide-'+i).addClass(settings.current_class);
    }

    if(settings.autospin) {
      //Create interval and begin rotation of classes
      window.aptocarousels[target] = setInterval(function() {

      $('#'+target+' .button-slide-'+current).removeClass(settings.current_class);

      if(current == count-1)
        current = 0;
      else
        current++;

      $('#'+target+' .button-slide-'+current).addClass(settings.current_class);

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
      console.log('Created interval for carousel "#'+target+'" interval # '+window.aptocarousels[target]+'.');
    }

    if(settings.controls == 'all' || settings.controls == 'numbers') {
      $('#'+target+' .aptocarousel-controls .previous').after('<ol class="aptocarousel-pagination"></ol>');

      for(i=0; i < count; i++) {
        $('#'+target+' .aptocarousel-pagination').append('<li><button type="button" class="pagination button-slide-'+i+'" data-aptocarousel-targetslide="'+i+'" class="pagination">'+(i+1)+'</button></li>');
      }


      // Bind pagination buttons
      $('#'+target+' .pagination').on('click', function() {
        clearInterval(window.aptocarousels[target]);
        var targetslide = $(this).attr('data-aptocarousel-targetslide');

        $(slides[current]).addClass(settings.next_class).addClass(settings.hiding_class);

        $(slides[targetslide]).removeClass(settings.next_class).removeClass(settings.hiding_class);

        $('#'+target+' .button-slide-'+current).removeClass(settings.current_class);

        current = targetslide;

        $('#'+target+' .button-slide-'+current).addClass(settings.current_class);
      });
    }

    if(settings.controls == 'all' || settings.controls == 'toandfro') {
      //Bind previous/next buttons
      $('#'+target+' .previous').on('click', function() {
        clearInterval(window.aptocarousels[target]);

        if(current-1 < 0) {
          $(slides[count-1]).removeClass(settings.hiding_class).removeClass(settings.next_class);
          $(slides[current]).addClass(settings.hiding_class).addClass(settings.next_class);
          $(slides[current+1]).addClass(settings.hiding_class).addClass(settings.next_class);

          if(settings.controls == 'all' || settings.controls == 'numbers') {
            $('#'+target+' .button-slide-'+(count-1)).addClass(settings.current_class);
            $('#'+target+' .button-slide-'+current).removeClass(settings.current_class);
          }

          current = count-1;

        } else {
          $(slides[current-1]).removeClass(settings.hiding_class).removeClass(settings.next_class);
          $(slides[current]).addClass(settings.hiding_class).addClass(settings.next_class);
          $(slides[current+1]).addClass(settings.hiding_class).addClass(settings.next_class);

          if(settings.controls == 'all' || settings.controls == 'numbers') {
            $('#'+target+' .button-slide-'+(current-1)).addClass(settings.current_class);
            $('#'+target+' .button-slide-'+current).removeClass(settings.current_class);
          }

          current--;
        }
      });

      $('#'+target+' .next').on('click', function() {
        clearInterval(window.aptocarousels[target]);

        if(current+1 == count) {
          $(slides[0]).removeClass(settings.hiding_class).removeClass(settings.next_class);
          $(slides[current]).addClass(settings.hiding_class).addClass(settings.next_class);
          $(slides[count-1])

          if(settings.controls == 'all' || settings.controls == 'numbers') {
            $('#'+target+' .button-slide-0').addClass(settings.current_class);
            $('#'+target+' .button-slide-'+current).removeClass(settings.current_class);
          }

          current = 0;

        } else {
          $(slides[current+1]).removeClass(settings.hiding_class).removeClass(settings.next_class);
          $(slides[current]).addClass(settings.hiding_class).addClass(settings.next_class);
          $(slides[current-1]).addClass(settings.hiding_class).addClass(settings.next_class);

          if(settings.controls == 'all' || settings.controls == 'numbers') {
            $('#'+target+' .button-slide-'+(current+1)).addClass(settings.current_class);
            $('#'+target+' .button-slide-'+current).removeClass(settings.current_class);
          }

          current++;
        }
      });
    }

    return this;
  }
})(jQuery);
