/**
 * the 'save' tool
 *
 * Copyright (C) 2010 Nikolay Nemshilov
 */
Rte.Tool.Save = new Class(Rte.Tool, {
  shortcut: 'S',

  initialize: function(rte) {
    this.$super(rte);
    if (!rte.textarea || !rte.textarea._.form) {
      this.disable();
    }
  },

  exec: function() {
    if (!this.disabled) {
      this.blip();
      this.rte.textarea.form().submit();
    }
  },

  check: function() {}
});