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

    function save() { this.undoer.save(); }
    this.rte.on({ focus:  save, change: save });

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
    var tool  = event ? event.tool : event,
        tools = this.rte.tools,
        html, html1, html2;

    if (!tool || (tool !== tools.Undo && tool !== tools.Redo)) {
      this.rte.selection.store();

      html = this.rte.editor._.innerHTML;

      html1 = html
        .replace(SELECTION_START_RE, '')
        .replace(SELECTION_END_RE, '');

      html2 = (this.stash[this.index]||'')
        .replace(SELECTION_START_RE, '')
        .replace(SELECTION_END_RE, '');

      if (html1 !== html2) {
        // cutting off possible redo steps
        this.stash.length = this.index + 1;
        this.stash.push(html);
        this.index = this.stash.length - 1;

        if (tools.Undo) {
          tools.Undo.check();
        }
        if (tools.Redo) {
          tools.Redo.check();
        }
      }

      this.rte.selection.restore();
    }
  }

});