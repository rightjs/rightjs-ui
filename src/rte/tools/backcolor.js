/**
 * the 'backcolor' tool
 *
 * Copyright (C) 2010 Nikolay Nemshilov
 */
Rte.Tool.Backcolor = new Class(Rte.Tool.Color, {
  command: RightJS.Browser.IE ? 'backcolor' : 'hilitecolor',

  initialize: function(rte) {
    this.$super(rte);

    // creating the 'None' option
    this.items.unshift($E('ul').insertTo(
      $E('li', {'class': 'group'}).insertTo(this.options, 'top')
    ).append(
      $E('li', {html: '&times;',     'class': 'none active'}),
      $E('li', {html: Rte.i18n.None, 'class': 'label'})
    ).first());

    this.items[0].value = 'transparent';
    this.colors['transparent'] = this.items[0];
  }
});