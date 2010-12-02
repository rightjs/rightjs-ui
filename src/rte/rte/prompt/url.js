/**
 * Urls specific prompt interface
 *
 * Copyright (C) 2010 Nikolay Nemshilov
 */
Rte.Prompt.Url = function(callback, url) {
  url = prompt("Enter some URL", url || 'http://some.url.com');

  if (url !== null) {
    callback.call(this, url);
  }
};