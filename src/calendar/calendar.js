/**
 * The calendar widget for RightJS
 *
 * Copyright (C) 2009-2011 Nikolay Nemshilov
 */
var Calendar = new Widget({
  include: [Toggler, Assignable],

  extend: {
    version: '2.3.0',

    EVENTS: $w('show hide change done'),

    Options: {
      format:         'ISO',  // a key out of the predefined formats or a format string

      showTime:       null,   // null for automatic, or true|false to enforce
      showButtons:    false,  // show the bottom buttons

      minDate:        false,  // the minimal date available
      maxDate:        false,  // the maximal date available

      fxName:         'fade',  // set to null if you don't wanna any fx
      fxDuration:     'short', // the fx-duration

      firstDay:       1,      // 1 for Monday, 0 for Sunday
      numberOfMonths: 1,      // a number or [x, y] greed definition
      timePeriod:     1,      // the timepicker minimal periods (in minutes, might be bigger than 60)

      twentyFourHour: null,   // null for automatic, or true|false to enforce
      listYears:      false,  // show/hide the years listing buttons

      hideOnPick:     false,  // hides the popup when the user changes a day

      update:         null,   // a reference to an input element to assign to
      trigger:        null,   // a reference to a trigger element that would be paired too

      highlight:      null,   // a list of dates to highlight

      cssRule:        '*[data-calendar]' // css rule for calendar related elements
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
      NextMonth:      'Next Month',
      PrevMonth:      'Previous Month',
      NextYear:       'Next Year',
      PrevYear:       'Previous Year',

      dayNames:        $w('Sunday Monday Tuesday Wednesday Thursday Friday Saturday'),
      dayNamesShort:   $w('Sun Mon Tue Wed Thu Fri Sat'),
      dayNamesMin:     $w('Su Mo Tu We Th Fr Sa'),
      monthNames:      $w('January February March April May June July August September October November December'),
      monthNamesShort: $w('Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec')
    },

    current:   null,

    // hides all the popup calendars
    hideAll: function(that_one) {
      $$('div.rui-calendar').each(function(element) {
        if (element instanceof Calendar && element !== that_one && element.visible() && !element.inlined()) {
          element.hide();
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
    this.$super('calendar', options);
    this.addClass('rui-panel');

    options = this.options;

    this.insert([
      this.swaps = new Swaps(options),
      this.greed = new Greed(options)
    ]);

    if (options.showTime) {
      this.insert(this.timepicker = new Timepicker(options));
    }

    if (options.showButtons) {
      this.insert(this.buttons = new Buttons(options));
    }

    this.setDate(new Date()).initEvents();
  },

  /**
   * Sets the date on the calendar
   *
   * NOTE: if it's `true` then it will change the date but
   *       won't shift the months greed (used in the days picking)
   *
   * @param Date date or String date
   * @param Boolean no-shifting mode
   * @return Calendar this
   */
  setDate: function(date, no_shift) {
    if ((date = this.parse(date))) {
      var options = this.options;

      // checking the date range constrains
      if (options.minDate && options.minDate > date) {
        date = new Date(options.minDate);
      }
      if (options.maxDate && options.maxDate < date) {
        date = new Date(options.maxDate);
        date.setDate(date.getDate() - 1);
      }

      // setting the dates greed
      this._date = no_shift ? new Date(this._date || this.date) : null;
      this.greed.setDate(this._date || date, date);

      // updating the shifters state
      if (options.minDate || options.maxDate) {
        this.swaps.setDate(date);
      }

      // updating the time-picker
      if (this.timepicker && !no_shift) {
        this.timepicker.setDate(date);
      }

      if (date != this.date) {
        this.fire('change', {date: this.date = date});
      }
    }

    return this;
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
   * Sets the value as a string
   *
   * @param String value
   * @return Calendar this
   */
  setValue: function(value) {
    return this.setDate(value);
  },

  /**
   * Returns the value as a string
   *
   * @param String optional format
   * @return String formatted date
   */
  getValue: function(format) {
    return this.format(format);
  },

  /**
   * Inserts the calendar into the element making it inlined
   *
   * @param Element element or String element id
   * @param String optional position top/bottom/before/after/instead, 'bottom' is default
   * @return Calendar this
   */
  insertTo: function(element, position) {
    this.addClass('rui-calendar-inline');
    return this.$super(element, position);
  },

  /**
   * Marks it done
   *
   * @return Calendar this
   */
  done: function() {
    if (!this.inlined()) {
      this.hide();
    }

    this.fire('done', {date: this.date});
  },

  /**
   * Checks if the calendar is inlined
   *
   * @return boolean check
   */
  inlined: function() {
    return this.hasClass('rui-calendar-inline');
  },

// protected

  /**
   * additional options processing
   *
   * @param Object options
   * @return Calendar this
   */
  setOptions: function(user_options) {
    user_options = user_options || {};
    this.$super(user_options, $(user_options.trigger || user_options.update));

    var klass   = this.constructor, options = this.options;

    // merging the i18n tables
    options.i18n = {};

    for (var key in klass.i18n) {
      options.i18n[key] = isArray(klass.i18n[key]) ? R(klass.i18n[key]).clone() : klass.i18n[key];
    }
    $ext(options.i18n, user_options.i18n);

    // defining the current days sequence
    options.dayNames = options.i18n.dayNamesMin;
    if (options.firstDay) {
      options.dayNames.push(options.dayNames.shift());
    }

    // the monthes table cleaning up
    if (!isArray(options.numberOfMonths)) {
      options.numberOfMonths = [options.numberOfMonths, 1];
    }

    // min/max dates preprocessing
    if (options.minDate) {
      options.minDate = this.parse(options.minDate);
    }
    if (options.maxDate) {
      options.maxDate = this.parse(options.maxDate);
      options.maxDate.setDate(options.maxDate.getDate() + 1);
    }

    // format catching up
    options.format = R(klass.Formats[options.format] || options.format).trim();

    // setting up the showTime option
    if (options.showTime === null) {
      options.showTime = options.format.search(/%[HkIl]/) > -1;
    }

    // setting up the 24-hours format
    if (options.twentyFourHour === null) {
      options.twentyFourHour = options.format.search(/%[Il]/) < 0;
    }

    // enforcing the 24 hours format if the time threshold is some weird number
    if (options.timePeriod > 60 && 12 % Math.ceil(options.timePeriod/60)) {
      options.twentyFourHour = true;
    }

    if (options.update) {
      this.assignTo(options.update, options.trigger);
    }

    if (isArray(options.highlight)) {
      options.highlight = R(options.highlight).map(function(date) {
        return isString(date) ? this.parse(date) : date;
      }, this);
    }

    return this;
  },

  /**
   * hides all the other calendars on the page
   *
   * @return Calendar this
   */
  hideOthers: function() {
    Calendar.hideAll(this);
    return this;
  }
});
