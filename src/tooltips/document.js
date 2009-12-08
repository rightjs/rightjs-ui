/**
 * The post load tooltips initialization script
 *
 * Copyright (C) 2009 Nikolay V. Nemshilov aka St.
 */
document.on({
  ready: function() { Tooltip.rescan(); },
  
  mousemove: function(event) {
    if (Tooltip.current) {
      Tooltip.current.moveTo(event);
    }
  }
});