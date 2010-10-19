/**
 * Dialog footer line element
 *
 * Copyright (C) 2010 Nikolay Nemshilov
 */
Dialog.Foot = new Class(Element, {

  initialize: function(dialog) {
    this.$super('div', {'class': 'rui-dialog-foot'});

    this.dialog = dialog;

    dialog.okButton     = new Button(Dialog.i18n.Ok,     {'class': 'ok'}).onClick(function() { dialog.fire('ok'); });
    dialog.helpButton   = new Button(Dialog.i18n.Help,   {'class': 'help'}).onClick(function() { dialog.fire('help'); });
    dialog.cancelButton = new Button(Dialog.i18n.Cancel, {'class': 'cancel'}).onClick(function() { dialog.fire('cancel'); });

    if (dialog.options.showHelp) {
      this.insert(dialog.helpButton);
    }

    if (dialog.options.closeable) {
      this.insert(dialog.cancelButton);
    }

    this.insert(dialog.okButton);
  }

});