/**
 * The image tool
 *
 * Copyrigth (C) 2010 Nikolay Nemshilov
 */
Rte.Tools.Image = new Class(Rte.Tool, {
  command: 'insertimage',

  exec: function() {
    if (this.enabled()) {
      Rte.Prompt.Url(
        this.active() ? this.element().src : "http://some-url.com",

        R(function(url) {
          if (url) {
            if (this.active()) {
              this.element().setAttribute('src', url);
            } else {
              this.rte.editor.focus().exec(this.command, url);
            }
          } else {
            console.log(this.element());
            console.log(this.rte.editor.removeElement.toString());
            this.rte.editor.removeElement(this.element());
          }
        }).bind(this)
      )
    }
  },

  active: function() {
    return this.element() !== null;
  },

  element: function() {
    var nodes = this.rte.status.nodes, image = nodes[nodes.length - 1];
    return image && image.tagName === "IMG" ? image : null;
  }
});