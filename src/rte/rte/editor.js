/**
 * The actual Editor unit for the Rte
 *
 * Copyright (C) 2010 Nikolay Nemshilov
 */
Rte.Editor = new Class(Element, {

  initialize: function(rte) {
    this.$super('div', {
      'class': 'rui-rte-editor',
      'contenteditable': true
    });

    this.rte = rte;

    this.on({
      focus: R(rte).fire.bind(rte, 'focus'),
      blur:  R(rte).fire.bind(rte, 'blur')
    });
  },


  focus: function() {
    this._.focus();
    return this;
  },

  blur: function() {
    this._.blur();
    return this;
  }


});