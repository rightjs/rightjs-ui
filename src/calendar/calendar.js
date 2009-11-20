/**
 * The calendar widget for RightJS
 *
 *
 * Copyright (C) 2009 Nikolay V. Nemshilov aka St.
 */
var Calendar = new Class(Observer, {
  extend: {
    EVENTS: $w('show hide select done'),
    
    Options: {
      format:         'ISO',  // a key out of the predefined formats or a format string
      showTime:       null,   // null for automatic, or true|false to enforce
      showButtons:    false,
      minDate:        null,
      maxDate:        null,
      firstDay:       1,      // 1 for Monday, 0 for Sunday
      fxName:         'fade', // set to null if you don't wanna any fx
      fxDuration:     200,
      numberOfMonths: 1,      // a number or [x, y] greed definition
      timePeriod:     1,      // the timepicker minimal periods (in minutes, might be bigger than 60)
      checkTags:      '*',
      relName:        'calendar',
      twentyFourHour: null,   // null for automatic, or true|false to enforce
      listYears:      false   // show/hide the years listing buttons
    },
    
    Formats: {
      ISO:            '%Y-%m-%d',
      POSIX:          '%Y/%m/%d',
      EUR:            '%d-%m-%Y',
      US:             '%m/%d/%Y'
    },
    
    i18n: {
      Done:           'Done',
      Now:            'Now',
      Next:           'Next Month',
      Prev:           'Previous Month',
      NextYear:       'Next Year',
      PrevYear:       'Prev Year',
      
      dayNames:        $w('Sunday Monday Tuesday Wednesday Thursday Friday Saturday'),
      dayNamesShort:   $w('Sun Mon Tue Wed Thu Fri Sat'),
      dayNamesMin:     $w('Su Mo Tu We Th Fr Sa'),
      monthNames:      $w('January February March April May June July August September October November December'),
      monthNamesShort: $w('Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec')
    },
    
    // scans for the auto-discoverable calendar inputs
    rescan: function() {
      var key       = Calendar.Options.relName;
      var rel_id_re = new RegExp(key+'\\[(.+?)\\]');

      $$(Calendar.Options.checkTags+'[rel*='+key+']').each(function(element) {
        var data     = element.get('data-'+key+'-options');
        var calendar = new Calendar(eval('('+data+')') || {});
        
        var rel_id   = element.get('rel').match(rel_id_re);
        if (rel_id) {
          var input = $(rel_id[1]);
          if (input) {
            calendar.assignTo(input, element);
          }
        } else {
          calendar.assignTo(element);
        }
      });
    }
  },
  
  /**
   * Basic constructor
   *
   * @param Object options
   */
  initialize: function(options) {
    this.$super(options);
    
    this.element = $E('div', {'class': 'right-calendar'});
    this.build().connectEvents().setDate(new Date());
  },
  
  /**
   * additional options processing
   *
   * @param Object options
   * @return Calendar this
   */
  setOptions: function(user_options) {
    this.$super(user_options);
    
    var klass   = this.constructor;
    var options = this.options;
    
    with (this.options) {
      // merging the i18n tables
      options.i18n = {};

      for (var key in klass.i18n) {
        i18n[key] = isArray(klass.i18n[key]) ? klass.i18n[key].clone() : klass.i18n[key];
      }
      $ext(i18n, (user_options || {}).i18n);
      
      // defining the current days sequence
      options.dayNames = i18n.dayNamesMin;
      if (firstDay) {
        dayNames.push(dayNames.shift());
      }
      
      // the monthes table cleaning up
      if (!isArray(numberOfMonths)) {
        numberOfMonths = [numberOfMonths, 1];
      }
      
      // min/max dates preprocessing
      if (minDate) minDate = this.parse(minDate);
      if (maxDate) {
        maxDate = this.parse(maxDate);
        maxDate.setDate(maxDate.getDate() + 1);
      }
      
      // format catching up
      format = (klass.Formats[format] || format).trim();
      
      // setting up the showTime option
      if (showTime === null) {
        showTime = format.search(/%[HkIl]/) > -1;
      }
      
      // setting up the 24-hours format
      if (twentyFourHour === null) {
        twentyFourHour = format.search(/%[Il]/) < 0;
      }
      
      // enforcing the 24 hours format if the time threshold is some weird number
      if (timePeriod > 60 && 12 % (timePeriod/60).ceil()) {
        twentyFourHour = true;
      }
    }

    return this;
  },
  
  /**
   * Sets the date on the calendar
   *
   * @param Date date or String date
   * @return Calendar this
   */
  setDate: function(date) {
    this.date = this.prevDate = this.parse(date);
    return this.update();
  },
  
  /**
   * Returns the current date on the calendar
   *
   * @return Date currently selected date on the calendar
   */
  getDate: function() {
    return this.date;
  },
  
  /**
   * Hides the calendar
   *
   * @return Calendar this
   */
  hide: function() {
    this.element.hide(this.options.fxName, {duration: this.options.fxDuration});
    Calendar.current = null;
    return this;
  },
  
  /**
   * Shows the calendar
   *
   * @param Object {x,y} optional position
   * @return Calendar this
   */
  show: function(position) {
    this.element.show(this.options.fxName, {duration: this.options.fxDuration});
    Calendar.current = this;
    return this;
  },
  
  /**
   * Inserts the calendar into the element making it inlined
   *
   * @param Element element or String element id
   * @param String optional position top/bottom/before/after/instead, 'bottom' is default
   * @return Calendar this
   */
  insertTo: function(element, position) {
    this.element.addClass('right-calendar-inline').insertTo(element, position);
    return this;
  }
});