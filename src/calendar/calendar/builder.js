/**
 * This module handles the calendar elemnts building/updating processes
 *
 * Copyright (C) 2009 Nikolay V. Nemshilov aka St.
 */
Calendar.include({
  /**
   * Handles the user's select even
   *
   * @param HTMLTableCell clicked cell
   * @return Calendar self
   */
  select: function(cell) {
    var date = null; // grab the data out of the cell
    
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
    element.select('tbody td').each('update', '').each('setClass', 'right-calendar-day-blank');
    
    for (var i=1; i <= days_number; i++) {
      date.setDate(i);
      var day_num = date.getDay();
      
      if (this.options.firstDay) {
        day_num = day_num ? day_num-1 : 6;
      }
      
      cells[day_num].update(i+'').setClass(cur_day == (date.getTime() / 86400000).ceil() ? 'right-calendar-day-selected' : '');
      
      if ((this.options.minDate && this.options.minDate > date) || (this.options.maxDate && this.options.maxDate < date))
        cells[day_num].setClass('right-calendar-day-disabled');
      
      if (day_num == 6) {
        cells = rows.shift().select('td');
      }
    }
    
    element.first('div.right-calendar-month-caption').update(this.options.i18n.monthNames[date.getMonth()]+" "+date.getFullYear());
  },

  // builds the calendar
  build: function() {
    this.prevButton = $E('div', {'class': 'right-calendar-prev-button', html: '&lsaquo;', title: this.options.i18n.Prev}).onClick(this.prev.bind(this));
    this.nextButton = $E('div', {'class': 'right-calendar-next-button', html: '&rsaquo;', title: this.options.i18n.Next}).onClick(this.next.bind(this));
    
    var greed = $E('table', {'class': 'right-calendar-greed'});
    
    for (var y=0; y < this.options.numberOfMonth[1]; y++) {
      var row   = $E('tr').insertTo(greed);
      for (var x=0; x < this.options.numberOfMonth[0]; x++) {
        $E('td').insertTo(row).insert(this.buildMonth());
      }
    }
    
    greed.select('div table tbody td').each(function(cell) { cell.onClick(this.select(cell)); }.bind(this));
    
    this.element.insert([
      this.nextButton, this.prevButton, greed
    ]);
    
    return this;
  },
  
  // builds a month block
  buildMonth: function() {
    return $E('div', {'class': 'right-calendar-month'}).insert([
      $E('div', {'class': 'right-calendar-month-caption'}),
      $E('table').insert(
        '<thead>'+
          '<tr>'+this.options.dayNames.map(function(name) {return '<th>'+name+'</th>';}).join('')+'</tr>'+
        '</thead><tbody>'+
          '123456'.split('').map(function() {return '<tr><td><td><td><td><td><td><td></tr>'}).join('')+
        '</tbody>'
      )
    ]);
  }

});