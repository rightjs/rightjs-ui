/**
 * The tab panels behavior logic
 *
 * Copyright (C) Nikolay V. Nemshilov aka St.
 */
Tabs.Panel = new Class(Observer, {
  
  initialize: function(element, controller) {
    this.element = element.addClass('r-tabs-panel');
    this.controller = controller;
    
    this.id = element.id;
  },
  
  
  show: function() {
    this.element.radioClass('r-tabs-current');
  },
  
  // locks the panel with a spinner locker
  lock: function() {
    var locker  = $E('div', {'class': 'r-tabs-panel-locker'});
    var spinner = $E('div', {'class': 'r-tabs-panel-locker-spinner'}).insertTo(locker);
    var dots    = '1234'.split('').map(function(i) {
      return $E('div', {html: '&bull;', 'class': i == 1 ? 'glow':null}).insertTo(spinner);
    });
    
    (function() {
      spinner.insert(dots.last(), 'top');
      dots.unshift(dots.pop());
    }).periodical(400);
    
    this.element.insert(locker, 'top');
  },
  
  // updates the panel content
  update: function(content) {
    this.element.update(content||'');
    return this;
  }
});