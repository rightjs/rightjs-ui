/**
 * The basic tools class
 *
 * Copyright (C) 2010 Nikolay Nemshilov
 */
Rte.Tool = new Class(Element, {

  shortcut: false, // shortcut string
  command:  false, // execCommand command
  value:    null,  // execCommand value

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
    if (!this.disabled) {
      if (this.command) {
        this.rte.editor.focus().exec(
          this.command, this.value
        );
      }
    }
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