/**
 * The basic tabs handling engine
 *
 * Copyright (C) 2009-2010 Nikolay Nemshilov
 */
var Tabs = new Widget('UL', {
  extend: {
    version: '2.0.1',

    EVENTS: $w('select hide load disable enable add remove move'),

    Options: {
      idPrefix:       '',      // the tab-body elements id prefix
      tabsElement:    null,    // the tabs list element reference, in case it's situated somewhere else

      resizeFx:       'both',  // 'slide', 'fade', 'both' or null for no fx
      resizeDuration: 400,     // the tab panels resize fx duration

      scrollTabs:     false,   // use the tabs list scrolling
      scrollDuration: 400,     // the tabs scrolling fx duration

      selected:       null,    // the index of the currently opened tab, by default will check url, cookies or set 0
      disabled:       null,    // list of disabled tab indexes

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
      $(scope || document).find('.rui-tabs,*[data-tabs]').each(function(element) {
        element = element instanceof Tabs ? element : new Tabs(element);
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
    this
      .$super('tabs', element)
      .setOptions(options)
      .addClass('rui-tabs');

    this.isHarmonica = this._.tagName === 'DL';
    this.isCarousel  = this.hasClass('rui-tabs-carousel');
    this.isSimple    = !this.isHarmonica && !this.isCarousel;

    this
      .findTabs()
      .initScrolls()
      .findCurrent()
      .setStyle('visibility:visible');

    if (this.options.disabled) {
      this.disable(this.options.disabled);
    }

    if (this.options.loop) {
      this.startLoop();
    }
  },

  /**
   * Shows the given tab
   *
   * @param integer tab index or a Tabs.Tab instance
   * @return Tabs this
   */
  select: function(tab) {
    return this.callTab(tab, 'select');
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
   * Returns the reference to the currently opened tab
   *
   * @return Tab tab or undefined
   */
  current: function() {
    return this.tabs.first('current');
  },

  /**
   * Returns the list of enabled tabs
   *
   * @return Array of enabled tabs
   */
  enabled: function() {
    return this.tabs.filter('enabled');
  },

// protected

  // calls the tab (or tabs) method
  callTab: function(tabs, method) {
    R(isArray(tabs) ? tabs : [tabs]).each(function(tab) {
      if (isNumber(tab)) { tab = this.tabs[tab]; }
      if (tab && tab instanceof Tab) {
        tab[method]();
      }
    }, this);

    return this;
  },

  // finds and interconnects the tabs
  findTabs: function() {
    this.tabsList = this.isHarmonica ? this :
      $(this.options.tabsElement) || this.first('.rui-tabs-list') ||
        (this.first('UL') || $E('UL').insertTo(this)).addClass('rui-tabs-list');

    this.tabs = R([]);

    this.tabsList.children(this.isHarmonica ? 'dt' : null).map(function(node) {
      this.tabs.push(new Tab(node, this));
    }, this);

    // removing the whitespaces so the didn't screw with the margins
    for (var i=0, list = this.tabsList.get('childNodes'); i < list.length; i++) {
      if (list[i].nodeType == 3) { this.tabsList._.removeChild(list[i]); }
    }

    return this;
  }
});
