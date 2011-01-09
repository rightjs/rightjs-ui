/**
 * The time-picker block unit
 *
 * Copyright (C) 2010-2011 Nikolay Nemshilov
 */
var Timepicker = new Class(Element, {
  /**
   * Constructor
   *
   * @param Object options
   * @return void
   */
  initialize: function(options) {
    this.$super('div', {'class': 'timepicker'});
    this.options = options;

    var on_change = R(this.timeChanged).bind(this);

    this.insert([
      this.hours   = new Element('select').onChange(on_change),
      this.minutes = new Element('select').onChange(on_change)
    ]);

    var minutes_threshold = options.timePeriod < 60 ? options.timePeriod : 60;
    var hours_threshold   = options.timePeriod < 60 ? 1 : Math.ceil(options.timePeriod / 60);

    for (var i=0; i < 60; i++) {
      var caption = zerofy(i);

      if (i < 24 && i % hours_threshold == 0) {
        if (options.twentyFourHour) {
          this.hours.insert(new Element('option', {value: i, html: caption}));
        } else if (i < 12) {
          this.hours.insert(new Element('option', {value: i, html: i == 0 ? 12 : i}));
        }
      }

      if (i % minutes_threshold == 0) {
        this.minutes.insert(new Element('option', {value: i, html: caption}));
      }
    }


    // adding the meridian picker if it's a 12 am|pm picker
    if (!options.twentyFourHour) {
      this.meridian = new Element('select').onChange(on_change).insertTo(this);

      R(R(options.format).includes(/%P/) ? ['am', 'pm'] : ['AM', 'PM']).each(function(value) {
        this.meridian.insert(new Element('option', {value: value.toLowerCase(), html: value}));
      }, this);
    }
  },

  /**
   * Sets the time-picker values by the data
   *
   * @param Date date
   * @return void
   */
  setDate: function(date) {
    var options = this.options;
    var hour = options.timePeriod < 60 ? date.getHours() :
      Math.round(date.getHours()/(options.timePeriod/60)) * (options.timePeriod/60);
    var minute = Math.round(date.getMinutes() / (options.timePeriod % 60)) * options.timePeriod;

    if (this.meridian) {
      this.meridian.setValue(hour < 12 ? 'am' : 'pm');
      hour = (hour == 0 || hour == 12) ? 12 : hour > 12 ? (hour - 12) : hour;
    }

    this.hours.setValue(hour);
    this.minutes.setValue(minute);
  },

// protected

  /**
   * Handles the time-picking events
   *
   * @return void
   */
  timeChanged: function(event) {
    event.stopPropagation();

    var hours   = parseInt(this.hours.value());
    var minutes = parseInt(this.minutes.value());

    if (this.meridian) {
      if (hours == 12) {
        hours = 0;
      }
      if (this.meridian.value() == 'pm') {
        hours += 12;
      }
    }

    this.fire('time-set', {hours: hours, minutes: minutes});
  }
});
