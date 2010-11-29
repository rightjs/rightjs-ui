/**
 * the 'backcolor' tool
 *
 * Copyright (C) 2010 Nikolay Nemshilov
 */
Rte.Tools.Backcolor = new Class(Rte.Tool.Color, {
  style: 'background-color',

  initialize: function(rte) {
    this.$super(rte);

    // creating the 'None' option
    this.items.unshift($E('ul').insertTo(
      $E('li', {'class': 'group'}).insertTo(this.options, 'top')
    ).append(
      $E('li', {html: '&times;',     'class': 'none active'}),
      $E('li', {html: Rte.i18n.None, 'class': 'label'})
    ).first());

    this.items[0].value = '';
    this.colors[''] = this.items[0];
  }
});