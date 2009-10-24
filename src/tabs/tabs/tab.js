/**
 * A single tab handling object
 *
 * Copyright (C) 2009 Nikolay V. Nemshilov aka St.
 */
Tabs.Tab = new Class(Observer, {
  extend: {
    autoId: 0
  },
  
  initialize: function(element, controller) {
    this.element = element;
    this.controller = controller;
    
    this.element.onMousedown(this.click.bind(this)).onClick('stopEvent');
    
    this.findLink();
    
    this.panel = controller.panels.first(function(panel) {
      return panel.id == controller.options.idPrefix + this.id;
    }, this);
  },
  
  click: function(event) {
    event.stop();
    
    this.element.radioClass('r-tabs-current');
    this.panel.show();
    
    this.controller.fire('click', this);
  },
  
// protected
  
  // generates the automaticall id for the tab
  findLink: function() {
    this.link = this.element.first('a');
    this.id = this.link.href.split('#')[1] || (this.controller.options.idPrefix + (Tabs.Tab.autoId++));
  }
});