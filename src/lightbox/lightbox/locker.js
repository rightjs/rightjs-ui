/**
 * Lightbox background locker element
 *
 * Copyright (C) 2010-2011 Nikolay Nemshilov
 */
var Locker = new Class(Element, {
  initialize: function(options) {
    this.$super('div', {'class': 'rui-lightbox-locker'});

    if (options.hideOnOutClick) {
      this.onClick('fire', 'close');
    }
  }
});
