/**
 * the 'clear' tool
 *
 * Copyright (C) 2010 Nikolay Nemshilov
 */
Rte.Tools.Clear = new Class(Rte.Tool, {

  exec: function() {
    this.rte.exec('selectall');
    this.rte.exec('delete');
  }

});