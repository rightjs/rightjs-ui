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
    var content = '<'+ this.tag,
        editor  = this.rte.editor;

    for (var key in this.attributes) {
      content += ' '+key+'="'+ this.attributes[key]+ '"';
    }

    content += ">" + editor.selection.html() + '</'+ this.tag + '>';

    editor.exec('insertHTML', content);
  }

});