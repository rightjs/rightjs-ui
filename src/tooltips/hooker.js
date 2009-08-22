/**
 * The post load tooltips initialization script
 *
 * Copyright (C) 2009 Nikolay V. Nemshilov aka St.
 */
document.onReady(function() {
  $$(Tooltip.Options.tags+'[rel=tooltip]').each(function(element) {
    var text = element.get('title') || element.get('alt');
    if (text) {
      new Tooltip(element);
    }
  });
  
  document.onMousemove(function(e) {
    if (Tooltip.current) {
      Tooltip.current.moveTo(e);
    }
  })
});