/**
 * the 'clear' tool
 *
 * Copyright (C) 2010-2011 Nikolay Nemshilov
 */
Rte.Tools.Clear = new Class(Rte.Tool, {

  exec: function() {
    this.rte.selection.exec('selectall');
    this.rte.selection.exec('delete');
  }

});