/**
 * Document level hooks for the dialogs
 *
 * Copyright (C) 2010-2012 Nikolay Nemshilov
 */
$(document).on({
  keydown: function(event) {
    if (event.keyCode === 27 && Dialog.current) {
      if (Dialog.current.options.closeable) {
        Dialog.current.fire('cancel');
      }
    } else if (event.keyCode === 13 && Dialog.current) {
      if (!(Dialog.current instanceof Dialog.Prompt)) {
        event.stop();
        Dialog.current.fire('ok');
      }
    }
  },

  mousemove: document_mousemove,
  touchmove: document_mousemove,

  mouseup:   document_mouseup,
  touchend:  document_mouseup
});

function document_mousemove(event) {
  if (Dialog.dragged) {
    Dialog.dragged.head.dragMove(event);
  }
}

function document_mouseup(event) {
  if (Dialog.dragged) {
    Dialog.dragged.head.dragStop(event);
  }
}



$(window).onResize(function() {
  if (Dialog.current) {
    Dialog.current.resize();
  }
});