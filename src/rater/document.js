/**
 * Document on-load trigger for units auto-discovery
 *
 * Copyright (C) 2009-2010 Nikolay V. Nemshilov
 */
document.onMouseover(function(event) {
  var target = event.target, element = [target].concat(target.parents()).first('hasClass', 'right-rater');
  
  if (element) {
    var rater = element._rater || new Rater(element);
    if (target.parentNode === element)
      target.fire('mouseover');
  }
  
});