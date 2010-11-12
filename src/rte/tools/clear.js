/**
 * the 'clear' tool
 *
 * Copyright (C) 2010 Nikolay Nemshilov
 */
Rte.Tool.Clear = new Class(Rte.Tool, {
  shortcut: 'N',

  exec: function() {
    this.blip();
    this.rte.editor.exec('selectAll');
    this.rte.editor.exec('delete');
    this.rte.status.update();
  },

  check: function() {}
});