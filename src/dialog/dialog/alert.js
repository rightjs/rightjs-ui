/**
 * Alert specific dialog
 *
 * Copyright (C) 2010 Nikolay Nemshilov
 */
Dialog.Alert = new Class(Dialog, {

  initialize: function(options) {
    options = Object.merge({
      showIcon: '!',
      title:    Dialog.i18n.Alert
    }, options);

    this.$super(options);
    this.addClass('rui-dialog-alert');
    this.on('ok', 'hide');
  }
});