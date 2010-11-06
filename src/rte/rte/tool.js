/**
 * The basic tools class
 *
 * Copyright (C) 2010 Nikolay Nemshilov
 */
Rte.Tool = new Class(Element, {

  block: true,  // block the default respond of the browser (used for shortcuts)

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
      'title': (Rte.i18n[name] || name) + (this.key ? " ("+ this.key + ")" : "")
    });

    this.rte = rte;
    rte.tools[name] = this;

    if (this.key) {
      rte.shortcuts[this.key.toUpperCase().charCodeAt(0)] = this;
    }

    this.onClick(this.kickIn);

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
   * The entry point for the toolss
   *
   * @param RightJS.Event event object
   * @return void
   */
  involve: function(event) {
    if (!this.disabled) {
      if (this.block) {
        event.stop();
      }

      this.blip();
    }
  },

  /**
   * Just highlights that the tool was used
   *
   * @return void
   */
  blip: function() {
    this.highlight({duration: 'short'});
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