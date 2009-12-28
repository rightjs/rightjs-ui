/**
 * The element level inline editor extension
 *
 * Copyright (C) 2009 Nikolay V. Nemshilov
 */
Element.addMethods({
  /**
   * Triggers an inline-editor feature on the element
   *
   * @param Object options for the InEdit class
   * @return InEdit object
   */
  inEdit: function(options) {
    return new InEdit(this, options).show();
  }
});