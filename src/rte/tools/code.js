/**
 * The code block tool
 *
 * Copyrigth (C) 2010 Nikolay Nemshilov
 */
Rte.Tools.Code = new Class(Rte.Tool.Format, {

  initialize: function(rte) {
    this.$super(rte);
    this.tag = rte.options.codeTag;
  }
});