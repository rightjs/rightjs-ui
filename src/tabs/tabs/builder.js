/**
 * This module handles the tabs cration and removing processes   
 *
 * Copyright (C) 2009 Nikolay V. Nemshilov aka St.
 */
Tabs.include({
  /**
   * Creates a new tab
   *
   * USAGE:
   *   With the #add method you have to specify the tab title
   *   optional content (possibly empty or null) and some options
   *   The options might have the following keys
   *
   *     * id - the tab/panel id (will use the idPrefix option for the panels)
   *     * url - a remote tab content address
   *     * position - an integer position of the tab in the stack
   *
   * @param String title
   * @param mixed content
   * @param Object options
   * @return Tabs this
   */
  add: function(title, content, options) {
    var options = options || {};
    var tab = new Tabs.Tab($E('li').insert($E('a', {html: title, href: options.url || '#'+(options.id||'')})), this);
    tab.panel.element.update(content||'');
    
    if (options.position !== undefined && this.tabs[options.position]) {
      this.tabs[options.position].element.insert(tab.element, 'before');
      this.tabs.splice(options.position, 0, tab);
    } else {
      this.tabsList.insert(tab.element);
      this.tabs.push(tab);
    }
    
    return this.fire('add', tab);
  },
  
  /**
   * Removes the given tab
   *
   * @param integer tab index or a Tabs.Tab instance or a list of them
   * @return Tabs this
   */
  remove: function(tab) {
    return this.callTab(tab, 'remove');
  }
  
});