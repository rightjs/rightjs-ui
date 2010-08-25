/**
 * Document level hooks for resizables
 *
 * Copyright (C) 2010 Nikolay Nemshilov
 */
$(document).on({
  mousedown: function(event) {
    var handle = event.find('.rui-resizable-handle');
    if (handle) {
      var resizable = handle.parent();
      
      if (resizable instanceof Element) {
        resizable = new Resizable(resizable);
      }
      
      Resizable.current = resizable.start(event.stop());
    }
  },
  
  mousemove: function(event) {
    var resizable = Resizable.current;
    if (resizable) {
      resizable.track(event);
    }
  },
  
  mouseup: function(event) {
    var resizable = Resizable.current;
    
    if (resizable) {
      resizable.release(event);
      Resizable.current = null;
    }
  }
});

$(window).onBlur(function(event) {
  var resizable = Resizable.current;
  if (resizable) {
    resizable.release(event);
    Resizable.current = null;
  }
});