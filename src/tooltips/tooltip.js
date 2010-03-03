/**
 * The native tooltips feature for RithJS
 *
 * Copyright (C) 2009-2010 Nikolay V. Nemshilov aka St.
 */

var Tooltip = new Class({
  include: Options,
  
  extend: {
    Options: {
      cssRule:    '[rel=tooltip]',  // a css-marker of an element with a tooltip
      
      fxName:     'fade',           // the appearance effect name
      fxDuration: 400,              // the appearance effect duration
      delay:      400,              // the appearance delay
      
      move:       true,             // if it should be moved with the mouse
      
      idSuffix:   '-tooltip',       // ID prefix for tooltips with ID
      
      // deprecated options
      relName:    'tooltip',
      checkTags:  '*'
    },
    
    current: null, // currently active tooltip reference
    instances: [], // keeps the list of instances
    
    // tries to find a tip closest to the event
    find: function(event) {
      var target  = event.target, targets = [target].concat(target.parents()),
          targets = targets.slice(0, targets.length - 2),
          element = targets.first(function(node) {
            return node._tooltip || node.match(Tooltip.Options.cssRule);
          });
      
      if (element) {
        var uid = $uid(element);
        return Tooltip.instances[uid] = Tooltip.instances[uid] || new Tooltip(element);
      }
    },
    
    // DEPRECATED a dummy method for the old API backward compatibility
    rescan: function(scope) { }
  },
  
  initialize: function(element, options) {
    this.element   = $E('div', {'class': 'right-tooltip'}).hide().insertTo(document.body);
    this.container = $E('div', {'class': 'right-tooltip-container'}).insertTo(this.element);
    
    this.setOptions(options).assignTo(element);
  },
  
  setText: function(text) {
    this.container.update(text);
    return this;
  },
  
  getText: function() {
    return this.container.innerHTML;
  },
  
  hide: function() {
    this.cancelTimer();
    this.element.hide(this.options.fxName, {
      duration: this.options.fxDuration,
      onFinish: function() {
        if (Tooltip.current === this)
          Tooltip.current = null;
      }.bind(this)
    });
    
    return this;
  },
  
  show: function() {
    this.element.stop().show(this.options.fxName, {duration: this.options.fxDuration});

    return Tooltip.current = this;
  },
  
  showDelayed: function() {
    // hidding all the others
    Tooltip.instances.each(function(tip) {
      if (tip && tip !== this) tip.hide();
    }, this);
    
    Tooltip.current = this;
    
    this.timer = this.show.bind(this).delay(this.options.delay);
  },
  
  moveTo: function(event) {
    this.element.style.left = event.pageX + 'px';
    this.element.style.top  = event.pageY + 'px';
    
    return this;
  },
  
// protected
  
  cancelTimer: function() {
    if (this.timer) {
      this.timer.cancel(); 
      this.timer = null;
    }
  },
  
  assignTo: function(element) {
    this.setText(element.get('title') || element.get('alt'));
    
    // removing the element native title and alt
    element.set({ title: '', alt: ''});
    
    if (element.id) this.element.id = element.id + this.options.idSuffix;
    
    this.associate = element;
    
    return this;
  }
});