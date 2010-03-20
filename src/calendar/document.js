/**
 * Calendar fields autodiscovery via the rel="calendar" attribute
 *
 * Copyright (C) 2009-2010 Nikolay V. Nemshilov
 */


(function() {
  // shows a calendar by an event
  var show_calendar = function(event) {
    var calendar = Calendar.find(Event.ext(event));
    
    if (calendar) {
      var input     = event.target;
      var rule      = Calendar.Options.cssRule.split('[').last();
      var key       = rule.split('=').last().split(']').first();
      var rel_id_re = new RegExp(key+'\\[(.+?)\\]');
      var rel_id    = input.get(rule.split('^=')[0]);
      
      if (rel_id && (rel_id = rel_id.match(rel_id_re))) {
        input = $(rel_id[1]);
        event.stop();
      }
      
      calendar.showAt(input);
    }
  };
  
  // on-click handler
  var on_mousedown = function(event) {
    show_calendar(event);
    
    var target = event.target;
    if ([target].concat(target.parents()).first('hasClass', 'right-calendar')) event.stop();
  };
  
  var on_click = function(event) {
    var target = event.target;
    
    if (Calendar.find(event)) {
      if (target.tagName == 'A')
        event.stop();
    } else if (Calendar.current) {
      if (![target].concat(target.parents()).first('hasClass', 'right-calendar'))
        Calendar.current.hide();
    }
  };
  
  // on-focus handler
  var on_focus = function(event) {
    show_calendar(event);
  };
  
  // on-blur handler
  var on_blur = function(event) {
    var calendar = Calendar.find(Event.ext(event));
    
    if (calendar)
      calendar.hide();
  };
  
  var on_keydown = function(event) {
    if (Calendar.current) {
      var name;

      switch(event.keyCode) {
        case 27: name = 'hide';      break;
        case 37: name = 'prevDay';   break;
        case 39: name = 'nextDay';   break;
        case 38: name = 'prevWeek';  break;
        case 40: name = 'nextWeek';  break;
        case 34: name = 'nextMonth'; break;
        case 33: name = 'prevMonth'; break;
        case 13:
           Calendar.current.select(Calendar.current.date);
           name = 'done';
           break;
      }

      if (name) {
        Calendar.current[name]();
        event.stop();
      }
    }
  };
  
  
  document.on({
    mousedown: on_mousedown,
    click:     on_click,
    keydown:   on_keydown
  });
  
  // the focus and blur events need some extra care
  if (Browser.IE) {
    // IE version
    document.attachEvent('onfocusin', on_focus);
    document.attachEvent('onfocusout', on_blur);
  } else {
    // W3C version
    document.addEventListener('focus', on_focus, true);
    document.addEventListener('blur',  on_blur,  true);
  }
})();


