/**
 * An Abstract Widget Unit
 *
 * Copyright (C) 2010 Nikolay Nemshilov
 */
var AbstractWidget = new RightJS.Wrapper(RightJS.Element, {
  /**
   * The common constructor
   *
   * @param Object options
   * @param String optional tag name
   * @return void
   */
  initialize: function(key, options, tag_name) {
    this.key = key;
    this.$super(tag_name || 'div');
    this.addClass('right-'+ key);
    this.setOptions(options, this);
    return this;
  },
  
// protected

  /**
   * Catches the options
   *
   * @param Object user-options
   * @param Element element with contextual options
   * @return void
   */
  setOptions: function(options, element) {
    RightJS.Options.setOptions.call(this,
      RightJS.Object.merge(options, eval("("+(
        element.get('data-'+ this.key +'-options') ||
        element.get('data-'+ this.key) || '{}'
      )+")"))
    );
  }
});

/**
 * The widget units constructor
 *
 * @param Object methods
 * @return Widget wrapper
 */ 
function Widget(methods) {
  var Klass = new RightJS.Wrapper(AbstractWidget, methods);
  RightJS.Observer.createShortcuts(Klass.prototype, Klass.EVENTS || []);
  
  return Klass;
}
