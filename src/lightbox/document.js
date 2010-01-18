/**
 * document on-load rescan
 *
 * Copyright (C) 2009-2010 Nikolay V. Nemshilov aka St.
 */
$(document.documentElement).onClick(function(event) {
  var key = Lightbox.Options.relName;
  
  var link = $(event.target).parents().first(function(a) {
    return a.tagName == 'A' && a.get('rel').startsWith(key);
  });
  
  if (link) {
    event.stop();
    new Lightbox(eval('('+link.get('data-'+key+'-options')+')')).show(link);
  }
});