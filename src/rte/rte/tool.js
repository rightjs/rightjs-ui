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
    this.enabled();

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
    if (this.enabled()) {
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
    if (this.enabled()) {
      // speading up the className toggling
      this._.className = this._.className.replace(' active', '');

      if (this.active()) {
        this._.className += ' active';
      }
    }
  },

  /**
   * Checks if the command is enabled at all
   *
   * @return boolean check result
   */
  enabled: function() {
    if (this.command) {
      this._.className = this._.className.replace(' disabled', '');
      this.disabled    = false;

      if (!document.queryCommandEnabled(this.command)) {
        this._.className += ' disabled';
        this.disabled  = true;
      }
    }

    return !this.disabled;
  },

  /**
   * Queries if the command is in active state
   *
   * @return boolean check result
   */
  active: function() {
    if (this.command) {
      try {
        return document.queryCommandState(this.command);
      } catch(e) {}
    }

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

// private

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