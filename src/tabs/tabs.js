/**
 * The basic tabs handling engine
 *
 * Copyright (C) 2009 Nikolay V. Nemshilov aka St.
 */
var Tabs = new Class(Observer, {
  extend: {
    EVENTS: $w('show hide click load disable enable add remove'),
    
    Options: {
      idPrefix:       '',      // the tab-body elements id prefix
      
      resize:         true,    // if the tab containers should be resized automatically
      resizeFx:       'slide', // 'slide', 'fade', 'both', null
      resizeDuration: 400,     // the tab panels resize fx duration
      
      scrollTabs:     false,   // use the tabs list scrolling
      scrollDuration: 400,     // the tabs scrolling fx duration
      
      selected:       null,    // the index of the currently opened tab, by default will check url, cookies or set 0
      disabled:       [],      // list of disabled tab indexes
      
      url:            false,   // a common remote tabs url template, should have the %{id} placeholder
      cache:          false,   // marker if the remote tabs should be cached
      
      Xhr:            null,    // the xhr addtional options
      Cookie:         null     // set the cookie options if you'd like to keep the last selected tab index in cookies
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
    
    this.show(this.options.selected);
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

  isSimple: function() {
    return !(this.isCarousel() || this.isHarmonica());
  },

  isCarousel: function() {
    return this.element.hasClass('r-tabs-carousel');
  },
  
  isHarmonica: function() {
    return this.element.hasClass('r-tabs-harmonica');
  },
  
  // calls the tab (or tabs) method
  callTab: function(tab, method) {
    if (isArray(tab)) tab.each(this[method], this);
    else if (tab = isNumber(tab) ? this.tabs[tab] : tab) tab[method]();
    return this;
  },
  
  // initializes the tabs unit
  init: function() {
    this.findTabs();
      
    this.element.addClass('r-tabs');
    if (this.isSimple())
      this.element.addClass('r-tabs-simple');
    
    return this.disable(this.options.disabled);
  },
  
  // finds and interconnects the tabs
  findTabs: function() {
    this.panels = this.element.subNodes().filter('id').map(function(element) {
      return new Tabs.Panel(element.addClass('r-tabs-panel'), this);
    }, this);
    
    this.tabsList = this.element.first('UL').addClass('r-tabs-list');
    
    this.tabs = this.tabsList.subNodes().map(function(node) {
      return new Tabs.Tab(node.addClass('r-tabs-tab'), this);
    }, this);
  }
});