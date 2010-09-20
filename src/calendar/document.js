/**
 * Document level event listeners for navigation and lazy initialization
 *
 * Copyright (C) 2009-2010 Nikolay Nemshilov
 */
$(document).on({
  /**
   * Watches the focus events and dispalys the calendar
   * popups when there is a related input element
   *
   * @param Event focus-event
   * @return void
   */
  focus: function(event) {
    var target = event.target instanceof Input && event.target.get('type') == 'text' ? event.target : null;

    Calendar.hideAll();

    if (target && (target.calendar || target.match(Calendar.Options.cssRule))) {
      (target.calendar || new Calendar({update: target}))
        .setValue(target.value()).showAt(target);
    }
  },

  /**
   * Watches the input elements blur events
   * and hides shown popups
   *
   * @param Event blur-event
   * @return void
   */
  blur: function(event) {
    var target = event.target, calendar = target.calendar;

    if (calendar) {
      // we use the delay so it didn't get hidden when the user clicks the calendar itself
      calendar._hide_delay = R(function() {
        calendar.hide();
      }).delay(200);
    }
  },

  /**
   * Catches clicks on trigger elements
   *
   * @param Event click
   * @return void
   */
  click: function(event) {
    var target = (event.target instanceof Element) ? event.target : null;

    if (target && (target.calendar || target.match(Calendar.Options.cssRule))) {
      if (!(target instanceof Input) || target.get('type') != 'text') {
        event.stop();
        (target.calendar || new Calendar({trigger: target}))
          .hide(null).toggleAt(target.assignedInput);
      }
    } else if (!event.find('div.rui-calendar')){
      Calendar.hideAll();
    }
  },

  /**
   * Catching the key-downs to navigate in the currently
   * opened Calendar hover
   *
   * @param Event event
   * @return void
   */
  keydown: function(event) {
    var calendar = Calendar.current, name = ({
      27: 'hide',        // Escape
      37: 'prev-day',    // Left  Arrow
      39: 'next-day',    // Right Arrow
      38: 'prev-week',   // Up Arrow
      40: 'next-week',   // Down Arrow
      33: 'prev-month',  // Page Up
      34: 'next-month',  // Page Down
      13: 'done'         // Enter
    })[event.keyCode];

    if (name && calendar && calendar.visible()) {
      event.stop();
      if (isFunction(calendar[name])) {
        calendar[name]();
      } else {
        calendar.fire(name);
      }
    }
  }
});
