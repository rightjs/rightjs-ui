/**
 * Document level hooks for resizables
 *
 * Copyright (C) 2010 Nikolay Nemshilov
 */
document.on({
  mousedown: function(event) {
    var resizable = Resizable.findBy(event);
    if (resizable) {
      event.stop();
      Resizable.current = resizable.start(event);
    }
  },
  
  mousemove: function(event) {
    var resizable = Resizable.current;
    if (resizable) {
      event.stop();
      resizable.track(event);
    }
  },
  
  mouseup: function(event) {
    var resizable = Resizable.current;
    if (resizable) {
      resizable.release(event);
    }
  }
});

window.on('blur', function(event) {
  var resizable = Resizable.current;
  if (resizable) {
    resizable.release(event);
  }
});