/**
 * Text formatting specific abstract tool
 *
 * Copyright (C) 2010 Nikolay Nemshilov
 */
Rte.Tool.Format = new Class(Rte.Tool, {
  command:  'formatblock',

  exec: function() {
    if (this.active()) {
      var nodes = this.rte.status.nodes, tag = this.value.toUpperCase();

      for (var i = nodes.length-1; i > -1; i--) {
        if (nodes[i].tagName === tag) {
          var parent = nodes[i].parentNode;

          while (nodes[i].firstChild) {
            parent.insertBefore(nodes[i].firstChild, nodes[i]);
          }

          parent.removeChild(nodes[i]);
          break;
        }
      }
    } else {
      this.rte.editor.focus().exec(this.command, this.value);
    }

    this.rte.status.update();

    return this;
  },

  active: function() {
    return document.queryCommandValue(this.command) == this.value;
  }
});