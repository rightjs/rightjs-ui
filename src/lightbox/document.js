/**
 * document level hooks
 *
 * Copyright (C) 2009-2010 Nikolay Nemshilov
 */

$(document).on({
  /**
   * Catches clicks on the target links
   *
   * @param Event click
   * @return void
   */
  click: function(event) {
    var target = event.find(Lightbox.Options.cssRule) || event.find('a[rel^=lightbox]');

    if (target) {
      event.stop();
      new Lightbox({}, target).load(target);
    }
  },

  /**
   * Catches the mousewheel event and tries to scroll
   * the list of objects on the lightbox
   *
   * @param Event mousewheel
   * @return void
   */
  mousewheel: function(event) {
    if (Lightbox.current) {
      event.stop();
      Lightbox.current.fire((event._.detail || -event._.wheelDelta) < 0 ? 'prev' : 'next');
    }
  },

  /**
   * Handles the navigation form a keyboard
   *
   * @param Event keydown
   * @return void
   */
  keydown: function(event) {
    var lightbox = Lightbox.current, name = ({
      27: 'close', // Esc
      33: 'prev',  // PageUp
      37: 'prev',  // Left
      38: 'prev',  // Up
      39: 'next',  // Right
      40: 'next',  // Down
      34: 'next'   // PageDown
    })[event.keyCode];

    if (lightbox && name) {
      if (name !== 'close' || lightbox.options.hideOnEsc) {
        event.stop();
        lightbox.fire(name);
      }
    }
  }
});

$(window).on({
  resize: function() {
    if (Lightbox.current) {
      Lightbox.current.reposition();
      Lightbox.current.dialog.resize();
    }
  },

  scroll: function(event) {
    if (Lightbox.current && Browser.IE6) {
      Lightbox.current.reposition();
    }
  }
});
