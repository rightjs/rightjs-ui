/**
 * A shared module that toggles a widget visibility status
 * in a uniformed way according to the options settings
 *
 * Copyright (C) 2010 Nikolay Nemshilov
 */

// the common functionality
function toggler(element, event, fx_name, fx_options) {
  if ((event == 'show' && element.hidden()) || (event == 'hide' && element.visible())) {
    if (fx_name === undefined) {
      fx_name = this.options.fxName;
    }
    if (fx_options === undefined) {
      fx_options = {
        duration: this.options.fxDuration,
        onFinish: RightJS(this.fire).bind(this, event)
      };
    }
    
    RightJS.Element.prototype[event].call(element, fx_name, fx_options);
    
    // manually trigger the event if no fx were specified
    if (!fx_name) { this.fire(event); }
  }
  
  return this;
}

// the shared module
var Toggler = {
  /**
   * Shows the element
   *
   * @param String fx-name
   * @param Object fx-options
   * @return Element this
   */
  show: function(fx_name, fx_options) {
    return toggler.call(this, this, 'show', fx_name, fx_options);
  },
  
  /**
   * Hides the element
   *
   * @param String fx-name
   * @param Object fx-options
   * @return Element this
   */
  hide: function(fx_name, fx_options) {
    return toggler.call(this, this, 'hide', fx_name, fx_options);
  }
};