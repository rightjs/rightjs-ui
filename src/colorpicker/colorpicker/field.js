/**
 * The colors field element
 *
 * Copyright (C) 2010-2011
 */
var Field = new Class(Element, {
  initialize: function(options) {
    this.$super('div', {'class': 'field'});
    this.insert(this.pointer = $E('div', {'class': 'pointer'}));
  }
});
