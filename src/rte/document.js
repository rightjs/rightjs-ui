/**
 * Document level hooks for the Rte widget
 *
 * Copyright (C) 2010 Nikolay Nemshilov
 */
$(document).onReady(function() {
  $$(Rte.Options.cssRule).each('getRich');
});