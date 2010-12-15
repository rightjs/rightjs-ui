/**
 * An abstract URL tool, used with the links, images, videos, etc.
 *
 * Copyright (C) 2010 Nikolay Nemshilov
 */
Rte.Tool.Url = new Class(Rte.Tool, {
  attr:   null, // the url-attribute 'src', 'href', etc.

  exec: function(url) {
    if (url === undefined) {
      this.prompt();
    } else {
      if (url) {
        this[this.element() ? 'url' : 'create'](url);
      } else {
        this.rte.editor.removeElement(this.element());
      }
    }
  },

  active: function() {
    return this.element() !== null;
  },

  prompt: function() {
    var url = prompt(Rte.i18n.UrlAddress, this.url() || 'http://some.url.com');

    if (url !== null) {
      this.exec(url);
    }
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
    this.rte.exec(this.command, url);
  }
});