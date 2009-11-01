/**
 * The basic tabs handling engine
 *
 * Copyright (C) 2009 Nikolay V. Nemshilov aka St.
 */
var Tabs = new Class(Observer, {
  EVENTS: $('show hide click load disable enable add remove'),
  
  extend: {
    Options: {
      idPrefix:    '',      // the tab-body elements id prefix
      
      resize:      true,    // if the tab containers should be resized automatically
      resizeFx:    'slide', // 'slide', 'fade', 'both', null
      
      scrollTabs:  false,   // use the tabs list scrolling
      scrollSpeed: 400,     // the tabs scrolling speed (fx duration)
      
      selected:    null,    // the index of the currently opened tab, by default will check url, cookies or set 0
      disabled:    [],      // list of disabled tab indexes
      
      url:         false,   // a common remote tabs url template, should have the %{id} placeholder
      cache:       false,   // marker if the remote tabs should be cached
      
      Xhr:         null,    // the xhr addtional options
      Cookie:      null     // set the cookie options if you'd like to keep the last selected tab index in cookies
    },
    
    // scans and automatically intializes the tabs
    rescan: function() {
      $$('*.r-tabs').each(function(element) {
        if (!element._tabs) {
          new Tabs(element);
        }
      });
    }
  },
  
  /**
   * The basic constructor
   *
   * @param element or id
   * @param Object options
   */
  initialize: function(element, options) {
    this.element = $(element);
    this.$super(options || eval('('+this.element.get('data-tabs-options')+')'));
    
    this.element._tabs = this.init();
  },
  
  /**
   * destructor
   *
   * @return Tabs this
   */
  destroy: function() {
    delete(this.element._tabs);
  },
  
  /**
   * Shows the given tab
   *
   * @param integer tab index or a Tabs.Tab instance
   * @return Tabs this
   */
  show: function(tab) {
    return this.callTab(tab, 'show');
  },
  
  next: function() {
    
  },
  
  prev: function() {
    
  },
  
  /**
   * Disables the given tab
   *
   * @param integer tab index or a Tabs.Tab instance or a list of them
   * @return Tabs this
   */
  disable: function(tab) {
    return this.callTab(tab, 'disable');
  },
  
  /**
   * Enables the given tab
   *
   * @param integer tab index or a Tabs.Tab instance or a list of them
   * @return Tabs this
   */
  enable: function(tab) {
    return this.callTab(tab, 'enable');
  },
  
  /**
   * Creates a new tab
   *
   * @param String title
   * @param mixed content
   * @param Object options
   * @return Tabs this
   */
  add: function(title, content, options) {
    // TODO me
  },
  
  /**
   * Removes the given tab
   *
   * @param integer tab index or a Tabs.Tab instance or a list of them
   * @return Tabs this
   */
  remote: function(tab) {
    return this.callTab(tab, 'remove');
  },
  
// protected
  
  // calls the tab (or tabs) method
  callTab: function(tab, method) {
    if (isArray(tab)) tab.each(this[method], this);
    else (isNumber(tab) ? this.tabs[tab] : tab)[method]();
    return this;
  },
  
  // initializes the tabs unit
  init: function() {
    this.findTabs();
    
    if (this.options.scrollTabs || this.element.hasClass('r-tabs-carousel'))
      this.buildScroller();
      
    this.element.addClass('r-tabs');
    if (!this.element.hasClass('r-tabs-carousel'))
      this.element.addClass('r-tabs-simple');
    
    return this;
  },
  
  // finds and interconnects the tabs
  findTabs: function() {
    this.panels = this.element.subNodes().filter('id').map(function(element) {
      return new Tabs.Panel(element.addClass('r-tabs-panel'), this);
    }, this);
    
    this.tabsList = this.element.first('UL').addClass('r-tabs-list');
    
    this.tabs = this.tabsList.subNodes().map(function(node) {
      var tab = new Tabs.Tab(node.addClass('r-tabs-tab'), this);
    }, this);
  },
  
  // builds the tabs scroller block
  buildScroller: function() {
    if (!this.element.first('r-tabs-scroller')) {
      this.element.insert($E('div', {'class': 'r-tabs-scroller'}).insert([
        $E('div', {'class': 'r-tabs-scroll-left',  'html': '&laquo;'}).onClick(this.prev.bind(this)),
        $E('div', {'class': 'r-tabs-scroll-right', 'html': '&raquo;'}).onClick(this.next.bind(this)),
        $E('div', {'class': 'r-tabs-scroll-body'}).insert(this.tabsList)
      ]), 'top');
    }
  }
});