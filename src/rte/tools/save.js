/**
 * the 'save' tool
 *
 * Copyright (C) 2010 Nikolay Nemshilov
 */
Rte.Tools.Save = new Class(Rte.Tool, {
  shortcut: 'S',

  initialize: function(rte) {
    this.$super(rte);
    if (!(rte.textarea && rte.textarea._.form)) {
      this.disabled = true;
      this.addClass('disabled');
    }
  },

  exec: function() {
    if (!this.disabled) {
      this.rte.textarea.form().submit();
    }
  },

  check: function() {} // checked in the constructor
});