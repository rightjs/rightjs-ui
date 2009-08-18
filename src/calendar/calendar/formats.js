/**
 * This module handles the dates parsing/formatting processes
 *
 * To format dates and times this scripts use the GNU (C/Python/Ruby) strftime
 * function formatting principles
 *
 *   %a - The abbreviated weekday name (``Sun'')
 *   %A - The  full  weekday  name (``Sunday'')
 *   %b - The abbreviated month name (``Jan'')
 *   %B - The  full  month  name (``January'')
 *   %d - Day of the month (01..31)
 *   %e - Day of the month without leading zero (1..31)
 *   %m - Month of the year (01..12)
 *   %y - Year without a century (00..99)
 *   %Y - Year with century
 *   %H - Hour of the day, 24-hour clock (00..23)
 *   %k - Hour of the day, 24-hour clock without leading zero (0..23)
 *   %I - Hour of the day, 12-hour clock (01..12)
 *   %l - Hour of the day, 12-hour clock without leading zer (0..12)
 *   %p - Meridian indicator (``AM''  or  ``PM'')
 *   %P - Meridian indicator (``pm''  or  ``pm'')
 *   %M - Minute of the hour (00..59)
 *   %S - Second of the minute (00..60)
 *   %% - Literal ``%'' character
 *
 * Copyright (C) 2009 Nikolay V. Nemshilov aka St.
 */
Calendar.include({
  /**
   * Parses out the given string based on the current date formatting
   *
   * @param String string date
   * @return Date parsed date or null if it wasn't parsed
   */
  parse: function(string) {
    var date;
    
    if (string instanceof Date || Date.parse(string)) {
      date = new Date(string);
      
    } else if (isString(string) && string) {
      var tpl = RegExp.escape(this.options.format);
      var holders = tpl.match(/(^|[^%])%[a-z]/ig).map('match', /[a-z]$/i).map('first');
      var re  = new RegExp('^'+tpl.replace(/(^|[^%])(%[a-z])/ig, '$1(.+?)')+'$');
      
      var match = string.match(re);
      
      if (match) {
        match.shift();
        
        var year = null, month = null, date = null, hour = null, minute = null, second = null, meridian;
        
        while (match.length) {
          var value = match.shift();
          var key   = holders.shift();
          
          if (key.toLowerCase() == 'b') {
            month = this.options.i18n[key=='b' ? 'monthNamesShort' : 'monthNames'].indexOf(value);
          } else if (key.toLowerCase() == 'p') {
            meridian = value.toLowerCase();
          } else {
            value = value.toInt();
            switch(key) {
              case 'd': 
              case 'e': date   = value; break;
              case 'm': month  = value; break;
              case 'y': 
              case 'Y': year   = value; break;
              case 'H': 
              case 'k': 
              case 'I': 
              case 'l': hour   = value; break;
              case 'M': minute = value; break;
              case 'S': second = value; break;
            }
          }
        }
        
        // converting 1..12am|pm into 0..23 hours marker
        if (meridian) hour = (meridian == 'pm' ? hour + 12 : hour) - 1;
        
        date = new Date(year, month, date, hour, minute, second);
      }
    } else {
      date = new Date();
    }
    
    return date;
  },  
  
  /**
   * Formats the given date into a string depend on the current format
   *
   * @param Data data
   * @return String formatted data
   */
  format: function(date) {
    var i18n      = this.options.i18n;
    var day_num   = date.getDay();
    var month_num = date.getMonth();
    var date_num  = date.getDate();
    var year      = date.getFullYear();
    var hour      = date.getHours();
    var minute    = date.getMinutes();
    var second    = date.getSeconds();
    
    var values    = {
      a: i18n.dayNamesShort[day_num],
      A: i18n.dayNames[day_num],
      b: i18n.monthNamesShort[month_num],
      B: i18n.monthNames[month_num],
      d: (date_num < 10 ? '0' : '') + date_num,
      e: ''+date_num,
      m: (month_num < 9 ? '0' : '') + (month_num+1),
      y: (''+year).substring(2,4),
      Y: ''+year,
      H: (hour < 10 ? '0' : '')+ hour,
      k: '' + hour,
      I: '' + ((hour < 12 ? hour : hour - 11)+1),
      l: ((hour < 9 || (hour > 11 && hour < 21)) ? '0' : '') + ((hour < 12 ? hour : hour - 11)+1),
      p: hour < 12 ? 'AM' : 'PM',
      P: hour < 12 ? 'am' : 'pm',
      M: (minute < 10 ? '0':'')+minute,
      S: (second < 10 ? '0':'')+second,
      '%': '%'
    };
    
    var result = this.options.format;
    for (var key in values) {
      result = result.replace('%'+key, values[key]);
    }
    
    return result;
  }
});