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
    // IE won't allow us to set 'contenteditable' progarmatically
    // so we put it as a textual content and then find it manually
    this.$super(rte
      .append('<div contenteditable="true" class="rui-rte-editor"></div>')
      .first('div.rui-rte-editor')._
    );

    this.rte = rte;

    this.on({
      focus:    this._focus,
      blur:     this._blur,
      mouseup:  this._mouseup,
      keypress: this._keypress,
      keydown:  this._keydown,
      keyup:    this._keyup
    });
  },

  /**
   * Updates the editor's content
   *
   * @param String text
   * @return Rte.Editor this
   */
  update: function(text) {
    this.$super(text);
    return this;
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
   * Removes the element from the editor, placing all its content
   * in its place
   *
   * @param raw dom element
   * @return void
   */
  removeElement: function(element) {
    if (element !== null) {
      var parent = element.parentNode;
      while (element.firstChild) {
        parent.insertBefore(element.firstChild, element);
      }
      parent.removeChild(element);
    }
  },

// protected

  _focus: function() {
    this.rte.selection.restore();
    this.rte.status.update();
    this.rte.focused = true;
  },

  _blur: function() {
    this.rte.focused = false;
    this.rte.status.update();
  },

  _mouseup: function() {
    this._focus();
  },

  _keypress: function(event) {
    if (this.__stopped) {
      event.stop();
    }
  },

  _keydown: function(event) {
    var raw = event._, stopped = false, tool;

    if (raw.metaKey || raw.ctrlKey) {
      if ((tool = this.rte.toolbar.shortcut(event))) {
        tool.call(event);
      }

      stopped = event.stopped;
    }

    // an internal marker to lock the 'keypress' event later on
    this.__stopped = stopped;
  },

  _keyup: function(event) {
    switch (event.keyCode) {
      case 37: // arrow
      case 38: // arrow
      case 39: // arrow
      case 40: // arrow
        this.rte.status.update();
        break;

      default:
        // watching the typing pauses to fire 'change' events
        var rte = this.rte, editor = this._;

        if (this._timer !== false) { window.clearTimeout(this._timer); }

        this._timer = window.setTimeout(function() {
          if (rte.__old_value !== editor.innerHTML) {
            rte.__old_value = editor.innerHTML;
            rte.fire('change');
          }
        }, this._delay);
    }
  },

  _timer: false,
  _delay: 400

});