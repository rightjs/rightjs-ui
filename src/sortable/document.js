/**
 * Document level hooks for sortables
 *
 * Copyright (C) 2009-2012 Nikolay Nemshilov
 */
$(document).on({
  mousedown:  document_mousedown,
  touchstart: document_mousedown,

  mousemove:  document_mousemove,
  touchmove:  document_mousemove,

  mouseup:    document_mouseup,
  touchend:   document_mouseup
});

$(window).onBlur(function() {
  if (Sortable.current) {
    Sortable.current.finishDrag();
  }
});


function document_mousedown(event) {
  var element = event.find(Sortable.Options.cssRule+",*.rui-sortable");

  if (element) {
    Sortable.cast(element).startDrag(event);
  }
}

function document_mousemove(event) {
  if (Sortable.current) {
    event.preventDefault();  // preventing fancy scrolls on iStuff
    Sortable.current.moveItem(event);
  }
}

function document_mouseup(event) {
  if (Sortable.current) {
    Sortable.current.finishDrag(event);
  }
}