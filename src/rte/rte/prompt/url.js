/**
 * Urls specific prompt interface
 *
 * Copyright (C) 2010 Nikolay Nemshilov
 */
Rte.Prompt.Url = function(sample, callback) {
  var url = prompt("Enter some URL", sample);

  if (url !== null) { // not canceled
    callback(url);
  }
};