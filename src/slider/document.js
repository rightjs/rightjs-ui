/**
 * Document onReady hook for sliders
 *
 * Copyright (C) 2009-2010 Nikolay Nemshilov
 */
$(document).on({
  // preinitializing the sliders
  ready: function() {
    $$('.rui-slider').each(function(element) {
      if (!(element instanceof Slider)) {
        element = new Slider(element);
      }
    });
  },

  // initiates the slider move
  mousedown: function(event) {
    var slider = event.find('.rui-slider');
    if (slider) {
      event.stop();
      if (!(slider instanceof Slider)) {
        slider = new Slider(slider);
      }
      Slider.current = slider.start(event);
    }
  },

  // handles the slider move
  mousemove: function(event) {
    if (Slider.current) {
      Slider.current.move(event);
    }
  },

  // handles the slider release
  mouseup: function(event) {
    if (Slider.current) {
      Slider.current = false;
    }
  }
});

$(window).onBlur(function() {
  if (Slider.current) {
    Slider.current = false;
  }
});
