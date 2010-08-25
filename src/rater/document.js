/**
 * Document level on-demand auto-initialization
 *
 * Copyright (C) 2009-2010 Nikolay Nemshilov
 */
$(document).onMouseover(function(event) {
  var target = event.target, element = event.find('.rui-rater');
  
  if (element) {
    if (!(element instanceof Rater)) {
      element = new Rater(element);
      
      if (target.parent() === element) {
        target.fire('mouseover');
      }
    }
  }
});