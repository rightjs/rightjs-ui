/**
 * The Rte's status bar block
 *
 * Copyright (C) 2010 Nikolay Nemshilov
 */
Rte.Status = new Class(Element, {

  /**
   * Basic constructor
   *
   * @param Rte
   * @return void
   */
  initialize: function(rte) {
    this.$super('div', {'class': 'rui-rte-status'});
    this.rte   = rte;
    this.nodes = [];
    this.tags  = [];

    this.onMousedown(this._mousedown);
  },

  /**
   * Updates the current status
   *
   * @return Rte.Status this
   */
  update: function() {
    this._findNodes();
    this._checkTools();

    return this.$super(this.nodes.map(function(node, index) {
      var name = node.tagName.toLowerCase();

      if (node.id) {
        name += "#"+ node.id;
      }

      if (node.className) {
        node += "."+ node.className;
      }

      return '<a href="" data-index="'+ index +
        '" onclick="return false;" title="'+
          Rte.i18n.Select +
        '">'+ name +'</a>';

    }).join(' &rsaquo; '));
  },

  /**
   * Finds an element in the current status stack
   *
   * @param String tag name
   * @param Object optional attributes
   * @return raw element or null if nothing found
   */
  findElement: function(tag, attributes) {
    tag = tag.toUpperCase();
    attributes = attributes || {};

    for (var i = this.nodes.length - 1, key, match; i > -1; i--) {
      if (this.nodes[i].tagName === tag) {
        match = true;

        for (key in attributes) {
          match &= this.nodes[i].getAttribute(key) == attributes[key];
        }

        if (match) {
          return this.nodes[i];
        }
      }
    }

    return null;
  },

// protected

  // runs the tools check
  _checkTools: function() {
    var tools = this.rte.tools, key;
    for (key in tools) {
      tools[key].check();
    }
  },

  // finds the nodes from the current selection to the bottom
  _findNodes: function() {
    var node   = this.rte.editor.focus().selection.parent(),
        editor = this.rte.editor._,
        rte    = this.rte._,
        nodes  = [],
        tags   = [];

    this.nodes = [];
    this.tags  = [];

    while (node && node !== rte) {
      if (node.tagName) { // skipping the textual nodes
        nodes.unshift(node);
        tags.unshift(node.tagName);
      }

      node = node.parentNode;

      if (node === editor) {
        this.nodes = nodes;
        this.tags  = tags;
        break;
      }
    }
  },

  // catches the mousedown on the links
  _mousedown: function(event) {
    var link = event.target;

    if (link._.tagName === 'A') {
      event.stop();
      var index = link.get('data-index').toInt(),
          node  = this.nodes[index];

      this.rte.editor.selection.wrap(node);
    }
  }

});