/**
 * the 'ttext' tool
 *
 * Copyright (C) 2010 Nikolay Nemshilov
 */
Rte.Tool.Ttext = new Class(Rte.Tool.Format, {
  shortcut: 'T',
  command:  'formatblock',

  initialize: function(rte) {
    this.$super(rte);
    this.value = rte.options.ttextTag;
  }
});