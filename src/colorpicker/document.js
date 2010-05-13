/**
 * The document level hooks for colorpicker
 *
 * Copyright (C) 2010 Nikolay Nemshilov
 */
document.on({
  mouseup: function() {
    if (Colorpicker.tracking) {
      Colorpicker.tracking.stopTrack();
    }
  },
  
  mousemove: function(event) {
    if (Colorpicker.tracking) {
      Colorpicker.tracking.trackMove(event);
    }
  },
  
  mousedown: function(event) {
    var picker = Colorpicker.current, target = event.target;
    
    if (picker && target != picker.target && ![target].concat(target.parents()).include(picker.element)) {
      picker.hide();
    }
  }
});

window.on('blur', function() {
  if (Colorpicker.tracking) {
    Colorpicker.tracking.stopTrack();
  }
});

// colorpickers autodiscovery feature
Colorpicker.Options.cssRule.on({
  focus: function(event) {
    if (this.tagName == 'INPUT') {
      Colorpicker.find(this).show(this);
    }
  },
  
  click: function(event) {
    var attr = Colorpicker.Options.cssRule.split('[').last().split('^=').first(),
        match = /\[(.+?)\]/.exec(this.get(attr)), input;

    if (match && (input = $(match[1]))) {
      event.stop();
      
      Colorpicker.find(this).show(input);
    }
  }
});
