/**
 * Calendar fields autodiscovery via the rel="calendar" attribute
 *
 * Copyright (C) 2009 Nikolay V. Nemshilov aka St.
 */
document.onReady(function() {
  var calendar = new Calendar();
  
  $$('*[rel*=calendar]').each(function(element) {
    var rel_id = element.get('rel').match(/calendar\[(.+?)\]/);
    if (rel_id) {
      var input = $(rel_id[1]);
      if (input) {
        calendar.assignTo(input, element);
      }
    } else {
      calendar.assignTo(element);
    }
  });
});
