/**
 * Document - on-load hook
 *
 * Copyright (C) 2011 Nikolay Nemshilov
 */
$(document).on({
  /**
   * Triggers autoinitialization when the document is loaded
   *
   * @return void
   */
  ready: function() {
    Tags.rescan();
  },

  /**
   * Handles the suggestions list navigation
   *
   * @param {Event} event
   * @return void
   */
  keydown: function(event) {
    var list = Tags.Completer.current,
        keys = {
          13: 'done', // Enter
          27: 'hide', // Escape
          38: 'prev', // Up
          40: 'next'  // Down
        };

    if (list !== null && event.keyCode in keys) {
      event.stop();
      list[keys[event.keyCode]]();
    }
  },

  /**
   * Hides the completer menu by an outer click
   *
   * @param {Event} click
   * @return void
   */
  click: function(event) {
    if (Tags.Completer.current) {
      Tags.Completer.current.hide();
    }
  }

});