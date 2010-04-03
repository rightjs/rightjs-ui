/**
 * Contains the tabs scrolling functionality
 *
 * NOTE: different types of tabs have different scrolling behavior
 *       simple tabs just scroll the tabs line without actually picking
 *       any tab. But the carousel tabs scrolls to the next/previous
 *       tabs on the list.
 *
 * Copyright (C) 2009-2010 Nikolay V. Nemshilov
 */
Tabs.include((function() {
  var old_init = Tabs.prototype.init;
  
return {
  
  /**
   * Shows the next tab
   *
   * @return Tabs this
   */
  next: function() {
    return this.pickTab(+1);
  },

  /**
   * Shows the preveious tab
   *
   * @return Tabs this
   */
  prev: function() {
    return this.pickTab(-1);
  },

  /**
   * Scrolls the tabs to the left
   *
   * @return Tabs this
   */
  scrollLeft: function() {
    return this[this.isCarousel ? 'prev' : 'justScroll'](+0.6);
  },

  /**
   * Scrolls the tabs to the right
   *
   * @return Tabs this
   */
  scrollRight: function() {
    return this[this.isCarousel ? 'next' : 'justScroll'](-0.6);
  },

// protected

  // overloading the init script to add the scrollbar support
  init: function() {
    old_init.call(this);

    if (this.scrollable = (this.options.scrollTabs || this.isCarousel)) {
      this.buildScroller();
    }

    return this;
  },

  // builds the tabs scroller block
  buildScroller: function() {
    if (this.element.first('.right-tabs-scroller')) {
      this.prevButton = this.element.first('.right-tabs-scroll-left');
      this.nextButton = this.element.first('.right-tabs-scroll-right');
    } else {
      this.prevButton = $E('div', {'class': 'right-tabs-scroll-left',  'html': '&laquo;'});
      this.nextButton = $E('div', {'class': 'right-tabs-scroll-right', 'html': '&raquo;'});
      
      this.element.insert($E('div', {'class': 'right-tabs-scroller'}).insert([
        this.prevButton, this.nextButton, $E('div', {'class': 'right-tabs-scroll-body'}).insert(this.tabsList)
      ]), 'top');
    }
    
    this.prevButton.onClick(this.scrollLeft.bind(this));
    this.nextButton.onClick(this.scrollRight.bind(this));
  },

  // picks the next/prev non-disabled available tab
  pickTab: function(pos) {
    var current = this.tabs.first('current');
    if (current && current.enabled()) {
      var enabled_tabs = this.tabs.filter('enabled');
      var tab = enabled_tabs[enabled_tabs.indexOf(current) + pos];
      if (tab) tab.show();
    }
  },
  
  // scrolls the tabs line to make the tab visible
  scrollToTab: function(tab) {
    if (this.scrollable) {
      // calculating the previous tabs widths
      var tabs_width      = 0;
      for (var i=0; i < this.tabs.length; i++) {
        tabs_width += this.tabs[i].width();
        if (this.tabs[i] == tab) break;
      }
      
      // calculating the scroll (the carousel tabs should be centralized)
      var available_width = this.tabsList.parentNode.offsetWidth;
      var scroll = (this.isCarousel ? (available_width/2 + tab.width()/2) : available_width) - tabs_width;
      
      // check if the tab doesn't need to be scrolled
      if (!this.isCarousel) {
        var current_scroll  = this.tabsList.getStyle('left').toInt() || 0;
        
        if (scroll >= current_scroll && scroll < (current_scroll + available_width - tab.width()))
          scroll = current_scroll;
        else if (current_scroll > -tabs_width && current_scroll <= (tab.width() - tabs_width))
          scroll = tab.width() - tabs_width;
      }
      
      this.scrollTo(scroll);
    }
  },
  
  // just scrolls the scrollable area onto the given number of scrollable area widths
  justScroll: function(size) {
    var current_scroll  = this.tabsList.getStyle('left').toInt() || 0;
    var available_width = this.tabsList.parentNode.offsetWidth;
    
    this.scrollTo(current_scroll + available_width * size);
  },
  
  // scrolls the tabs list to the position
  scrollTo: function(scroll) {
    // checking the constraints
    var current_scroll  = this.tabsList.getStyle('left').toInt() || 0;
    var available_width = this.tabsList.parentNode.offsetWidth;
    var overall_width   = 0;
    for (var i=0; i < this.tabs.length; i++) {
      overall_width += this.tabs[i].width();
    }
    
    if (scroll < (available_width - overall_width))
      scroll = available_width - overall_width;
    if (scroll > 0) scroll = 0;
    
    // applying the scroll
    var style = {left: scroll + 'px'};
    
    if (this.options.scrollDuration && self.Fx && current_scroll != scroll) {
      this.tabsList.morph(style, {duration: this.options.scrollDuration});
    } else {
      this.tabsList.setStyle(style);
    }
    
    this.checkScrollButtons(overall_width, available_width, scroll);
  },
  
  // checks the scroll buttons
  checkScrollButtons: function(overall_width, available_width, scroll) {
    var has_prev = has_next = false;
    
    if (this.isCarousel) {
      var enabled = this.tabs.filter('enabled');
      var current = enabled.first('current');
      
      if (current) {
        var index = enabled.indexOf(current);
        
        has_prev = index > 0;
        has_next = index < enabled.length - 1;
      }
    } else {
      has_prev = scroll != 0;
      has_next = scroll > (available_width - overall_width);
    }
    
    this.prevButton[has_prev ? 'removeClass' : 'addClass']('right-tabs-scroll-disabled');
    this.nextButton[has_next ? 'removeClass' : 'addClass']('right-tabs-scroll-disabled');
  }
  
}})());