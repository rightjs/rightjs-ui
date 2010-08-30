/**
 * Contains the tabs scrolling functionality
 *
 * NOTE: different types of tabs have different scrolling behavior
 *       simple tabs just scroll the tabs line without actually picking
 *       any tab. But the carousel tabs scrolls to the next/previous
 *       tabs on the list.
 *
 * Copyright (C) 2009-2010 Nikolay Nemshilov
 */
Tabs.include({
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
    if (!this.prevButton.hasClass('rui-tabs-scroller-disabled')) {
      this[this.isCarousel ? 'prev' : 'justScroll'](+0.6);
    }
    return this;
  },

  /**
   * Scrolls the tabs to the right
   *
   * @return Tabs this
   */
  scrollRight: function() {
    if (!this.nextButton.hasClass('rui-tabs-scroller-disabled')) {
      this[this.isCarousel ? 'next' : 'justScroll'](-0.6);
    }
    return this;
  },

// protected

  // overloading the init script to add the scrollbar support
  initScrolls: function() {
    if ((this.scrollable = (this.options.scrollTabs || this.isCarousel))) {
      this.buildScroller();
    }

    return this;
  },

  // builds the tabs scroller block
  buildScroller: function() {
    if (!(
      (this.prevButton = this.first('.rui-tabs-scroller-prev')) &&
      (this.nextButton = this.first('.rui-tabs-scroller-next'))
    )) {
      this.prevButton = $E('div', {'class': 'rui-tabs-scroller-prev', 'html': '&laquo;'});
      this.nextButton = $E('div', {'class': 'rui-tabs-scroller-next', 'html': '&raquo;'});
      
      // using a dummy element to insert the scroller in place of the tabs list
      $E('div').insertTo(this.tabsList, 'before')
        .replace(
          $E('div', {'class': 'rui-tabs-scroller'}).insert([
            this.prevButton, this.nextButton, this.scroller = $E('div', {
              'class': 'rui-tabs-scroller-body'
            }).insert(this.tabsList)
          ])
        ).remove();
    }
    
    this.prevButton.onClick(R(this.scrollLeft).bind(this));
    this.nextButton.onClick(R(this.scrollRight).bind(this));
  },

  // picks the next/prev non-disabled available tab
  pickTab: function(pos) {
    var current = this.current();
    if (current && current.enabled()) {
      var enabled_tabs = this.enabled();
      var tab = enabled_tabs[enabled_tabs.indexOf(current) + pos];
      if (tab) { tab.select(); }
    }
  },
  
  // scrolls the tabs line to make the tab visible
  scrollToTab: function(tab) {
    if (this.scroller) {
      // calculating the previous tabs widths
      var tabs_width      = 0;
      for (var i=0; i < this.tabs.length; i++) {
        tabs_width += this.tabs[i].width();
        if (this.tabs[i] === tab) { break; }
      }
      
      // calculating the scroll (the carousel tabs should be centralized)
      var available_width = this.scroller.size().x;
      var scroll = (this.isCarousel ? (available_width/2 + tab.width()/2) : available_width) - tabs_width;
      
      // check if the tab doesn't need to be scrolled
      if (!this.isCarousel) {
        var current_scroll  = parseInt(this.tabsList.getStyle('left') || 0, 10);
        
        if (scroll >= current_scroll && scroll < (current_scroll + available_width - tab.width())) {
          scroll = current_scroll;
        } else if (current_scroll > -tabs_width && current_scroll <= (tab.width() - tabs_width)) {
          scroll = tab.width() - tabs_width;
        }
      }
      
      this.scrollTo(scroll);
    }
  },
  
  // just scrolls the scrollable area onto the given number of scrollable area widths
  justScroll: function(size) {
    if (!this.scroller) { return this; }
    var current_scroll  = parseInt(this.tabsList.getStyle('left') || 0, 10);
    var available_width = this.scroller.size().x;
    
    this.scrollTo(current_scroll + available_width * size);
  },
  
  // scrolls the tabs list to the position
  scrollTo: function(scroll) {
    // checking the constraints
    var available_width = this.scroller.size().x;
    var overall_width   = this.tabs.map('width').sum();
    
    if (scroll < (available_width - overall_width)) {
      scroll = available_width - overall_width;
    }
    if (scroll > 0) { scroll = 0; }
    
    // applying the scroll
    this.tabsList.morph({left: scroll+'px'}, {duration: this.options.scrollDuration});
    
    this.checkScrollButtons(overall_width, available_width, scroll);
  },
  
  // checks the scroll buttons
  checkScrollButtons: function(overall_width, available_width, scroll) {
    var has_prev = false, has_next = false;
    
    if (this.isCarousel) {
      var enabled = this.enabled();
      var current = enabled.first('current');
      
      if (current) {
        var index = enabled.indexOf(current);
        
        has_prev = index > 0;
        has_next = index < enabled.length - 1;
      }
    } else {
      has_prev = scroll !== 0;
      has_next = scroll > (available_width - overall_width);
    }
    
    this.prevButton[has_prev ? 'removeClass' : 'addClass']('rui-tabs-scroller-disabled');
    this.nextButton[has_next ? 'removeClass' : 'addClass']('rui-tabs-scroller-disabled');
  }
  
});