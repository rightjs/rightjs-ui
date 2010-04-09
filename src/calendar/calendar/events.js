/**
 * This module handles the events connection
 *
 * Copyright (C) 2009-2010 Nikolay V. Nemshilov
 */ 
Calendar.include({
  /**
   * Initiates the 'select' event on the object
   *
   * @param Date date
   * @return Calendar this
   */
  select: function(date) {
    this.date = date;
    return this.fire('select', date);
  },
  
  /**
   * Covers the 'done' event fire
   *
   * @return Calendar this
   */
  done: function() {
    if (!this.element.hasClass('right-calendar-inline'))
      this.hide();
    return this.fire('done', this.date);
  },
  
  nextDay: function() {
    return this.changeDate({'Date': 1});
  },
  
  prevDay: function() {
    return this.changeDate({'Date': -1});
  },
  
  nextWeek: function() {
    return this.changeDate({'Date': 7});
  },
  
  prevWeek: function() {
    return this.changeDate({'Date': -7});
  },
  
  nextMonth: function() {
    return this.changeDate({Month: 1});
  },
  
  prevMonth: function() {
    return this.changeDate({Month: -1});
  },
  
  nextYear: function() {
    return this.changeDate({FullYear: 1});
  },
  
  prevYear: function() {
    return this.changeDate({FullYear: -1});
  },
  
// protected

  // changes the current date according to the hash
  changeDate: function(hash) {
    var date = new Date(this.date), options = this.options;
    
    for (var key in hash) {
      date['set'+key](date['get'+key]() + hash[key]);
    }
    
    // checking the date range constrains
    if (options.minDate && options.minDate > date) date = new Date(options.minDate);
    if (options.maxDate && options.maxDate < date) {
      date = new Date(options.maxDate);
      date.setDate(date.getDate() - 1);
    }
    return this.update(this.date = date);
  },
  
  connectEvents: function() {
    // connecting the monthes swapping
    this.prevButton.onClick(this.prevMonth.bind(this));
    this.nextButton.onClick(this.nextMonth.bind(this));
    if (this.nextYearButton) {
      this.prevYearButton.onClick(this.prevYear.bind(this));
      this.nextYearButton.onClick(this.nextYear.bind(this));
    }
    
    // connecting the calendar day-cells
    this.element.select('div.right-calendar-month table tbody td').each(function(cell) {
      cell.onClick(function() {
        if (cell.innerHTML != '' && !cell.hasClass('right-calendar-day-disabled')) {
          var prev = this.element.first('.right-calendar-day-selected');
          if (prev) prev.removeClass('right-calendar-day-selected');
          cell.addClass('right-calendar-day-selected');
          this.setTime(cell.date);
        }
      }.bind(this));
    }, this);
    
    // connecting the time picker events
    if (this.hours) {
      this.hours.on('change', this.setTime.bind(this));
      this.minutes.on('change', this.setTime.bind(this));
      if (!this.options.twentyFourHour) {
        this.meridian.on('change', this.setTime.bind(this));
      }
    }
    
    // connecting the bottom buttons
    if (this.nowButton) {
      this.nowButton.onClick(this.setDate.bind(this, new Date()));
      this.doneButton.onClick(this.done.bind(this));
    }
    
    // blocking all the events from the element
    this.element.onMousedown(function(e) { e.stopPropagation(); })
      .onClick(function(event) {
        event.stop();
        if (this.timer) {
          this.timer.cancel();
          this.timer = null;
        }
      }.bind(this));
    
    return this;
  },
  
  // sets the date without nucking the time
  setTime: function(date) {
    // from clicking a day in a month table
    if (date instanceof Date) {
      this.date.setYear(date.getFullYear());
      this.date.setMonth(date.getMonth());
      this.date.setDate(date.getDate());
    }
    
    if (this.hours) {
      this.date.setHours(this.hours.value.toInt() + (!this.options.twentyFourHour && this.meridian.value == 'pm' ? 12 : 0));
      this.date.setMinutes(this.minutes.value);
    }

    return this.select(this.date);
  }
  
});