/**
 * This module handles the events connection
 *
 * Copyright (C) 2009 Nikolay V. Nemshilov aka St.
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
  
  /**
   * Switches to one month forward
   *
   * @return Calendar this
   */
  next: function() {
    this.prevDate = new Date(this.prevDate || this.date);
    
    if (this.hasNextMonth) {
      this.prevDate.setMonth(this.prevDate.getMonth() + 1);
    }
    return this.update(this.prevDate);
  },
  
  /**
   * Switches to on month back
   *
   * @return Calendar this
   */
  prev: function() {
    this.prevDate = new Date(this.prevDate || this.date);
    
    if (this.hasPrevMonth) {
      this.prevDate.setMonth(this.prevDate.getMonth() - 1);
    }
    return this.update(this.prevDate);
  },
// protected
  
  connectEvents: function() {
    // connecting the monthes swapping
    this.prevButton.onClick(this.prev.bind(this));
    this.nextButton.onClick(this.next.bind(this));
    
    // connecting the calendar day-cells
    this.element.select('div.right-calendar-month table tbody td').each(function(cell) {
      cell.onClick(function() {
        if (cell.innerHTML != '') {
          var prev = this.element.first('.right-calendar-day-selected');
          if (prev) prev.removeClass('right-calendar-day-selected');
          cell.addClass('right-calendar-day-selected');
          this.setDay(cell.date);
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
    this.element.onClick(function(e) {e.stop();});
    
    return this;
  },
  
  // sets the date without nucking the time
  setDay: function(date) {
    this.date.setYear(date.getFullYear());
    this.date.setMonth(date.getMonth());
    this.date.setDate(date.getDate());
    return this.select(this.date);
  },
  
  setTime: function() {
    var hour = this.hours.value.toInt() + (!this.options.twentyFourHour && this.meridian.value == 'pm' ? 12 : 0);
    this.date.setHours(hour);
    this.date.setMinutes(this.minutes.value);

    return this.select(this.date);
  }
  
});