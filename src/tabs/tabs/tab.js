/**
 * A single tab handling object
 *
 * Copyright (C) 2009 Nikolay V. Nemshilov aka St.
 */
Tabs.Tab = new Class({
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
    return this.fire('click').disabled() ? this : this.show();
  },
  
  show: function() {
    this.element.radioClass('r-tabs-current');
    this.controller.scrollToTab(this);
    this.panel.show();
    
    this.controller.tabs.each(function(tab) {
      if (tab != this) tab.fire('hide');
    }, this);
    
    return this.fire('show');
  },
  
  disable: function() {
    this.element.addClass('r-tabs-disabled');
    return this.fire('disable');
  },
  
  enable: function() {
    this.element.removeClass('r-tabs-disabled');
    return this.fire('enable');
  },
  
  disabled: function() {
    return !this.enabled();
  },
  
  enabled: function() {
    return !this.element.hasClass('r-tabs-disabled');
  },
  
  current: function() {
    return this.element.hasClass('r-tabs-current');
  },
  
  // returns the tab width, used for the scrolling calculations
  width: function() {
    return this.element.offsetWidth + this.element.getStyle('marginRight').toInt();
  },
  
// protected

  fire: function(event) {
    this.controller.fire(event, this);
    return this;
  },
  
  // generates the automaticall id for the tab
  findLink: function() {
    this.link = this.element.first('a');
    this.id = this.link.href.split('#')[1] || (this.controller.options.idPrefix + (Tabs.Tab.autoId++));
  }
});