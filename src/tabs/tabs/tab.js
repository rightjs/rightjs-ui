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
    this.element    = element.addClass('r-tabs-tab');
    this.controller = controller;
    
    this.element.onMousedown(this.click.bind(this)).onClick('stopEvent');
    
    this.findLink();
    
    var panel_id = controller.options.idPrefix + this.id
    var panel = $(panel_id) || $E(controller.element.tagName == 'UL' ? 'LI' : 'DIV',
      {id: panel_id}).insertTo(controller.element);
      
    this.panel = new Tabs.Panel(panel, controller);
    
    // adding the 'remove' icon onto the tab
    if (controller.options.removable) {
      this.link.insert($E('div', {
        'class': 'r-tabs-tab-close-icon', 'html': '&times;'
      }).onMousedown(this.remove.bind(this)).onClick('stopEvent'), 'top');
    }
  },
  
  click: function(event) {
    event.stop();
    return this.fire('click').show();
  },
  
  show: function() {
    if (this.enabled()) {
      this.element.radioClass('r-tabs-current');
      this.controller.scrollToTab(this);
      this.panel.show();

      this.controller.tabs.each(function(tab) {
        if (tab != this) tab.fire('hide');
      }, this);
      
      this.fire('show');
    }
    
    return this;
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
  
  remove: function(event) {
    if (event) event.stop();
    
    this.element.remove();
    this.panel.remove();
    
    if (this.current()) {
      var enabled = this.controller.tabs.filter('enabled');
      var sibling = enabled[enabled.indexOf(this) + 1] || enabled[enabled.indexOf(this)-1];
      
      if (sibling) {
        sibling.show();
      }
    }
    
    // removing the tab out of the list
    this.controller.tabs.splice(this.controller.tabs.indexOf(this), 1);
    
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