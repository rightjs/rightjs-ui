/**
 * A shared module to create textual spinners
 *
 * Copyright (C) 2010-2011 Nikolay Nemshilov
 */
var Spinner = new RightJS.Class(RightJS.Element, {
  /**
   * Constructor
   *
   * @param Number optional spinner size (4 by default)
   * @return void
   */
  initialize: function(size) {
    this.$super('div', {'class': 'rui-spinner'});
    this.dots = [];

    for (var i=0; i < (size || 4); i++) {
      this.dots.push(new RightJS.Element('div'));
    }

    this.dots[0].addClass('glowing');
    this.insert(this.dots);
    RightJS(this.shift).bind(this).periodical(300);
  },

  /**
   * Shifts the spinner elements
   *
   * @return void
   */
  shift: function() {
    if (this.visible()) {
      var dot = this.dots.pop();
      this.dots.unshift(dot);
      this.insert(dot, 'top');
    }
  }
});
