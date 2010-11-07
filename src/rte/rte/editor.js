/**
 * The actual Editor unit for the Rte
 *
 * Copyright (C) 2010 Nikolay Nemshilov
 */
Rte.Editor = new Class(Element, {

  initialize: function(rte) {
    this.$super('div', {
      'class': 'rui-rte-editor',
      'contenteditable': true
    });

    this.rte = rte;

    this.on({
      focus: R(rte).fire.bind(rte, 'focus'),
      blur:  R(rte).fire.bind(rte, 'blur'),
      keydown: this._keydown
    });

    // setting up the styles mode
    document.designMode = 'On';
    document.execCommand('styleWithCSS', false, rte.options.styleWithCSS);
    document.designMode = 'Off';
  },

  focus: function() {
    this._.focus();
    return this;
  },

  blur: function() {
    this._.blur();
    return this;
  },

// protected

  // catches the keydown
  _keydown: function(event) {
    var raw = event._, key = raw.keyCode;

    if (raw.metaKey || raw.ctrlKey) {
      if (key in this.rte.shortcuts) {
        event.stop();
        this.rte.shortcuts[key].exec();
      }
    } else if (key === 37 || key === 38 || key === 39 || key === 40) {
      // call the status update when the user changes the cursor position
      this.rte.status.update();
    }
  }

});