/**
 * the 'save' tool
 *
 * Copyright (C) 2010-2011 Nikolay Nemshilov
 */
Rte.Tools.Save = new Class(Rte.Tool, {

  initialize: function(rte) {
    this.$super(rte);
    if (!(rte.textarea && rte.textarea.form())) {
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