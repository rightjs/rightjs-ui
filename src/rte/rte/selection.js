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
    return window.getSelection ?
      window.getSelection().getRangeAt(0) :  // w3c
      document.selection.createRange();      // IE
  },

  set: function(range) {
    if (window.getSelection) {  // w3c
      var selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
    } else { // ie
      range.select();
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