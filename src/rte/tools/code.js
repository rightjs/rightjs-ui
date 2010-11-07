/**
 * The code block tool
 *
 * Copyrigth (C) 2010 Nikolay Nemshilov
 */
Rte.Tool.Code = new Class(Rte.Tool, {
  command: 'formatblock',

  initialize: function(rte) {
    this.$super(rte);
    this.value = rte.options.codeTag;
  }
});