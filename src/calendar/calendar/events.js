/**
 * This module handles the events connection
 *
 * Copyright (C) 2009-2010 Nikolay Nemshilov
 */
Calendar.include({

// protected

  // connects the events with handlers
  initEvents: function() {
    var shift = '_shiftDate', terminate = this._terminate;

    this.on({
      // the dates/months/etc listing events
      'prev-day':     [shift, {Date:     -1}],
      'next-day':     [shift, {Date:      1}],
      'prev-week':    [shift, {Date:     -7}],
      'next-week':    [shift, {Date:      7}],
      'prev-month':   [shift, {Month:    -1}],
      'next-month':   [shift, {Month:     1}],
      'prev-year':    [shift, {FullYear: -1}],
      'next-year':    [shift, {FullYear:  1}],

      // the date/time picking events
      'date-set':     this._changeDate,
      'time-set':     this._changeTime,

      // the bottom buttons events
      'now-clicked':  this._setNow,
      'done-clicked': this.done,

      // handling the clicks
      'click':        terminate,
      'mousedown':    terminate,
      'focus':        terminate,
      'blur':         terminate
    });
  },

  // shifts the date according to the params
  _shiftDate: function(params) {
    var date = new Date(this.date), options = this.options;

    // shifting the date according to the params
    for (var key in params) {
      date['set'+key](date['get'+key]() + params[key]);
    }

    this.setDate(date);
  },

  // changes the current date (not the time)
  _changeDate: function(event) {
    var date = new Date(this.date);

    date.setDate(event.date);
    date.setMonth(event.month);
    date.setFullYear(event.year);

    this.setDate(date, true); // <- `true` means just change the date without shifting the list

    if (this.options.hideOnPick) {
      this.done();
    }
  },

  // changes the current time (not the date)
  _changeTime: function(event) {
    var date = new Date(this.date);

    date.setHours(event.hours);
    date.setMinutes(event.minutes);

    this.setDate(date);
  },

  // resets the calendar to the current time
  _setNow: function() {
    this.setDate(new Date());
  },

  /** simply stops the event so we didn't bother the things outside of the object
   *
   * @param {Event} event
   * @return void
   * @private
   */
  _terminate: function(event) {
    event.stopPropagation(); // don't let the clicks go anywere out of the clanedar

    if (this._hide_delay) {
      this._hide_delay.cancel();
      this._hide_delay = null;
    }
  }
});
