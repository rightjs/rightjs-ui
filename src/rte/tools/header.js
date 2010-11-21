/**
 * The header block tool
 *
 * Copyrigth (C) 2010 Nikolay Nemshilov
 */
Rte.Tool.Header = new Class(Rte.Tool.Format, {
  shortcut: 'H',

  initialize: function(rte) {
    this.$super(rte);
    this.tag = rte.options.headerTag;
  }
});