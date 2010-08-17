/**
 * Represents a single month block
 *
 * Copyright (C) 2010 Nikolay Nemshilov
 */
var Month = new Wrapper(Element, {
  /**
   * Constructor
   *
   * @param Object options
   * @return void
   */
  initialize: function(options) {
    this.$super('table', {'class': 'month'});
    this.options = options;
    
    // the caption (for the month name)
    this.insert(this.caption = new Element('caption'));
    
    // the headline for the day-names
    this.insert('<thead><tr>'+
      options.dayNames.map(function(name) {return '<th>'+ name +'</th>';}).join('') +
    '</tr></thead>');
    
    // the body with the day-cells
    this.days = [];
    
    var tbody = new Element('tbody').insertTo(this), x, y, row;
    
    for (y=0; y < 6; y++) {
      row = new Element('tr').insertTo(tbody);
      for (x=0; x < 7; x++) {
        this.days.push(new Element('td').insertTo(row));
      }
    }
    
    this.onClick(this.clicked);
  },
  
  /**
   * Initializes the month values by the date
   *
   * @param Date date
   * @return void
   */
  setDate: function(date, current_date) {
    // getting the number of days in the month
    date.setDate(32);
    var days_number = 32 - date.getDate();
    date.setMonth(date.getMonth()-1);
    
    var cur_day = Math.ceil(current_date.getTime() / 86400000),
        options = this.options, i18n = options.i18n, days = this.days;
    
    // resetting the first and last two weeks cells
    // because there will be some empty cells over there
    for (var i=0, len = days.length-1, one, two, tre; i < 7; i++) {
      one = days[i]._;
      two = days[len - i]._;
      tre = days[len - i - 7]._;
      
      one.innerHTML = two.innerHTML = tre.innerHTML = '';
      one.className = two.className = tre.className = 'blank';
    }
    
    // putting the actual day numbers in place
    for (var i=1, row=0, week, cell; i <= days_number; i++) {
      date.setDate(i);
      var day_num = date.getDay();
      
      if (options.firstDay === 1) { day_num = day_num > 0 ? day_num-1 : 6; }
      if (i === 1 || day_num === 0) {
        week = days.slice(row*7, row*7 + 7); row ++;
      }
      
      cell = week[day_num]._;
      
      if (Browser.OLD) { // IE6 has a nasty glitch with that
        cell.innerHTML = '';
        cell.appendChild(document.createTextNode(i));
      } else {
        cell.innerHTML = ''+i;
      }
      
      cell.className = cur_day === Math.ceil(date.getTime() / 86400000) ? 'selected' : '';
      
      if ((options.minDate && options.minDate > date) || (options.maxDate && options.maxDate < date)) {
        cell.className = 'disabled';
      }
        
      week[day_num].date = new Date(date);
    }
    
    // setting up the caption with the month name
    var caption = (options.listYears ?
          i18n.monthNamesShort[date.getMonth()] + ',' :
          i18n.monthNames[date.getMonth()])+
        ' '+date.getFullYear(),
        element = this.caption._;
    
    if (Browser.OLD) {
      element.innerHTML = '';
      element.appendChild(document.createTextNode(caption));
    } else {
      element.innerHTML = caption;
    }
  },
  
// protected

  /**
   * Handles clicks on the day-cells
   *
   * @param Event click event
   * @return void
   */
  clicked: function(event) {
    var target = event.target, date = target.date;
    
    if (target && date && !target.hasClass('disabled') && !target.hasClass('blank')) {
      target.addClass('selected');
      
      this.fire('date-set', {
        date:  date.getDate(),
        month: date.getMonth(),
        year:  date.getFullYear()
      });
    }
  }
});