/**
 * Document level hooks for billboards
 *
 * Copyright (C) 2010 Nikolay Nemshilov
 */
$(document).onReady(function() {
  $$(Billboard.Options.cssRule).each(function(element) {
    if (!(element instanceof Billboard)) {
      element = new Billboard(element);
    }
  });
});