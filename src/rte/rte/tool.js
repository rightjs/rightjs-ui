/**
 * The basic tools class
 *
 * Copyright (C) 2010 Nikolay Nemshilov
 */
Rte.Tool = new Class(Element, {

  shortcut: false, // shortcut string
  block:    true,  // should the 'keypress' be blocked
  blip:     false, // whether it should 'blip' when used
  changes:  true,  // if this tool should fire 'change' on the rte

  /**
   * Basic constructor
   *
   * @param Rte rte reference
   * @return Rte.Tool this
   */
  initialize: function(rte) {
    // searching for the tool-name
    for (var name in Rte.Tools) {
      if (Rte.Tools[name] === this.constructor) { break; }
    }

    this.name = name;

    this.$super('div', {
      'html':  '<div class="icon"></div>', // <- icon container
      'class': 'tool '+ name.toLowerCase(),
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

    // allowing some nice chains in the subclass
    return this;
  },

  // those three methods should be implemented in subclasses
  exec:    function() {               }, /// the actual process
  active:  function() { return false; }, // all tools not active by default
  enabled: function() { return true;  }, // all tools enabled by default

  /**
   * The entry point for all the tools, if you need to call a tool,
   * call this method. __DON'T CALL__ the #exec method directly!
   *
   * @return void
   */
  call: function() {
    if (!this.disabled) {
      this.exec();
      this.rte.status.update();
      this.rte.fire('change', {tool: this});
      if (this.blip) { this.highlight(); }
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

    if ((this.name === 'Source' || this.rte.srcMode !== true) && this.enabled()) {
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
    this.call();
  }

});