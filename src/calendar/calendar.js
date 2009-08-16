/**
 * The calendar widget for RightJS
 *
 *
 * @copyright (C) 2009 Nikolay V. Nemshilov aka St.
 */
var Calendar = new Class(Observer, {
  extend: {
    EVENTS: $w('show hide select change'),
    
    Options: {
      format:      'ISO_8601',
      showTime:    false,
      showButtons: false,
      minDate:     null,
      maxDate:     null,
      firstDay:    1,     // 1 for Monday, 0 for Sunday
      fxDuration:  200
    },
    
    Formats: {
      ISO_8601:  'yyyy-mm-dd',
      RFC_822:   'D, d M yy',
      RFC_850:   'DD, dd-M-yy',
      RFC_1036:  'D, d M yy',
      RFC_1123:  'D, d M yyyy',
      RFC_2822:  'D, d M yyyy',
      TIMESTAMP: '@'
    },
    
    i18n: {
      Done:  'Done',
      Now:   'Now',
      Next:  'Next Month',
      Prev:  'Previous Month',
      
      dayNames:        $w('Sunday Monday Tuesday Wednesday Thursday Friday Saturday'),
      dayNamesShort:   $w('Sun Mon Tue Wed Thu Fri Sat'),
      dayNamesMin:     $w('Su Mo Tu We Th Fr Sa'),
      monthNames:      $w('January February March April May June July August September October November December'),
      monthNamesShort: $w('Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec')
    }
  },
  
  /**
   * Basic constructor
   *
   * @param Object options
   */
  initialize: function(options) {
    this.$super(options);
    
    this.element = $E('div', {'class': 'right-calendar'});
    this.build().setDate(new Date());
  },
  
  /**
   * additional options processing
   *
   * @param Object options
   * @return Calendar this
   */
  setOptions: function(options) {
    this.$super(options);
    
    this.options.i18n = Object.merge(this.constructor.i18n, this.options.i18n);
    
    this.options.dayNames = this.options.i18n.dayNamesMin;
    
    if (this.options.firstDay) {
      this.options.dayNames.push(this.options.dayNames.shift());
    }
    
    return this;
  },
  
  /**
   * Sets the date on the calendar
   *
   * @param Date date or String date
   * @return Calendar this
   */
  setDate: function(date) {
    this.date = isString(date) ? Date.parse(date) : date;
    return this.update();
  },
  
  /**
   * Returns the current date on the calendar
   *
   * @param boolean if true, the result will be in a Date object
   * @return String formatted date or Date object
   */
  getDate: function() {
    return this.date;
  },
  
  /**
   * Hides the calendar
   *
   * @return Calendar this
   */
  hide: function() {
    this.element.hide('slide', {duration: this.options.fxDuration});
    return this;
  },
  
  /**
   * Shows the calendar
   *
   * @param Object {x,y} optional position
   * @return Calendar this
   */
  show: function(position) {
    this.element.show('slide', {duration: this.options.fxDuration});
    return this;
  },
  
  /**
   * Shows the calendar at the given element left-bottom corner
   *
   * @param Element element or String element id
   * @return Calendar this
   */
  showAt: function(element) {
    return this.show($(element).position());
  },
  
  /**
   * Inserts the calendar into the element making it inlined
   *
   * @param Element element or String element id
   * @param String optional position top/bottom/before/after/instead, 'bottom' is default
   * @return Calendar this
   */
  insertTo: function(element, position) {
    this.element.addClass('right-calendar-inline').insertTo(element, position);
    return this;
  },
  
  /**
   * Switches to one month forward
   *
   * @return Calendar this
   */
  next: function() {
    this.date.setMonth(this.date.getMonth() + 1);
    return this.update();
  },
  
  /**
   * Switches to on month back
   *
   * @return Calendar this
   */
  prev: function() {
    this.date.setMonth(this.date.getMonth() - 1);
    return this.update();
  },
  
// protected

  // updates the calendar view
  update: function(date) {
    var date = new Date((date || this.date).toGMTString());
    
    // getting the number of days in the month
    date.setDate(32);
    var days_number = 32 - date.getDate();
    date.setMonth(date.getMonth()-1);
    
    // collecting the elements to update
    var rows  = this.table.select('tbody tr');
    var cells = rows.shift().select('td');
    this.table.select('tbody td').each('update', '').each('setClass', 'right-calendar-day-blank');
    
    for (var i=1; i <= days_number; i++) {
      date.setDate(i);
      var day_num = date.getDay();
      
      if (this.options.firstDay) {
        day_num = day_num ? day_num-1 : 6;
      }
      
      cells[day_num].update(i+'').setClass('');
      
      if ((this.options.minDate && this.options.minDate > date) || (this.options.maxDate && this.options.maxDate < date))
        cells[day_num].setClass('right-calendar-day-disabled');
      
      if (day_num == 6) {
        cells = rows.shift().select('td');
      }
    }
    
    this.caption.update(this.options.i18n.monthNames[date.getMonth()]+" "+date.getFullYear());
  },

  build: function() {
    this.prevButton = $E('div', {'class': 'right-calendar-prev-button', html: '&lsaquo;', title: this.options.i18n.Prev}).onClick(this.prev.bind(this));
    this.nextButton = $E('div', {'class': 'right-calendar-next-button', html: '&rsaquo;', title: this.options.i18n.Next}).onClick(this.next.bind(this));
    this.caption    = $E('div', {'class': 'right-calendar-caption'});
    
    this.table = $E('table').insert(
      '<thead>'+
        '<tr>'+this.options.dayNames.map(function(name) {return '<th>'+name+'</th>';}).join('')+'</tr>'+
      '</thead><tbody>'+
        '123456'.split('').map(function() {return '<tr><td><td><td><td><td><td><td></tr>'}).join('')+
      '</tbody>'
    );
    
    this.element.insert([
      $E('div', {'class': 'right-calendar-header'}).insert([this.nextButton, this.prevButton, this.caption]),
      this.table
    ]);
    
    return this;
  }
});