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
      format:        'ISO_8601',
      showTime:      false,
      showButtons:   false,
      minDate:       null,
      maxDate:       null,
      firstDay:      1,     // 1 for Monday, 0 for Sunday
      fxDuration:    200,
      numberOfMonth: 1      // a number or [x, y] greed definition
    },
    
    Formats: {
      ISO_8601:  'yyyy-mm-dd',
      RFC_822:   'D, d M yy',
      RFC_850:   'DD, dd-M-yy',
      RFC_1036:  'D, d M yy',
      RFC_1123:  'D, d M yyyy',
      RFC_2822:  'D, d M yyyy',
      TIMESTAMP: '@'
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
    
    this.options.i18n = {};
    for (var key in this.constructor.i18n) {
      this.options.i18n[key] = isArray(this.constructor.i18n[key]) ? this.constructor.i18n[key].clone() : this.constructor.i18n[key];
    }
    this.options.i18n = Object.merge(this.options.i18n, options||{});
    
    this.options.dayNames = this.options.i18n.dayNamesMin;
    
    if (this.options.firstDay) {
      this.options.dayNames.push(this.options.dayNames.shift());
    }
    
    if (!isArray(this.options.numberOfMonth)) {
      this.options.numberOfMonth = [this.options.numberOfMonth, 1];
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
    this.date = new Date(date);
    return this.update();
  },
  
  /**
   * Returns the current date on the calendar
   *
   * @param boolean if true, the result will be in a Date object
   * @return String formatted date or Date object
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