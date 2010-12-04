/**
 * The source tool
 *
 * Copyrigth (C) 2010 Nikolay Nemshilov
 */
Rte.Tools.Source = new Class(Rte.Tool, {
  shortcut: 'E',
  source:   false, // the textarea element reference

  exec: function() {
    this[this.rte.srcMode ? 'showPreview' : 'showSource']();
    this.rte.srcMode = !this.rte.srcMode;
  },

  enabled: function() {
    return true;
  },

  active: function() {
    return this.rte.srcMode;
  },

// protected

  showPreview: function() {
    this.rte.editor.setStyle('visibility:visible');
    if (this.source) {
      this.rte.value(this.source.value());
      this.source.remove();
    }

    this.rte.editor.focus();
  },

  showSource: function() {
    this.rte.editor.setStyle('visibility:hidden;');

    (
      this.source = this.source ||
      $E('textarea', {'class': 'rui-rte-source'})
    )
    .insertTo(this.rte.editor, 'before')
    .resize(this.rte.editor.size())
    .setValue('' + this.rte.value())
    .focus();

    this.rte.focused = true;

    this.rte.status.update();

    // locking all the tools
    for (var name in this.rte.tools) {
      if (this.rte.tools[name] !== this) {
        this.rte.tools[name].addClass('disabled');
      }
    }
  }
});