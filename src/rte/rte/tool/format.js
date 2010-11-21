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
    var nodes   = this.rte.status.nodes,
        tag     = this.tag.toUpperCase(),
        i       = nodes.length - 1,
        key, match;

    for (; i > -1; i--) {
      if (nodes[i].tagName === tag) {
        match = true;

        for (key in this.attributes) {
          match &= nodes[i].getAttribute(key) == this.attributes[key];
        }

        if (match) {
          return nodes[i];
        }

        break;
      }
    }

    return null;
  },

  /**
   * Removes the formatting
   *
   * @return void
   */
  unformat: function() {
    var editor  = this.rte.editor,
        element = this.element();

    if (element !== null) {
      editor.selection.wrap(element);
      editor.exec('insertHTML', element.innerHTML);
    }
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