/**
 * The bottom-buttons block unit
 *
 * Copyright (C) 2010 Nikolay Nemshilov
 */
var Buttons = new Wrapper(Element, {
  /**
   * Constructor
   *
   * @param Object options
   * @return void
   */
  initialize: function(options) {
    this.$super('div', {'class': 'buttons'});
    
    this.insert([
      new Button(options.i18n.Now,  {'class': 'now'}).onClick('fire', 'now-clicked'),
      new Button(options.i18n.Done, {'class': 'done'}).onClick('fire', 'done-clicked')
    ]);
  }
});