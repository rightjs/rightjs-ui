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

    var editor = this, selection = this.selection = new Rte.Selection();

    this.on({
      focus: function() {
        selection.restore();
        rte.fire('focus');
      },
      blur:    function() { rte.fire('blur'); },
      mouseup: function() { selection.save(); },
      keyup:   function(event) {
        if (editor._isNav(event)) {
          selection.save();
        }
      },
      keydown: this._keydown
    });

    // setting up the styles mode
    this.execCommand('styleWithCSS', rte.options.styleWithCSS);
  },

  focus: function() {
    this._.focus();
    return this;
  },

  blur: function() {
    this._.blur();
    return this;
  },

  execCommand: function(name, value) {
    try {
      this.selection.restore();
      document.designMode = 'On';
      document.execCommand(name, false, value);
      document.designMode = 'Off';
    } catch(e) {
      // getting off the designMode if some error happened
      document.designMode = 'Off';
      throw e;
    }

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
    } else if (this._isNav(event)) {
      // call the status update when the user changes the cursor position
      this.rte.status.update();
    }
  },

  _isNav: function(event) {
    var key = event._.keyCode;
    return key === 37 || key === 38 || key === 39 || key === 40;
  }

});