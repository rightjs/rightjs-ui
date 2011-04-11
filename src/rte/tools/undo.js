/**
 * The undo tool
 *
 * The actual magic happens in the Rte.Undoer class
 * here we just show the status and blip it when used
 *
 * Copyright (C) 2010-2011 Nikolay Nemshilov
 */
Rte.Tools.Undo = new Class(Rte.Tool, {
  blip: true,

  exec: function() {
    this.rte.undoer.undo();
  },

  enabled: function() {
    return this.rte.undoer.hasUndo();
  }
});