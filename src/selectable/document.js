/**
 * The document on-load for Selectable
 *
 * Copyright (C) 2009-2010 Nikolay Nemshilov
 */
$(document).onReady(function() {
  // converting normal select boxes into selectables
  $$('.rui-selectable').each(function(element) {
    if (!(element instanceof Selectable)) {
      new Selectable(element);
    }
  });
});