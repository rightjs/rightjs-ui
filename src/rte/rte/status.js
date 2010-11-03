/**
 * The Rte's status bar block
 *
 * Copyright (C) 2010 Nikolay Nemshilov
 */
Rte.Status = new Class(Element, {

  initialize: function(rte) {
    this.$super('div', {'class': 'rui-rte-status'});
    this.rte = rte;
  }

});