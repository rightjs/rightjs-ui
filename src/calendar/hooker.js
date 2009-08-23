/**
 * Calendar fields autodiscovery via the rel="calendar" attribute
 *
 * Copyright (C) 2009 Nikolay V. Nemshilov aka St.
 */
document.onReady(function() {
  var calendar = new Calendar();
  var rel_id_re = new RegExp(Calendar.Options.relName+'\\[(.+?)\\]');
  
  $$(Calendar.Options.checkTags+'[rel*='+Calendar.Options.relName+']').each(function(element) {
    var rel_id = element.get('rel').match(rel_id_re);
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
