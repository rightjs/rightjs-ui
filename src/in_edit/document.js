/**
 * The document hooks for in-edit form
 *
 * Copyright (C) 2010 Nikolay Nemshilov
 */
$(document).onKeydown(function(event) {
  // processing the `ESC` button
  if (event.keyCode === 27 && InEdit.current) {
    InEdit.current.hide();
  }
});