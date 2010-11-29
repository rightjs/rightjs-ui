/**
 * The source tool
 *
 * Copyrigth (C) 2010 Nikolay Nemshilov
 */
Rte.Tools.Source = new Class(Rte.Tool, {
  shortcut: 'E',
  _on:      false,
  source:   false,

  exec: function() {
    this[this._on ? 'showPreview' : 'showSource']();
    this._on = !this._on;
  },

  enabled: function() {
    return true;
  },

  active: function() {
    return this._on && this.enabled();
  },

// protected

  showPreview: function() {
    if (this.source) {
      this.source.remove();
    }
  },

  showSource: function() {
    (
      this.source = this.source ||
      $E('textarea', {'class': 'rui-rte-source'})
    )
    .setValue('' + this.rte.editor.html())
    .insertTo(this.rte.editor, 'before')
    .resize(this.rte.editor.size())
    ._.focus();
  }
});