/**
 * Lightbox background locker element
 *
 * Copyright (C) 2010 Nikolay Nemshilov
 */
var Locker = new Wrapper(Element, {
  initialize: function(options) {
    this.$super('div', {'class': 'rui-lightbox-locker'});

    if (options.hideOnOutClick) {
      this.onClick('fire', 'close');
    }
  }
});
