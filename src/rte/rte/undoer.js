/**
 * Custom undo/redo manager
 *
 * The basic trouble is that the native undo manager
 * dosn't support manual changes in the editable block
 * plus it lacks an ability to save some things under IE
 *
 * So we manage our undo/redo states manually by whatching
 * the 'change' event in the RTE instance
 *
 * Copyright (C) 2010-2011 Nikolay Nemshilov
 */
Rte.Undoer = new Class({

  /**
   * Basic constructor
   *
   * @param Rte rte
   * @return void
   */
  initialize: function(rte) {
    this.rte = rte;
    this.rte.on('change', R(this.save).bind(this));
    this.clear();
  },

  /**
   * Clears up the undo history
   *
   * @return void
   */
  clear: function() {
    this.stash = [];
    this.index = -1;
  },

  /**
   * Checks if there are undo steps
   *
   * @return boolean check result
   */
  hasUndo: function() {
    return this.stash.length > 0 && this.index > 0;
  },

  /**
   * Checks if there are redo steps
   *
   * @return boolean check result
   */
  hasRedo: function() {
    return (this.stash.length - this.index) > 1;
  },

  /**
   * Moves the history one step back
   *
   * @return void
   */
  undo: function() {
    if (this.hasUndo()) {
      this.set(-- this.index);
    }
  },

  /**
   * Moves the histor one step forward
   *
   * @return void
   */
  redo: function() {
    if (this.hasRedo()) {
      this.set(++ this.index);
    }
  },

  /**
   * Sets the history to the given step
   *
   * @param Integer step index
   */
  set: function(index) {
    if (this.stash[this.index]) {
      this.rte.editor.update(this.stash[this.index]);
      this.rte.selection.restore();
    }
  },

  /**
   * Saves the current state of the editor
   *
   * @param Event the RTE's 'change' event with the 'tool' reference
   * @return void
   */
  save: function(event) {
    this.rte.selection.store();

    var tool = event ? event.tool : event, html = this.rte.editor._.innerHTML;

    if ((!tool || (tool !== this.rte.tools.Undo && tool !== this.rte.tools.Redo)) && this.stash[this.index] !== html) {
      // cutting off possible redo steps
      this.stash.length = this.index + 1;
      this.stash.push(html);
      this.index = this.stash.length - 1;

      if (this.rte.tools.Undo) {
        this.rte.tools.Undo.check();
      }
      if (this.rte.tools.Redo) {
        this.rte.tools.Redo.check();
      }
    }

    this.rte.selection.restore();
  }

});