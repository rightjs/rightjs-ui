/**
 * the 'clear' tool
 *
 * Copyright (C) 2010 Nikolay Nemshilov
 */
Rte.Tools.Clear = new Class(Rte.Tool, {

  exec: function() {
    this.highlight();
    this.rte.editor.exec('selectAll');
    this.rte.editor.exec('delete');
    this.rte.status.update();
  },

  active: function() {
    return false;  // it's never gets active
  }
});