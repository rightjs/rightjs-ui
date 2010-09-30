/**
 * This module handles the current tab state saving/restoring processes
 *
 * Copyright (C) 2009-2010 Nikolay Nemshilov
 */
function get_cookie_indexes() {
  return R(RightJS.Cookie ? (Cookie.get('right-tabs-indexes') || '').split(',') : []);
}

function save_tab_in_cookies(options, tabs, event) {
  if (RightJS.Cookie) {
    var indexes = get_cookie_indexes();
    indexes = indexes.without.apply(indexes, tabs.map('id'));
    indexes.push(event.target.id);
    Cookie.set('right-tabs-indexes', indexes.uniq().join(','), options);
  }
}

Tabs.include({

// protected

  // searches and activates the current tab
  findCurrent: function() {
    var enabled = this.enabled(), current = (
      this.tabs[this.options.selected] ||
      this.tabs[this.urlIndex()]       ||
      this.tabs[this.cookieIndex()]    ||
      enabled.first('current')         ||
      enabled[0]
    );

    if (current) {
      current.select();
    }

    // initializing the cookies storage if set
    if (this.options.Cookie) {
      this.onSelect(R(save_tab_in_cookies).curry(this.options.Cookie, this.tabs));
    }

    return this;
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

});
