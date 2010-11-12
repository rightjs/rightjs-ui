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
    var name = this.findName();

    this.$super('div', {
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
      e.stop();
      this.exec();
    });

    // checking if the command is supported
    this.supported();

    return this;
  },

  /**
   * Disables the action
   *
   * @return Rte.Tool this
   */
  disable: function() {
    this.disabled = true;
    return this.addClass('disabled');
  },

  /**
   * Enables the action
   *
   * @param Rte.Tool this
   */
  enable: function() {
    this.disabled = false;
    return this.removeClass('disabled');
  },

  /**
   * The entry point for the tools
   *
   * @return void
   */
  exec: function() {
    if (this.supported()) {
      if (this.command) {
        if (this.blips) { this.blip(); }

        this.rte.editor.focus().exec(
          this.command, this.value
        );
        this.rte.status.update();
      }
    }
  },

  /**
   * Checks the command's status
   *
   * @return void
   */
  check: function() {
    if (this.supported() && this.command) {
      this[this.rte.editor.query(this.command) ? 'addClass' : 'removeClass']('active');
    }
  },

  /**
   * Highlights the button as triggered
   *
   * @return void
   */
  blip: function() {
    R(this.addClass('blip').removeClass).bind(this, 'blip').delay(100);
  },

  /**
   * Checks if the command is supported
   *
   * @return boolean check result
   */
  supported: function() {
    if (this.command) {
      if (document.queryCommandEnabled(this.command)) {
        this.enable();
      } else {
        this.disable();
      }
    }

    return !this.disabled;
  },

// protected

  // Finds the tool uniq name
  findName: function() {
    var key, tools = Rte.Tool, klass = this.constructor;

    for (key in tools) {
      if (tools[key] === klass) {
        return key;
      }
    }

    return '';
  }

});