/**
 * This module handles the calendar elemnts building/updating processes
 *
 * Copyright (C) 2009 Nikolay V. Nemshilov aka St.
 */
Calendar.include({
  
// protected
  
  // updates the calendar view
  update: function(date) {
    var date = new Date(date || this.date);
    
    var monthes     = this.element.select('div.right-calendar-month');
    var monthes_num = monthes.length;
    
    for (var i=-(monthes_num - monthes_num/2).ceil()+1; i < (monthes_num - monthes_num/2).floor()+1; i++) {
      var month_date    = new Date(date);
      month_date.setMonth(date.getMonth() + i);
      
      this.updateMonth(monthes.shift(), month_date);
    }
    
    this.updateNextPrevMonthButtons(date, monthes_num);
    
    if (this.options.showTime) {
      this.hours.value = this.options.timePeriod < 60 ? date.getHours() :
        (date.getHours()/(this.options.timePeriod/60)).round() * (this.options.timePeriod/60);
      
      this.minutes.value = (date.getMinutes() / (this.options.timePeriod % 60)).round() * this.options.timePeriod;
    }
    
    return this;
  },
  
  // updates a single month-block with the given date
  updateMonth: function(element, date) {
    // getting the number of days in the month
    date.setDate(32);
    var days_number = 32 - date.getDate();
    date.setMonth(date.getMonth()-1);
    
    var cur_day = (this.date.getTime() / 86400000).ceil();
    
    // collecting the elements to update
    var rows  = element.select('tbody tr');
    var cells = rows.shift().select('td');
    element.select('tbody td').each(function(td) {
      td.innerHTML = '';
      td.className = 'right-calendar-day-blank';
    });
    
    for (var i=1; i <= days_number; i++) {
      date.setDate(i);
      var day_num = date.getDay();
      
      if (this.options.firstDay) {
        day_num = day_num ? day_num-1 : 6;
      }
      
      cells[day_num].innerHTML = ''+i;
      cells[day_num].className = cur_day == (date.getTime() / 86400000).ceil() ? 'right-calendar-day-selected' : '';
      
      if ((this.options.minDate && this.options.minDate > date) || (this.options.maxDate && this.options.maxDate < date))
        cells[day_num].className = 'right-calendar-day-disabled';
        
      cells[day_num].date = new Date(date);
      
      if (day_num == 6) {
        cells = rows.shift().select('td');
      }
    }
    
    var caption = (this.options.listYears ? this.options.i18n.monthNamesShort[date.getMonth()] + ',' :
      this.options.i18n.monthNames[date.getMonth()])+' '+date.getFullYear();
    
    element.first('div.right-calendar-month-caption').update(caption);
  },
  
  updateNextPrevMonthButtons: function(date, monthes_num) {
    if (this.options.minDate) {
      var beginning = new Date(date.getFullYear(),0,1,0,0,0);
      var min_date = new Date(this.options.minDate.getFullYear(),0,1,0,0,0);
      
      this.hasPrevYear = beginning > min_date;
      
      beginning.setMonth(date.getMonth() - (monthes_num - monthes_num/2).ceil());
      min_date.setMonth(this.options.minDate.getMonth());
      
      this.hasPrevMonth = beginning >= min_date;
    } else {
      this.hasPrevMonth = this.hasPrevYear = true;
    }
    
    if (this.options.maxDate) {
      var end = new Date(date);
      var max_date = new Date(this.options.maxDate);
      [end, max_date].each(function(date) {
        date.setDate(32);
        date.setMonth(date.getMonth() - 1);
        date.setDate(32 - date.getDate());
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
        date.setMilliseconds(0);
      });
      
      this.hasNextMonth = end < max_date;
      
      // checking the next year
      [end, max_date].each('setMonth', 0);
      this.hasNextYear = end < max_date;
    } else {
      this.hasNextMonth = this.hasNextYear = true;
    }
    
    this.nextButton[this.hasNextMonth ? 'removeClass':'addClass']('right-ui-button-disabled');
    this.prevButton[this.hasPrevMonth ? 'removeClass':'addClass']('right-ui-button-disabled');
    
    if (this.nextYearButton) {
      this.nextYearButton[this.hasNextYear ? 'removeClass':'addClass']('right-ui-button-disabled');
      this.prevYearButton[this.hasPrevYear ? 'removeClass':'addClass']('right-ui-button-disabled');
    }
  },

  // builds the calendar
  build: function() {
    this.buildSwaps();
    
    // building the calendars greed
    var greed = tbody = $E('table', {'class': 'right-calendar-greed'}).insertTo(this.element);
    if (Browser.OLD) tbody = $E('tbody').insertTo(greed);
    
    for (var y=0; y < this.options.numberOfMonths[1]; y++) {
      var row   = $E('tr').insertTo(tbody);
      for (var x=0; x < this.options.numberOfMonths[0]; x++) {
        $E('td').insertTo(row).insert(this.buildMonth());
      }
    }
    
    if (this.options.showTime) this.buildTime();
    this.buildButtons();
    
    return this;
  },
  
  // builds the monthes swapping buttons
  buildSwaps: function() {
    this.prevButton = $E('div', {'class': 'right-ui-button right-calendar-prev-button',
        html: '&lsaquo;', title: this.options.i18n.Prev}).insertTo(this.element);
    this.nextButton = $E('div', {'class': 'right-ui-button right-calendar-next-button',
        html: '&rsaquo;', title: this.options.i18n.Next}).insertTo(this.element);
        
    if (this.options.listYears) {
      this.prevYearButton = $E('div', {'class': 'right-ui-button right-calendar-prev-year-button',
        html: '&laquo;', title: this.options.i18n.PrevYear}).insertTo(this.prevButton, 'after');
      this.nextYearButton = $E('div', {'class': 'right-ui-button right-calendar-next-year-button',
        html: '&raquo;', title: this.options.i18n.NextYear}).insertTo(this.nextButton, 'before');
    }
  },
  
  // builds a month block
  buildMonth: function() {
    return $E('div', {'class': 'right-calendar-month'}).insert(
      '<div class="right-calendar-month-caption"></div>'+
      '<table><thead><tr>'+
        this.options.dayNames.map(function(name) {return '<th>'+name+'</th>';}).join('')+
      '</tr></thead><tbody>'+
          '123456'.split('').map(function() {return '<tr><td><td><td><td><td><td><td></tr>'}).join('')+
      '</tbody></table>'
    );
  },
  
  // builds the time selection block
  buildTime: function() {
    var time_picker = $E('div', {'class': 'right-calendar-time', html: ':'}).insertTo(this.element);
    
    this.hours = $E('select').insertTo(time_picker, 'top');
    this.minutes = $E('select').insertTo(time_picker);
    
    var minutes_threshold = this.options.timePeriod < 60 ? this.options.timePeriod : 60;
    var hours_threshold   = this.options.timePeriod < 60 ? 1 : (this.options.timePeriod / 60).ceil();
    
    (60).times(function(i) {
      var caption = (i < 10 ? '0' : '') + i;
      
      if (i < 24 && i % hours_threshold == 0) {
        if (this.options.twentyFourHour)
          this.hours.insert($E('option', {value: i, html: caption}));
        else if (i < 12) {
          this.hours.insert($E('option', {value: i, html: i == 0 ? 12 : i}));
        }
      }
      
      if (i % minutes_threshold == 0) {
        this.minutes.insert($E('option', {value: i, html: caption}));
      }
    }, this);
    
    // adding the meridian picker if it's a 12 am|pm picker
    if (!this.options.twentyFourHour) {
      this.meridian = $E('select').insertTo(time_picker);
      
      (this.options.format.includes(/%P/) ? ['am', 'pm'] : ['AM', 'PM']).each(function(value) {
        this.meridian.insert($E('option', {value: value.toLowerCase(), html: value}));
      }, this);
    }
  },
  
  // builds the bottom buttons block
  buildButtons: function() {
    if (!this.options.showButtons) return;
    
    this.nowButton = $E('div', {'class': 'right-ui-button right-calendar-now-button', html: this.options.i18n.Now});
    this.doneButton = $E('div', {'class': 'right-ui-button right-calendar-done-button', html: this.options.i18n.Done});
    
    $E('div', {'class': 'right-ui-buttons right-calendar-buttons'})
      .insert([this.doneButton, this.nowButton]).insertTo(this.element);
  }

});