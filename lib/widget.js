/**
 * This module defines the basic widgets constructor
 * it creates an abstract proxy with the common functionality
 * which then we reuse and override in the actual widgets
 *
 * Copyright (C) 2010 Nikolay Nemshilov
 */

/**
 * The widget units constructor
 *
 * @param String tag-name or Object methods
 * @param Object methods
 * @return Widget wrapper
 */ 
function Widget(tag_name, methods) {
  if (!methods) {
    methods = tag_name;
    tag_name = 'DIV';
  }
  
  /**
   * An Abstract Widget Unit
   *
   * Copyright (C) 2010 Nikolay Nemshilov
   */
  var AbstractWidget = new RightJS.Wrapper(RightJS.Element.Wrappers[tag_name] || RightJS.Element, {
    /**
     * The common constructor
     *
     * @param Object options
     * @param String optional tag name
     * @return void
     */
    initialize: function(key, options) {
      this.key = key;
      this.$super(tag_name, {'class': 'rui-' + key});
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
      element = element || this;
      RightJS.Options.setOptions.call(this,
        RightJS.Object.merge(options, eval("("+(
          element.get('data-'+ this.key) || '{}'
        )+")"))
      );
    }
  });
  
  /**
   * Creating the actual widget class
   *
   */
  var Klass = new RightJS.Wrapper(AbstractWidget, methods);
  
  // creating the widget related shortcuts
  RightJS.Observer.createShortcuts(Klass.prototype, Klass.EVENTS || []);
  
  return Klass;
}
