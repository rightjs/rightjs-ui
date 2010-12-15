/**
 * the 'redo' tool
 *
 * The actual magic happens in the Rte.Undoer class
 * here we just show the status and blip it when used
 *
 * Copyright (C) 2010 Nikolay Nemshilov
 */
Rte.Tools.Redo = new Class(Rte.Tool, {
  blip: true,

  exec: function() {
    this.rte.undoer.redo();
  },

  enabled: function() {
    return this.rte.undoer.hasRedo();
  }

});