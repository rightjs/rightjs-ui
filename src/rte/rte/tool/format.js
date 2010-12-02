/**
 * Text formatting specific abstract tool
 *
 * Copyright (C) 2010 Nikolay Nemshilov
 */
Rte.Tool.Format = new Class(Rte.Tool, {
  tag:        null, // element's tag name
  attributes: {},   // element's attributes

  /**
   * Overloading the main funciton
   *
   * @return Rte.Tool.Format this
   */
  exec: function() {
    this[this.active() ? 'unformat' : 'format']();
    this.rte.status.update();

    return this;
  },

  /**
   * Overloading the activity checks
   *
   * @return boolean check result
   */
  active: function() {
    return this.element() !== null;
  },

// protected

  /**
   * Tries to find a currently active element
   *
   * @return raw dom element or null
   */
  element: function() {
    return this.rte.status.findElement(this.tag, this.attributes);
  },

  /**
   * Removes the formatting
   *
   * @return void
   */
  unformat: function() {
    this.rte.editor.removeElement(this.element());
  },

  /**
   * Formats the block accordingly
   *
   * @return void
   */
  format: function() {
    var content = '<'+ this.tag, attr;

    for (attr in this.attributes) {
      content += ' '+ attr +'="'+ this.attributes[attr]+ '"';
    }

    content += ">" + this.rte.selection.html() + '</'+ this.tag + '>';

    this.rte.editor.exec('insertHTML', content);
  }

});