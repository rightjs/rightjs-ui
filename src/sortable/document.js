/**
 * Document level hooks for sortables
 *
 * Copyright (C) 2009-2010 Nikolay Nemshilov
 */
$(document).on({
  mousedown: function(event) {
    var element = event.find(Sortable.Options.cssRule+",*.rui-sortable");

    if (element) {
      Sortable.cast(element).startDrag(event);
    }
  },

  mousemove: function(event) {
    if (Sortable.current) {
      Sortable.current.moveItem(event);
    }
  },

  mouseup: function(event) {
    if (Sortable.current) {
      Sortable.current.finishDrag(event);
    }
  }
});

$(window).onBlur(function() {
  if (Sortable.current) {
    Sortable.current.finishDrag();
  }
});
