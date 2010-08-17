/**
 * The calendar month/year swapping buttons block
 *
 * Copyright (C) 2010 Nikolay Nemshilov
 */
var Swaps = new Wrapper(Element, {
  /**
   * Constructor
   *
   * @param Object options
   * @return void
   */
  initialize: function(options) {
    this.$super('div', {'class': 'swaps'});
    this.options = options;
    
    var i18n = options.i18n;
    
    this.insert([
      this.prevMonth = new Button('&lsaquo;', {title: i18n.PrevMonth, 'class': 'prev-month'}),
      this.nextMonth = new Button('&rsaquo;', {title: i18n.NextMonth, 'class': 'next-month'})
    ]);
    
    if (options.listYears) {
      this.insert([
        this.prevYear = new Button('&laquo;', {title: i18n.PrevYear, 'class': 'prev-year'}),
        this.nextYear = new Button('&raquo;', {title: i18n.NextYear, 'class': 'next-year'})
      ]);
    }
    
    this.buttons = R([this.prevMonth, this.nextMonth, this.prevYear, this.nextYear]).compact();
    
    this.onClick(this.clicked);
  },
  
  /**
   * Changes the swapping buttons state depending on the options and the current date
   *
   * @param Date date
   * @return void
   */
  setDate: function(date) {
    var options = this.options, months_num = options.numberOfMonths[0] * options.numberOfMonths[1],
        has_prev_year = true, has_next_year = true, has_prev_month = true, has_next_month = true;
    
    if (options.minDate) {
      var beginning = new Date(date.getFullYear(),0,1,0,0,0);
      var min_date = new Date(options.minDate.getFullYear(),0,1,0,0,0);
      
      has_prev_year = beginning > min_date;
      
      beginning.setMonth(date.getMonth() - Math.ceil(months_num - months_num/2));
      min_date.setMonth(options.minDate.getMonth());
      
      has_prev_month = beginning >= min_date;
    }
    
    if (options.maxDate) {
      var end = new Date(date);
      var max_date = new Date(options.maxDate);
      var dates = R([end, max_date]);
      dates.each(function(date) {
        date.setDate(32);
        date.setMonth(date.getMonth() - 1);
        date.setDate(32 - date.getDate());
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
        date.setMilliseconds(0);
      });
      
      has_next_month = end < max_date;
      
      // checking the next year
      dates.each('setMonth', 0);
      has_next_year = end < max_date;
    }
    
    this.nextMonth[has_next_month ? 'enable':'disable']();
    this.prevMonth[has_prev_month ? 'enable':'disable']();
    
    if (this.nextYear) {
      this.nextYear[has_next_year ? 'enable':'disable']();
      this.prevYear[has_prev_year ? 'enable':'disable']();
    }
  },
  
// protected

  // handles the clicks on the 
  clicked: function(event) {
    var target = event.target;
    if (target && this.buttons.include(target)) {
      if (target.enabled()) {
        this.fire(target.get('className').split(/\s+/)[0]);
      }
    }
  }
});