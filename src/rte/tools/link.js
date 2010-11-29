/**
 * The the url link tool
 *
 * Copyrigth (C) 2010 Nikolay Nemshilov
 */
Rte.Tools.Link = new Class(Rte.Tool, {
  shortcut: 'L',
  command:  'createlink',  // 'unlink'

  exec: function() {
    if (this.enabled()) {
      Rte.Prompt.Url(
        this.active() ? this.element().href : "http://some-url.com",

        R(function(url) {
          if (url) {
            if (this.active()) {
              this.element().setAttribute('href', url);
            } else {
              this.rte.editor.focus().exec(this.command, url);
            }
          } else {
            this.rte.editor.removeElement(this.element());
          }
        }).bind(this)
      )
    }
  },

  enabled: function() {
    return !this.rte.editor.selection.empty() || this.active();
  },

  active: function() {
    return this.element() !== null;
  },

  element: function() {
    return this.rte.status.findElement('a');
  }
});