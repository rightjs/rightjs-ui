/**
 * A single tab handling object
 *
 * Copyright (C) 2009-2010 Nikolay Nemshilov
 */
var Tab = Tabs.Tab = new Wrapper(Element, {
  extend: {
    autoId: 0
  },
  
  /**
   * Constructor
   *
   * @param Element the tab's element
   * @param Tabs the main element
   * @return void
   */
  initialize: function(element, main) {
    this.$super(element._);
    this.addClass('rui-tabs-tab');
    
    this.main  = main;
    this.link  = this.first('a');
    this.id    = this.link.get('href').split('#')[1] || Tab.autoId++;
    this.panel = new Panel(this.findPanel(), this);
    
    if (this.current()) {
      this.select();
    }
    
    // adding the 'close' icon onto the tab if needed
    if (main.options.closable) {
      this.link.insert($E('div', {
        'class': 'rui-tabs-tab-close-icon', 'html': '&times;'
      }).onClick(R(this.remove).bind(this)));
    }
    
    this.onClick(this._clicked);
  },
  
  select: function() {
    if (this.enabled()) {
      var prev_tab = this.main.current();
      if (prev_tab) {
        prev_tab.removeClass('rui-tabs-current').fire('hide');
      }
      
      this.addClass('rui-tabs-current');
      this.main.scrollToTab(this);
      this.panel.show();
    }
    
    return this.fire('select');
  },
  
  disable: function() {
    return this.addClass('rui-tabs-disabled').fire('disable');
  },
  
  enable: function() {
    return this.removeClass('rui-tabs-disabled').fire('enable');
  },
  
  disabled: function() {
    return !this.enabled();
  },
  
  enabled: function() {
    return !this.hasClass('rui-tabs-disabled');
  },
  
  current: function() {
    return this.hasClass('rui-tabs-current');
  },
  
  remove: function(event) {
    if (event) { event.stop(); }
    
    // switching to the next available sibling
    if (this.current()) {
      var enabled = this.main.enabled();
      var sibling = enabled[enabled.indexOf(this) + 1] || enabled[enabled.indexOf(this)-1];
      
      if (sibling) {
        sibling.select();
      }
    }
    
    // removing the tab out of the list
    this.main.tabs.splice(this.main.tabs.indexOf(this), 1);
    this.panel.remove();
    
    return this.$super().fire('remove');
  },
  
// protected

  // handles the clicks on the tabs
  _clicked: function(event) {
    event.stop();
    return this.select();
  },

  // searches for a panel for the tab
  findPanel: function() {
    var main = this.main, panel_id = main.options.idPrefix + this.id, panel;
    
    if (main.isHarmonica) {
      var next = this.next();
      panel = (next && next._.tagName === 'DD') ? next : $E('DD').insertTo(this, 'after');
    } else {
      panel = $(panel_id) || $E(main._.tagName === 'UL' ? 'LI' : 'DIV').insertTo(main);
    }
      
    return panel.set('id', panel_id);
  },
  
  // returns the tab width, used for the scrolling calculations
  width: function() {
    var next = this.next();
    
    if (next) {
      return next.position().x - this.position().x;
    } else {
      return this.size().x + 1;
    }
  }

});