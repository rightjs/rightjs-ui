/**
 * Abstract actions class
 *
 * Copyright (C) 2010 Nikolay Nemshilov
 */
Rte.Action = new Class(Element, {

  block: true,  // block the default actions of the browser (used for shortcuts)

  /**
   * Basic constructor
   *
   * @param Rte rte reference
   * @return Rte.Action this
   */
  initialize: function(rte) {
    var name = this.findName();

    this.$super('div', {
      'class': 'action icon '+ name.toLowerCase(),
      'title': (Rte.i18n[name] || name) + (this.key ? " ("+ this.key + ")" : "")
    });

    this.rte = rte;
    rte.actions.push(this);

    if (this.key) {
      rte.shortcuts[this.key.toUpperCase().charCodeAt(0)] = this;
    }

    this.onClick(this.kickIn);

    return this;
  },

  /**
   * Disables the action
   *
   * @return Rte.Action this
   */
  disable: function() {
    this.disabled = true;
    return this.addClass('disabled');
  },

  /**
   * Enables the action
   *
   * @param Rte.Action this
   */
  enable: function() {
    this.disabled = false;
    return this.removeClass('disabled');
  },

  /**
   * The entry point for the actions
   *
   * @param RightJS.Event event object
   * @return void
   */
  kickIn: function(event) {
    if (!this.disabled) {
      if (this.block) {
        event.stop();
      }

      this.blip();
    }
  },

  /**
   * Just highlights that the action was used
   *
   * @return void
   */
  blip: function() {
    this.highlight({duration: 'short'});
  },

// protected

  // Finds the action uniq name
  findName: function() {
    var key, actions = Rte.Action, klass = this.constructor;

    for (key in actions) {
      if (actions[key] === klass) {
        return key;
      }
    }

    return '';
  }

});