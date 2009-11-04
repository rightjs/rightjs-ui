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
    
    // creating the new tab element
    var element = $E(this.isHarmonica ? 'dt' : 'li').insert(
      $E('a', {html: title, href: options.url || '#'+(options.id||'')}
    )).insertTo(this.tabsList);
    
    // creating the actual tab instance
    var tab = new Tabs.Tab(element, this);
    tab.panel.element.update(content||'');
    this.tabs.push(tab);
    
    // moving the tab in place if asked
    if (defined(options.position)) this.move(tab, options.position);
    
    return this.fire('add', tab);
  },
  
  /**
   * Moves the given tab to the given position
   *
   * NOTE if the position is not within the tabs range then it will do nothing
   *
   * @param mixed tab index or a tab instance
   * @param Integer position
   * @return Tabs this
   */
  move: function(tab, position) {
    var tab = this.tabs[tab] || tab;
    
    if (this.tabs[position] && this.tabs[position] !== tab) {
      // moving the tab element
      this.tabs[position].element.insert(tab.element, (position == this.tabs.length-1) ? 'after' : 'before');
      if (this.isHarmonica) tab.element.insert(tab.panel.element, 'after');
      
      // moving the tab in the registry
      this.tabs.splice(this.tabs.indexOf(tab), 1);
      this.tabs.splice(position, 0, tab);
      
      this.fire('move', tab, position);
    }
    
    return this;
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