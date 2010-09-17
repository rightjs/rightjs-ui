/**
 * The colors field element
 *
 * Copyright (C) 2010
 */
var Field = new Wrapper(Element, {
  initialize: function(options) {
    this.$super('div', {'class': 'field'});
    this.insert(this.pointer = $E('div', {'class': 'pointer'}));
  }
});
