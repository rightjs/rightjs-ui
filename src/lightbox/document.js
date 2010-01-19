/**
 * document on-load rescan
 *
 * Copyright (C) 2009-2010 Nikolay V. Nemshilov aka St.
 */
$(document.documentElement).onClick(function(event) {
  var target = $(event.target);
  var suspects = [target].concat(target.parents());
  
  // we chop off the HTML and BODY element from the end of the list
  var link = suspects.slice(0, suspects.length-2).first('match', Lightbox.Options.cssRule);
  
  if (link) {
    event.stop();
    new Lightbox(eval('('+link.get('data-lightbox-options')+')')).show(link);
  }
});