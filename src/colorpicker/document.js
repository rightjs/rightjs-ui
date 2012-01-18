/**
 * The document level hooks for colorpicker
 *
 * Copyright (C) 2010-2012 Nikolay Nemshilov
 */

function document_mouseup() {
  if (Colorpicker.tracking) {
    Colorpicker.tracking.stopTrack();
  }
}

function document_mousemove(event) {
  if (Colorpicker.tracking) {
    Colorpicker.tracking.trackMove(event);
  }
}

$(document).on({
  mouseup:  document_mouseup,
  touchend: document_mouseup,

  mousemove: document_mousemove,
  touchmove: document_mousemove,

  focus: function(event) {
    var target = event.target instanceof Input ? event.target : null;

    Colorpicker.hideAll();

    if (target && (target.colorpicker || target.match(Colorpicker.Options.cssRule))) {

      (target.colorpicker || new Colorpicker({update: target}))
        .setValue(target.value()).showAt(target);
    }
  },

  blur: function(event) {
    var target = event.target, colorpicker = target.colorpicker;

    if (colorpicker) {
      // we use the delay so it didn't get hidden when the user clicks the calendar itself
      colorpicker._hide_delay = R(function() {
        colorpicker.hide();
      }).delay(200);
    }
  },

  click: function(event) {
    var target = (event.target instanceof Element) ? event.target : null;

    if (target && (target.colorpicker || target.match(Colorpicker.Options.cssRule))) {
      if (!(target instanceof Input)) {
        event.stop();
        (target.colorpicker || new Colorpicker({trigger: target}))
          .hide(null).toggleAt(target.assignedInput);
      }
    } else if (!event.find('div.rui-colorpicker')){
      Colorpicker.hideAll();
    }
  },

  keydown: function(event) {
    var colorpicker = Colorpicker.current, name = ({
      27: 'hide',        // Escape
      13: 'done'         // Enter
    })[event.keyCode];

    if (name && colorpicker && colorpicker.visible()) {
      event.stop();
      colorpicker[name]();
    }
  }
});
