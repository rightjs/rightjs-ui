/**
 * The native tooltips feature for RithJS
 *
 *
 * Copyright (C) 2009 Nikolay V. Nemshilov aka St.
 */

var Tooltip = new Class({
  include: Options,
  
  extend: {
    Options: {
      checkTags:  '*', // tags that should be checked on-load
      relName:    'tooltip',
      idSuffix:   '-tooltip',
      fxName:     'fade',
      fxDuration: 400,
      delay:      400  // the appearance delay
    },
    
    current: null // currently active tooltip reference
  },
  
  initialize: function(element, options) {
    this.element   = $E('div', {'class': 'right-tooltip'}).insertTo(document.body).hide();
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
    Tooltip.current = null;
    this.cancelTimer();
    this.element.hide(this.options.fxName, {duration: this.options.fxDuration});
    
    return this;
  },
  
  show: function() {
    Tooltip.current = this;
    this.element.show(this.options.fxName, {duration: this.options.fxDuration});

    return this;
  },
  
  showDelayed: function() {
    Tooltip.current = this;
    this.timer = this.show.bind(this).delay(this.options.delay);
  },
  
  cancelTimer: function() {
    if (this.timer) {
      this.timer.cancel(); 
      this.timer = null;
    }
  },
  
  moveTo: function(event) {
    this.element.style.left = event.pageX + 'px';
    this.element.style.top  = event.pageY + 'px';
    
    return this;
  },
  
  assignTo: function(element) {
    this.setText(element.get('title') || element.get('alt'));
    
    // removing the element native title and alt
    element.setAttribute('title', '');
    element.setAttribute('alt', '');
    
    element.on({
      mouseover: this.showDelayed.bind(this),
      mouseout:  this.hide.bind(this)
    });
    
    if (element.id) this.element.id = element.id + this.options.idSuffix;
    
    this.associate = element;
    
    return this;
  }
});