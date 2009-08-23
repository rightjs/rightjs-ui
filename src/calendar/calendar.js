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
      format:         'ISO', // a key out of the predefined formats or a format string
      showTime:       false,
      showButtons:    false,
      minDate:        null,
      maxDate:        null,
      firstDay:       1,     // 1 for Monday, 0 for Sunday
      fxDuration:     200,
      numberOfMonths: 1,     // a number or [x, y] greed definition
      timePeriod:     1,     // the timepicker minimal periods (in minutes, might be bigger than 60)
      checkTags:      '*',
      relName:        'calendar'
    },
    
    Formats: {
      ISO:    '%Y-%m-%d',
      POSIX:  '%Y/%m/%d',
      EUR:    '%d-%m-%Y',
      US:     '%m/%d/%Y'
    },
    
    i18n: {
      Done:  'Done',
      Now:   'Now',
      Next:  'Next Month',
      Prev:  'Previous Month',
      
      dayNames:        $w('Sunday Monday Tuesday Wednesday Thursday Friday Saturday'),
      dayNamesShort:   $w('Sun Mon Tue Wed Thu Fri Sat'),
      dayNamesMin:     $w('Su Mo Tu We Th Fr Sa'),
      monthNames:      $w('January February March April May June July August September October November December'),
      monthNamesShort: $w('Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec')
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
  setOptions: function(options) {
    this.$super(options);
    
    // merging the i18n tables
    this.options.i18n = {};
    for (var key in this.constructor.i18n) {
      this.options.i18n[key] = isArray(this.constructor.i18n[key]) ? this.constructor.i18n[key].clone() : this.constructor.i18n[key];
    }
    this.options.i18n = Object.merge(this.options.i18n, options||{});
    
    // defining the current days sequence
    this.options.dayNames = this.options.i18n.dayNamesMin;
    if (this.options.firstDay) {
      this.options.dayNames.push(this.options.dayNames.shift());
    }
    
    // the monthes table cleaning up
    if (!isArray(this.options.numberOfMonths)) {
      this.options.numberOfMonths = [this.options.numberOfMonths, 1];
    }
    
    // min/max dates preprocessing
    if (this.options.minDate) this.options.minDate = this.parse(this.options.minDate);
    if (this.options.maxDate) {
      this.options.maxDate = this.parse(this.options.maxDate);
      this.options.maxDate.setDate(this.options.maxDate.getDate() + 1);
    }
    
    // format catching up
    this.options.format = (this.constructor.Formats[this.options.format] || this.options.format).trim();
    
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
    this.element.hide('fade', {duration: this.options.fxDuration});
    return this;
  },
  
  /**
   * Shows the calendar
   *
   * @param Object {x,y} optional position
   * @return Calendar this
   */
  show: function(position) {
    this.element.show('fade', {duration: this.options.fxDuration});
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