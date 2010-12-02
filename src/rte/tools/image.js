/**
 * The image tool
 *
 * Copyrigth (C) 2010 Nikolay Nemshilov
 */
Rte.Tools.Image = new Class(Rte.Tool.Url, {
  command: 'insertimage',
  attr:    'src',

  element: function() {
    var image = this.rte.selection.node();
    return image !== null && image.tagName === "IMG" ? image : null;
  }

});