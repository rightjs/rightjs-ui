/**
 * The block quote tool
 *
 * Copyrigth (C) 2010 Nikolay Nemshilov
 */
Rte.Tool.Quote = new Class(Rte.Tool.Format, {

  initialize: function(rte) {
    this.$super(rte);
    this.tag = rte.options.quoteTag;
  }

});