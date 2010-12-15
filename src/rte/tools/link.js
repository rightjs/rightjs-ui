/**
 * The the url link tool
 *
 * Copyrigth (C) 2010 Nikolay Nemshilov
 */
Rte.Tools.Link = new Class(Rte.Tool.Url, {
  shortcut: 'L',
  command:  'createlink',
  attr:     'href',

  enabled: function() {
    return !this.rte.selection.empty() || this.active();
  },

  element: function() {
    return this.rte.status.findElement('A', {});
  }
});