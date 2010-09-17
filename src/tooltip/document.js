/**
 * The post load tooltips initialization script
 *
 * Copyright (C) 2009-2010 Nikolay Nemshilov
 */
$(document).on({
  /**
   * Watches all the mouse-over events and reacts if one of the targets
   * matches a tooltip
   *
   * @param Event event
   */
  mouseover: function(event) {
    var prev_tip = Tooltip.current, this_tip = Tooltip.find(event);
    if (this_tip) {
      if (prev_tip && prev_tip !== this_tip) { prev_tip.hide(); }
      if (this_tip.hidden()) { this_tip.show(); }

      this_tip.moveToEvent(event);
    }
  },

  /**
   * Catches the mouseout events and hides tooltips when needed
   *
   * @param Event event
   */
  mouseout: function(event) {
    var curr_tip = Tooltip.current, this_tip = Tooltip.find(event);

    if (curr_tip && (!this_tip || this_tip === curr_tip)) {
      curr_tip.hide();
    }
  },

  /**
   * Moves tooltips when active
   *
   * @param Event event
   */
  mousemove: function(event) {
    var tip = Tooltip.current;
    if (tip && tip.options.move) {
      tip.moveToEvent(event);
    }
  }
});
