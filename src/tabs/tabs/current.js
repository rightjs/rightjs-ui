/**
 * This module handles the current tab state saving/restoring processes
 *
 * Copyright (C) 2009-2010 Nikolay V. Nemshilov
 */
Tabs.include((function() {
  var old_initialize = Tabs.prototype.initialize;
  
  var get_cookie_indexes = function() {
    return self.Cookie ? (Cookie.get('right-tabs-indexes') || '').split(',') : [];
  };
  
  var save_tab_in_cookies = function(options, tabs, tab) {
    if (self.Cookie) {
      var indexes = get_cookie_indexes();
      indexes = indexes.without.apply(indexes, tabs.map('id'));
      indexes.push(tab.id);
      Cookie.set('right-tabs-indexes', indexes.uniq().join(','), options);
    }
  };

return {
  
  // overloading the constructor to catch up the current tab properly
  initialize: function() {
    old_initialize.apply(this, arguments);
    
    this.findCurrent();
    
    // initializing the cookies storage if set
    if (this.options.Cookie)
      this.onShow(save_tab_in_cookies.curry(this.options.Cookie, this.tabs));
  },
  
  
// protected
  
  // searches and activates the current tab
  findCurrent: function() {
    var current;
    if (this.options.selected !== null)
      current = this.options.selected;
    else {
      var enabled = this.tabs.filter('enabled');
      current = enabled[this.urlIndex()] || enabled[this.cookieIndex()] || enabled.first('current') || enabled[0];
    }
    if (current) current.show();
  },
  
  // tries to find the current tab index in the url hash
  urlIndex: function() {
    var index = -1, id = document.location.href.split('#')[1];
    
    if (id) {
      for (var i=0; i < this.tabs.length; i++) {
        if (this.tabs[i].id == id) {
          index = i;
          break;
        }
      }
    }
    
    return index;
  },
  
  // tries to find the current tab index in the cookies storage
  cookieIndex: function() {
    var index = -1;
    
    if (this.options.Cookie) {
      var indexes = get_cookie_indexes();
      for (var i=0; i < this.tabs.length; i++) {
        if (indexes.include(this.tabs[i].id)) {
          index = i;
          break;
        }
      }
    }
    
    return index;
  }
  
}})());