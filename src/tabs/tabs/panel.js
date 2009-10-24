/**
 * The tab panels behavior logic
 *
 * Copyright (C) Nikolay V. Nemshilov aka St.
 */
Tabs.Panel = new Class(Observer, {
  
  initialize: function(element, controller) {
    this.element = element;
    this.controller = controller;
    
    this.id = element.id;
  },
  
  
  show: function() {
    this.element.radioClass('r-tabs-current');
  }
  
});