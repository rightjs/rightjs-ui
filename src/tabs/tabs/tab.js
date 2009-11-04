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
    this.element    = element.addClass('right-tabs-tab');
    this.controller = controller;
    
    this.element.onMousedown(this.click.bind(this)).onClick('stopEvent');
    
    this.findLink();
      
    this.panel = new Tabs.Panel(controller.findPanel(this), this);
    
    // adding the 'close' icon onto the tab
    if (controller.options.closable) {
      this.link.insert($E('div', {
        'class': 'right-tabs-tab-close-icon', 'html': '&times;'
      }).onMousedown(this.remove.bind(this)).onClick('stopEvent'));
    }
  },
  
  click: function(event) {
    event.stop();
    return this.fire('click').show();
  },
  
  show: function() {
    if (this.enabled()) {
      var prev_tab = this.controller.tabs.first('current');
      if (prev_tab)  prev_tab.fire('hide');
      
      this.element.radioClass('right-tabs-current');
      this.controller.scrollToTab(this);
      this.panel.show();
      
      this.fire('show');
    }
    
    return this;
  },
  
  disable: function() {
    this.element.addClass('right-tabs-disabled');
    return this.fire('disable');
  },
  
  enable: function() {
    this.element.removeClass('right-tabs-disabled');
    return this.fire('enable');
  },
  
  disabled: function() {
    return !this.enabled();
  },
  
  enabled: function() {
    return !this.element.hasClass('right-tabs-disabled');
  },
  
  current: function() {
    return this.element.hasClass('right-tabs-current');
  },
  
  remove: function(event) {
    if (event) event.stop();
    
    // switching to the next available sibling
    if (this.current()) {
      var enabled = this.controller.tabs.filter('enabled');
      var sibling = enabled[enabled.indexOf(this) + 1] || enabled[enabled.indexOf(this)-1];
      
      if (sibling) {
        sibling.show();
      }
    }
    
    // removing the tab out of the list
    this.controller.tabs.splice(this.controller.tabs.indexOf(this), 1);
    this.element.remove();
    this.panel.remove();
    
    return this;
  },
  
// protected
  // returns the tab width, used for the scrolling calculations
  width: function() {
    return this.element.offsetWidth + this.element.getStyle('marginRight').toInt();
  },

  // the events firing wrapper
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