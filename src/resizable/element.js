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
    return new Resizable(this, options);
  },

  /**
   * Destroys a resizable functionality
   *
   * @return Element this
   */
  undoResizable: function() {
    if (this instanceof Resizable) {
      this.destroy();
    }
    return this;
  }
});
