/**
 * This class handles the selection ranges
 *
 * Copyright (C) 2010 Nikolay Nemshilov
 */
Rte.Selection = new Class({

  /**
   * Basic constructor
   */
  initialize: function() {
    this.range = null;
  },

  /**
   * Returns current selected text range
   *
   * @return TextRange range
   */
  get: function() {
    return document.selection ?
      document.selection.createRange() :   // IE
      window.getSelection().getRangeAt(0); // w3c
  },

  /**
   * Sets the selection by range
   *
   * @param TextRange range
   * @return void
   */
  set: function(range) {
    if (range.select) {  // IE
      range.select();
    } else { // w3c
      var selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
    }
  },

  /**
   * Saves the current selection range
   *
   * @return void
   */
  save: function() {
    this.range = this.get();
  },

  /**
   * Restores previously stored selection range
   *
   * @return void
   */
  restore: function() {
    if (this.range !== null) {
      this.set(this.range);
    }
  },

  /**
   * Returns the parent dom-node for the current selection
   *
   * @return raw dom-node
   */
  parent: function() {
    var range = this.get();

    return range.startContainer ?
      range.startContainer.parentNode :
      range.parentElement();
  },

  /**
   * Puts current selection over the given raw dom-node
   *
   * @param raw dom-node
   * @return void
   */
  wrap: function(element) {
    var range = this.get();

    if (range.setStart) {
      range.setStartBefore(element);
      range.setEndAfter(element);
      this.set(range);
    } else {
      // TODO IE version
    }
  }
});