/**
 * The basic tools class
 *
 * Copyright (C) 2010 Nikolay Nemshilov
 */
Rte.Tool = new Class(Element, {

  shortcut: false, // shortcut string
  command:  false, // execCommand command
  value:    null,  // execCommand value
  block:    true,  // should the 'keypress' be blocked
  blip:     false, // whether it should 'blip' when used

  /**
   * Basic constructor
   *
   * @param Rte rte reference
   * @return Rte.Tool this
   */
  initialize: function(rte) {
    // searching for the tool-name
    var name = '', tools = Rte.Tool, klass = this.constructor;

    for (name in tools) {
      if (tools[name] === klass) { break; }
    }

    this.$super('div', {
      'html':  '<i></i>', // <- icon container
      'class': 'tool icon '+ name.toLowerCase(),
      'title': (Rte.i18n[name] || name) + (
        this.shortcut ? " ("+ this.shortcut + ")" : ""
      )
    });

    // registering the tool
    this.rte = rte;
    rte.tools[name] = this;

    // hooking up the shortcuts
    if (this.shortcut) {
      rte.shortcuts[this.shortcut.toUpperCase().charCodeAt(0)] = this;
    }

    // connecting the mousedown the way that the editor din't loose the focus
    this.onMousedown(function(e) {
      e.stop(); this.mousedown();
    });

    // checking the command initial state
    this.check();

    // allowing some nice chains in the subclass
    return this;
  },

  /**
   * The entry point for the tools
   *
   * @return void
   */
  exec: function() {
    if (!this.disabled) {
      if (this.blip) { this.highlight(); }

      this.rte.editor.focus().exec(
        this.command, this.value
      );

      this.rte.status.update();
    }
  },

  /**
   * Checks the command's status
   *
   * @return void
   */
  check: function() {
    this._.className = this._.className.replace(' disabled', '');
    this.disabled = false;

    if (this.enabled()) {
      this._.className = this._.className.replace(' active', '');
      if (this.active()) {
        this._.className += ' active';
      }

    } else {
      this._.className += ' disabled';
      this.disabled = true;
    }
  },

  /**
   * Checks if the command is enabled at all
   *
   * @return boolean check result
   */
  enabled: function() {
    return !this.command || document.queryCommandEnabled(this.command);
  },

  /**
   * Queries if the command is in active state
   *
   * @return boolean check result
   */
  active: function() {
    try {
      if (this.value) {
        return this.rte.editor.focused && document.queryCommandValue(this.command) == this.value;
      } else {
        return this.rte.editor.focused && document.queryCommandState(this.command);
      }
    } catch(e) {}

    return false;
  },

  /**
   * Replacing the highlight method with some css stuff instead of an Fx
   *
   * @return Rte.Tool this
   */
  highlight: function() {
    R(this.addClass('highlight').removeClass).bind(this, 'highlight').delay(100);
  },

// protected

  // mousedown event receiver (might be replaced in subclasses)
  mousedown: function() {
    this.exec();
  }

});