/**
 * The basic tabs handling engine
 *
 * Copyright (C) 2009-2010 Nikolay V. Nemshilov
 */
var Tabs = new Class(Observer, {
  extend: {
    EVENTS: $w('show hide click load disable enable add remove move'),
    
    Options: {
      idPrefix:       '',      // the tab-body elements id prefix
      tabsElement:    null,    // the tabs list element reference, in case it situated somewhere else
      
      resizeFx:       'both',  // 'slide', 'fade', 'both' or null for no fx
      resizeDuration: 400,     // the tab panels resize fx duration
      
      scrollTabs:     false,   // use the tabs list scrolling
      scrollDuration: 400,     // the tabs scrolling fx duration
      
      selected:       null,    // the index of the currently opened tab, by default will check url, cookies or set 0
      disabled:       [],      // list of disabled tab indexes
      
      closable:       false,   // set true if you want a close icon on your tabs
      
      loop:           false,   // put a delay in ms to make it autostart the slideshow loop
      loopPause:      true,    // make the loop get paused when user hovers the tabs with mouse
      
      url:            false,   // a common remote tabs url template, should have the %{id} placeholder
      cache:          false,   // marker if the remote tabs should be cached
      
      Xhr:            null,    // the xhr addtional options
      Cookie:         null     // set the cookie options if you'd like to keep the last selected tab index in cookies
    },
    
    // scans and automatically intializes the tabs
    rescan: function(scope) {
      ($(scope) || document).select('*.right-tabs').each(function(element) {
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
  
// protected
  
  // calls the tab (or tabs) method
  callTab: function(tab, method) {
    if (isArray(tab)) tab.each(this[method], this);
    else if (tab = isNumber(tab) ? this.tabs[tab] : tab) tab[method]();
    return this;
  },
  
  // initializes the tabs unit
  init: function() {
    this.isHarmonica = this.element.tagName == 'DL';
    this.isCarousel  = this.element.hasClass('right-tabs-carousel');
    this.isSimple    = !this.isHarmonica && !this.isCarousel;
    
    this.findTabs();
    
    this.element.addClass('right-tabs');
    if (this.isSimple)
      this.element.addClass('right-tabs-simple');
    
    return this.disable(this.options.disabled);
  },
  
  // finds and interconnects the tabs
  findTabs: function() {
    this.tabsList = this.isHarmonica ? this.element :
      $(this.options.tabsElement) || this.element.first('.right-tabs-list') ||
        this.element.first('UL').addClass('right-tabs-list');
    
    this.tabs = this.tabsList.subNodes(this.isHarmonica ? 'dt' : null).map(function(node) {
      return new Tabs.Tab(node, this);
    }, this);
  },
  
  // searches/builds a panel for the tab
  findPanel: function(tab) {
    var panel_id = this.options.idPrefix + tab.id, panel;
    
    if (this.isHarmonica) {
      var next = tab.element.next();
      panel = (next && next.tagName == 'DD') ? next : $E('DD').insertTo(tab.element, 'after');
    } else {
      panel = $(panel_id) || $E(this.element.tagName == 'UL' ? 'LI' : 'DIV').insertTo(this.element);
    }
      
    return panel.set('id', panel_id);
  }
});