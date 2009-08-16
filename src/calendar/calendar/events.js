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
   * Switches to one month forward
   *
   * @return Calendar this
   */
  next: function() {
    this.prevDate = new Date(this.prevDate || this.date);
    this.prevDate.setMonth(this.prevDate.getMonth() + 1);
    return this.update(this.prevDate);
  },
  
  /**
   * Switches to on month back
   *
   * @return Calendar this
   */
  prev: function() {
    this.prevDate = new Date(this.prevDate || this.date);
    this.prevDate.setMonth(this.prevDate.getMonth() - 1);
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
          this.select(cell.date);
        }
      }.bind(this));
    }, this);
    
    // connecting the bottom buttons
    this.nowButton.onClick(this.setDate.bind(this, new Date()));
    this.doneButton.onClick(this.done.bind(this));
    
    return this;
  }
});