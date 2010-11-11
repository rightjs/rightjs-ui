/**
 * The actual Editor unit for the Rte
 *
 * Copyright (C) 2010 Nikolay Nemshilov
 */
Rte.Editor = new Class(Element, {

  /**
   * Basic constructor
   *
   * @param Rte rte
   * @return void
   */
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
      mouseup: function() {
        selection.save();
        rte.status.update();
      },
      keyup:   function(event) {
        if (editor._isNav(event)) {
          selection.save();
          rte.status.update();
        }
      },
      keydown:  this._keydown,
      keypress: this._keypress
    });

    // setting up the styles mode
    this.exec('styleWithCSS', rte.options.styleWithCSS);
  },

  /**
   * puts focus on the editing area
   *
   * @return Rte.Editor this
   */
  focus: function() {
    this._.focus();
    return this;
  },

  /**
   * removes focus out of the editing area
   *
   * @return Rte.Editor this
   */
  blur: function() {
    this._.blur();
    return this;
  },

  /**
   * executes a command on this editing area
   *
   * @return Rte.Editor this
   */
  exec: function(name, value) {
    try {
      // it throws errors in some cases in the non-design mode
      document.execCommand(name, false, value);
    } catch(e) {}

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
    }
  },

  _isNav: function(event) {
    var key = event._.keyCode;
    return key === 37 || key === 38 || key === 39 || key === 40;
  }

});