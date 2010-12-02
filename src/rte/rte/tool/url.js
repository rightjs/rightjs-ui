/**
 * An abstract URL tool, used with the links, images, videos, etc.
 *
 * Copyright (C) 2010 Nikolay Nemshilov
 */
Rte.Tool.Url = new Class(Rte.Tool, {
  prompt: Rte.Prompt.Url,
  attr:   null, // the url-attribute 'src', 'href', etc.

  exec: function() {
    this.prompt(function(url) {
      if (url) {
        this[this.element() ? 'url' : 'create'](url);
      } else {
        this.rte.editor.removeElement(this.element());
      }
    }, this.url());
  },

  active: function() {
    return this.element() !== null;
  },

// protected

  url: function(url) {
    if (this.element()) {
      if (url !== undefined) {
        this.element()[this.attr] = url;
      } else {
        return this.element()[this.attr];
      }
    }
  },

  create: function(url) {
    Rte.Tool.prototype.exec.call(this, this.command, this.value = url);
  }
});