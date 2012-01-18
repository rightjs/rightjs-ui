/**
 * Document level hooks for resizables
 *
 * Copyright (C) 2010-2012 Nikolay Nemshilov
 */
$(document).on({
  mousedown:  document_mousedown,
  touchstart: document_mousedown,

  mousemove:  document_mousemove,
  touchmove:  document_mousemove,

  mouseup:    document_mouseup,
  touchend:   document_mouseup
});

$(window).onBlur(function(event) {
  var resizable = Resizable.current;
  if (resizable) {
    resizable.release(event);
    Resizable.current = null;
  }
});

function document_mousedown(event) {
  var handle = event.find('.rui-resizable-handle');
  if (handle) {
    var resizable = handle.parent();

    if (!(resizable instanceof Resizable)) {
      resizable = new Resizable(resizable);
    }

    Resizable.current = resizable.start(event.stop());
  }
}

function document_mousemove(event) {
  var resizable = Resizable.current;
  if (resizable) {
    resizable.track(event);
  }
}

function document_mouseup(event) {
  var resizable = Resizable.current;

  if (resizable) {
    resizable.release(event);
    Resizable.current = null;
  }
}


