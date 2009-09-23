/**
 * This module handles the events connection
 *
 * Copyright (C) 2009 Nikolay V. Nemshilov aka St.
 */
 
// the document keybindings hookup
document.onKeydown(function(event) {
 if (Calendar.current) {
   var name;

   switch(event.keyCode) {
     case 27: name = 'hide';      break;
     case 37: name = 'prevDay';   break;
     case 39: name = 'nextDay';   break;
     case 38: name = 'prevWeek';  break;
     case 40: name = 'nextWeek';  break;
     case 34: name = 'nextMonth'; break;
     case 33: name = 'prevMonth'; break;
     case 13:
        Calendar.current.select(Calendar.current.date);
        name = 'done';
        break;
   }

   if (name) {
     Calendar.current[name]();
     event.stop();
   }
 }
});
 
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
  
// protected

  // changes the current date according to the hash
  changeDate: function(hash) {
    var date = new Date(this.date);
    
    for (var key in hash) {
      date['set'+key](date['get'+key]() + hash[key]);
    }
    
    // checking the date range constrains
    if (!(
      (this.options.minDate && this.options.minDate > date) ||
      (this.options.maxDate && this.options.maxDate < date)
    )) this.date = date;
    
    return this.update(this.date);
  },
  
  connectEvents: function() {
    // connecting the monthes swapping
    this.prevButton.onClick(this.prevMonth.bind(this));
    this.nextButton.onClick(this.nextMonth.bind(this));
    
    // connecting the calendar day-cells
    this.element.select('div.right-calendar-month table tbody td').each(function(cell) {
      cell.onClick(function() {
        if (cell.innerHTML != '') {
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
    this.element.onClick(function(e) {e.stop();});
    
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