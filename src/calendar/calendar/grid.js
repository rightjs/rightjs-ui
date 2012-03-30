/**
 * The calendar months grid unit
 *
 * Copyright (C) 2010-2012 Nikolay Nemshilov
 */
var Grid = new Class(Element, {
  /**
   * Constructor
   *
   * @param Object options
   * @return void
   */
  initialize: function(options) {
    this.$super('table', {'class': 'grid'});

    this.months = [];

    var tbody = new Element('tbody').insertTo(this), month;

    for (var y=0; y < options.numberOfMonths[1]; y++) {
      var row = new Element('tr').insertTo(tbody);
      for (var x=0; x < options.numberOfMonths[0]; x++) {
        this.months.push(month = new Month(options));
        new Element('td').insertTo(row).insert(month);
      }
    }
  },

  /**
   * Sets the months to the date
   *
   * @param Date date in the middle of the grid
   * @param the current date (might be different)
   * @return void
   */
  setDate: function(date, current_date) {
    var months = this.months, months_num = months.length;

    current_date = current_date || date;

    for (var i=-Math.ceil(months_num - months_num/2)+1,j=0; i < Math.floor(months_num - months_num/2)+1; i++,j++) {
      var month_date    = new Date(date);
      month_date.setDate(1);
      month_date.setMonth(date.getMonth() + i);
      months[j].setDate(month_date, current_date);
    }
  }
});
