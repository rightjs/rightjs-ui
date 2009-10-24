/**
 * The basic tabs handling engine
 *
 * Copyright (C) 2009 Nikolay V. Nemshilov aka St.
 */
var Tabs = new Class(Observer, {
  EVENTS: $('show hide click load disable enable add remove'),
  
  extend: {
    Options: {
      idPrefix: '',      // the tab-body elements id prefix
      
      resize:   true,    // if the tab containers should be resized automatically
      resizeFx: 'slide', // slide, fade, null
      
      selected: null,    // the index of the currently opened tab, by default will check url, cookies or set 0
      disabled: [],      // list of disabled tab indexes
      
      url:      false,   // a common remote tabs url template, should have the %{id} placeholder
      cache:    false,   // marker if the remote tabs should be cached
      
      Xhr:      null,    // the xhr addtional options
      Cookie:   null     // set the cookie options if you'd like to keep the last selected tab index in cookies
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
  
// protected
  init: function() {
    this.findTabs();
    
    return this;
  },
  
  findTabs: function() {
    var nodes = this.element.subNodes();
    this.panels = nodes.filter('id').map(function(element) {
      return new Tabs.Panel(element, this);
    }, this);
    
    var tabs  = nodes.first(function(node) { return node.tagName == 'UL';}).select('li');
    this.tabs = tabs.map(function(node) {
      var tab = new Tabs.Tab(node, this);
    }, this);
  }
});