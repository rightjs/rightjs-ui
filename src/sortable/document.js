/**
 * Document level hooks for sortables
 *
 * Copyright (C) 2009-2010 Nikolay V. Nemshilov
 */
document.onMousedown(function(event) {
  var target = event.target, element = [target].concat(target.parents()).first('match', Sortable.Options.cssRule);
  
  if (element) {
    var sortable = element._srotable || new Sortable(element);
    
    if (target._draggable) {
      target._draggable.dragStart(event);
    }
  };
});