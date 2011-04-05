/**
 * Native command related abstract tool
 *
 * Copyright (C) 2010-2011 Nikolay Nemshilov
 */
Rte.Tool.Command = new Class(Rte.Tool, {
  command: null, // execCommand name
  value:   null, // execCommand value

  /**
   * calling the command exec
   *
   * @return void
   */
  exec: function() {
    this.rte.selection.exec(this.command, this.value);
  },

  /**
   * Checks if the command is enabled at all
   *
   * @return boolean check result
   */
  enabled: function() {
    try {
      return document.queryCommandEnabled(this.command);
    } catch(e) {
      return false;
    }
  },

  /**
   * Queries if the command is in active state
   *
   * @return boolean check result
   */
  active: function() {
    try { // copy/paste commands cause errors under FF by default
      return this.value === null ?
        document.queryCommandState(this.command) :
        document.queryCommandValue(this.command) == this.value;
    } catch(e) {
      return false;
    }
  }
});