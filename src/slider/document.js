/**
 * Document onReady hook for sliders
 *
 * Copyright (C) 2009-2012 Nikolay Nemshilov
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

  mousedown:  document_mousedown,
  touchstart: document_mousedown,

  mousemove:  document_mousemove,
  touchmove:  document_mousemove,

  mouseup:    document_mouseup,
  touchend:   document_mouseup
});

$(window).onBlur(function() {
  if (Slider.current) {
    Slider.current = false;
  }
});

// initiates the slider move
function document_mousedown(event) {
  var slider = event.find('.rui-slider');
  if (slider) {
    event.stop();
    if (!(slider instanceof Slider)) {
      slider = new Slider(slider);
    }
    Slider.current = slider.start(event);
  }
}

// handles the slider move
function document_mousemove(event) {
  if (Slider.current) {
    Slider.current.move(event);
  }
}

// handles the slider release
function document_mouseup(event) {
  if (Slider.current) {
    Slider.current = false;
  }
}