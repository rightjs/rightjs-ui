/**
 * Element level hook to make things resizable
 *
 * Copyright (C) 2010 Nikolay Nemshilov
 */
Element.include({
  /**
   * Makes a resizeable out of the element
   *
   * @param Object options
   * @return Element this
   */
  makeResizable: function(options) {
    new Resizable(this, options);
    return this;
  },
  
  /**
   * Destroys a resizable functionality
   *
   * @return Element this
   */
  undoResizable: function() {
    var resizable = Resizable.instances[$uid(this)];
    if (resizable) resizable.destroy();
    return this;
  }
});