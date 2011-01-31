/**
 * This module handles the tabs cration and removing processes
 *
 * Copyright (C) 2009-2010 Nikolay Nemshilov
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
    options = options || {};

    // creating the new tab element
    var element = $E(this.isHarmonica ? 'dt' : 'li').insert(
      $E('a', {html: title, href: options.url || '#'+(options.id||'')}
    )).insertTo(this.tabsList);

    // creating the actual tab instance
    var tab = new Tab(element, this);
    tab.panel.update(content||'');
    this.tabs.push(tab);
    tab.fire('add');

    // moving the tab in place if asked
    if ('position' in options) {
      this.move(tab, options.position);
    }

    return this;
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
    tab = this.tabs[tab] || tab;

    if (this.tabs[position] && this.tabs[position] !== tab) {
      // moving the tab element
      this.tabs[position].insert(tab, (position === this.tabs.length-1) ? 'after' : 'before');

      // inserting the panel after the tab if it's a harmonica
      if (this.isHarmonica) {
        tab.insert(tab.panel, 'after');
      }

      // moving the tab in the registry
      this.tabs.splice(this.tabs.indexOf(tab), 1);
      this.tabs.splice(position, 0, tab);

      tab.fire('move', {index: position});
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
    return arguments.length === 0 ? this.$super() : this.callTab(tab, 'remove');
  }

});
