/**
 * This class handles the selection ranges
 *
 * Copyright (C) 2010 Nikolay Nemshilov
 */
Rte.Selection = new Class({

  initialize: function() {
    this.range = null;
  },

  get: function() {
    return document.selection ?
      document.selection.createRange() :   // IE
      window.getSelection().getRangeAt(0); // w3c
  },

  set: function(range) {
    if (range.select) {  // IE
      range.select();
    } else { // w3c
      var selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
    }
  },

  save: function() {
    this.range = this.get();
  },

  restore: function() {
    if (this.range !== null) {
      this.set(this.range);
    }
  }
});