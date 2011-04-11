/**
 * The basic tools class
 *
 * Copyright (C) 2010-2011 Nikolay Nemshilov
 */
Rte.Tool = new Class(Element, {

  block:    true,  // should the 'keypress' event be blocked
  blip:     false, // whether it should be highlighted when used
  changes:  true,  // if this tool should fire 'change' on the rte

  shortuct: null,  // the shortuct string
  shiftKey: false, // if it should trigger with a shift-key only

  /**
   * Basic constructor
   *
   * @param Rte rte reference
   * @return Rte.Tool this
   */
  initialize: function(rte) {
    var name;

    // searching for the tool-name
    for (name in Rte.Tools) {
      if (Rte.Tools[name] === this.constructor) { break; }
    }

    this.name = name;
    this.shortcut = this.shortcut || Rte.Shortcuts[name];

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
    this.shortcut = this.shortcut && this.shortcut.toLowerCase();
    this.shiftKey = this.shortcut && this.shortcut.indexOf('shift') > -1;

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
   * @param {Event} 'keydown' event
   * @return void
   */
  call: function(event) {
    if (!this.disabled) {
      if (event && this.block) { event.stop(); }

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