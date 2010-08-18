/**
 * The tint picker block
 *
 * Copyright (C) 2010 Nikolay Nemshilov
 */
var Colors = new Wrapper(Element, {
  initialize: function() {
    this.$super('div', {'class': 'colors'});
    this.insert(this.pointer = $E('div', {'class': 'pointer'}));
  }
});