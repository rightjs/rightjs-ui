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

    while (node && node !== editor && node !== rte) {
      if (node.tagName) { // skipping the textual nodes
        nodes.unshift(node);
        tags.unshift(node.tagName);
      }

      node = node.parentNode;
    }

    this.nodes = nodes;
    this.tags  = tags;
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