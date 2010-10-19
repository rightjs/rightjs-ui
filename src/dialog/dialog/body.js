/**
 * Dialog body element
 *
 * Copyright (C) 2010 Nikolay Nemshilov
 */
Dialog.Body = new Class(Element, {

  initialize: function(dialog) {
    this.dialog  = dialog;
    this.options = dialog.options;

    this.$super('div', {'class': 'rui-dialog-body'});
    this.locker = $E('div', {'class': 'rui-dialog-body-locker'})
      .insert(new Spinner());
  },

  load: function(url, options) {
    this.insert(this.locker, 'top');

    this.xhr = new Xhr(url, Object.merge({method:'get'}, options))
      .onComplete(R(function(r) {
        this.update(r.text);
        this.dialog.resize().fire('load');
      }).bind(this))
      .send();

    return this;
  },

  update: function(content) {
    this.$super(content);

    if (this.options.showIcon) {
      this.insert('<div class="rui-dialog-body-icon">'+ this.options.showIcon + '</div>', 'top');
    }

    return this;
  }

});