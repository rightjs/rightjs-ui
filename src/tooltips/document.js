/**
 * The post load tooltips initialization script
 *
 * Copyright (C) 2009-2011 Nikolay Nemshilov
 */
$(document).on({
  /**
   * Watches all the mouse-over events and reacts if one of the targets
   * matches a tooltip
   *
   * @param Event event
   */
  mouseenter: function(event) {
    var tip = Tooltip.find(event);
    if (tip) {
      tip.show().moveToEvent(event);
    }
  },

  /**
   * Catches the mouseout events and hides tooltips when needed
   *
   * @param Event event
   */
  mouseleave: function(event) {
    var tip = Tooltip.find(event);

    if (tip) {
      tip.hide();
    }
  },

  /**
   * Moves tooltips when active
   *
   * @param Event event
   */
  mousemove: function(event) {
    var tip = Tooltip.current;
    if (tip !== null && tip.options.move) {
      tip.moveToEvent(event);
    }
  }
});
