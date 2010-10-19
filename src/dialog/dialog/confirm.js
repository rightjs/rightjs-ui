/**
 * Confirm specific dialog
 *
 * Copyright (C) 2010 Nikolay Nemshilov
 */
Dialog.Confirm = new Class(Dialog, {

  initialize: function(options) {
    options = Object.merge({
      showIcon: '?',
      title:    Dialog.i18n.Confirm
    }, options);

    this.$super(options);
    this.addClass('rui-dialog-confirm');
    this.on('ok', 'hide');
  }

});