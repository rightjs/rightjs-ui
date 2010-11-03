/**
 * Rte actions base class. Generally represents an icon in the toolbar
 *
 * Copyright (C) 2010 Nikolay Nemshilov
 */
Rte.Action = new Class(Element, {

  initialize: function(rte) {
    var name = this.findName();

    this.$super('div', {
      'class': 'action icon '+ name.toLowerCase(),
      'title': Rte.i18n[name] || name
    });

    return this;
  },

  /**
   * Finds the action uniq name
   *
   * @return String action name
   */
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