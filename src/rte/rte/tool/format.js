/**
 * Text formatting specific abstract tool
 *
 * Copyright (C) 2010 Nikolay Nemshilov
 */
Rte.Tool.Format = new Class(Rte.Tool, {
  tag:  null, // element's tag name
  atts: {},   // element's attributes

  /**
   * Basic constructor
   *
   * @param Rte rte
   * @return Rte Tool this
   */
  initialize: function(rte) {
    this.$super(rte);

    if (this.tag === null && rte.options['tag'+ this.name]) {
      this.tag = rte.options['tag'+ this.name].toUpperCase();
    }

    return this;
  },

  /**
   * triggering the formatting
   *
   * @return void
   */
  exec: function() {
    this[this.active() ? 'unformat' : 'format']();
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
    return this.rte.status.findElement(this.tag, this.attrs);
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

    for (attr in this.attrs) {
      content += ' '+ attr +'="'+ this.attrs[attr]+ '"';
    }

    content += ">" + this.rte.selection.html() + '</'+ this.tag + '>';

    this.rte.exec('inserthtml', content);
  }

});