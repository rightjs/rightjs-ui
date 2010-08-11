/**
 * The document events hooking
 *
 * Copyright (C) 2009-2010 Nikolay Nemshilov
 */
$(document).on({
  /**
   * Initializes autocompleters on-focus
   *
   * @param Event focus
   * @return void
   */
  focus: function(event) {
    var target = event.target;

    if (target && (target instanceof RightJS.Element) && (target.autocompleter || target.match(Autocompleter.Options.cssRule))) {
      if (!target.autocompleter) {
        new Autocompleter(target);
      }
    }
  },
  
  /**
   * Hides autocompleters on-blur
   *
   * @param Event blur
   * @return void
   */
  blur: function(event) {
    var autocompleter = event.target ? event.target.autocompleter : null;
    
    if (autocompleter && autocompleter.visible()) {
      autocompleter.hide();
    }
  },
  
  /**
   * Catching the basic keyboard events
   * to navigate through the autocompletion list
   *
   * @param Event keydown
   * @return void
   */
  keydown: function(event) {
    var autocompleter = event.target ? event.target.autocompleter : null;
    
    if (autocompleter && autocompleter.visible()) {
      var method_name = ({
        27: 'hide', // Esc
        38: 'prev', // Up
        40: 'next', // Down
        13: 'done'  // Enter
      })[event.keyCode];
      
      if (method_name) {
        event.stop();
        autocompleter[method_name]();
      }
    }
  },
  
  /**
   * Catches the input fields keyup events
   * and tries to make the autocompleter to show some suggestions
   *
   * @param Event keyup
   * @return void
   */
  keyup: function(event) {
    var autocompleter = event.target ? event.target.autocompleter : null;
    
    if (autocompleter && !R([9, 27, 37, 38, 39, 40, 13]).include(event.keyCode)) {
      autocompleter.keypressed(event);
    }
  }
});