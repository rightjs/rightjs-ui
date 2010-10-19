/**
 * Document level hooks for the dialogs
 *
 * Copyright (C) 2010 Nikolay Nemshilov
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

  mousemove: function(event) {
    if (Dialog.dragged) {
      Dialog.dragged.head.dragMove(event);
    }
  },

  mouseup: function(event) {
    if (Dialog.dragged) {
      Dialog.dragged.head.dragStop(event);
    }
  }
});

$(window).onResize(function() {
  if (Dialog.current) {
    Dialog.current.resize();
  }
});