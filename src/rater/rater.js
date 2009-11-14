/**
 * The Rating widget
 *
 * Copyright (C) 2009 Nikolay V. Nemshilov aka St.
 */
var Rater = new Class(Observer, {
  extend: {
    EVENTS: $w('change hover send'),
    
    Options: {
      size:          5,      // number of stars in the line
      halfs:         false,  // allow usage of halfs
      value:         null,   // default value
      update:        null,   // an element to update
      
      disabled:      false,  // if it should be disabled
      disableOnVote: false,  // if it should be disabled when user clicks a value
      disableOnSend: true,   // if it should be disabled when it sends an Xhr request
      
      url:           null,   // an url to send results with AJAX
      param:         'rate', // the value param name 
      Xhr:           null    // additional Xhr options
    },
    
    rescan: function() {
      $$('div.right-rater').each(function(element) {
        if (!element._rater) new Rater(element);
      });
    }
  },
  
  initialize: function() {
    var args = $A(arguments);
    
    this.element = (args[0] && !isHash(args[0])) ? $(args.shift()) : this.build();
    
    this.$super(isHash(args[0]) ? args[0] : eval('('+this.element.get('data-rater-options')+')'));
    
    if (this.options.update) this.assignTo(this.options.update);
    
    this.element._slider = this.init();
  },
  
  setValue: function(value) {
    if (!this.disabled()) {
      // checking constraints
      if (value > this.options.size) value = this.options.size;
      else if (value < 0) value = 0;
      
      value = value - value % (this.options.halfs ? 0.5 : 1);
      this.highlight(value);
      
      if (this.value != value) {
        this.fire('change', this.value = value);
      }
    }
    
    return this;
  },
  
  getValue: function() {
    return this.value;
  },
  
  insertTo: function(element, position) {
    return this;
  },
  
  assignTo: function(element) {
    return this;
  },
  
  disable: function() {
    this.element.addClass('right-rater-disabled');
    return this;
  },
  
  enable: function() {
    this.element.removeClass('right-rater-disabled');
    return this;
  },
  
  disabled: function() {
    return this.element.hasClass('right-rater-disabled');
  },
  
// protected

  hovered: function(index) {
    if (!this.disabled()) {
      this.highlight(index + 1);
      this.fire('hover', index + 1);
    }
  },
  
  clicked: function(index) {
    this.setValue(index + 1);
  },
  
  leaved: function() {
    this.setValue(this.value);
  },
  
  highlight: function(number) {
    this.stars.each(function(element, i) {
      element[number - 1 < i ? 'removeClass' : 'addClass']('right-rater-glow');
    });
  },

  init: function() {
    this.stars = this.element.subNodes();
    
    this.stars.each(function(element, index) {
      element.onMouseover(this.hovered.bind(this, index))
        .onClick(this.clicked.bind(this, index));
    }, this)
    
    this.element.onMouseout(this.leaved.bind(this));
    this.setValue(this.options.value);
    
    if (this.options.disabled) this.disable();
    
    return this;
  },
  
  build: function() {
    var element = $E('div', {'class': 'right-rater'});
    
    this.options.size.times(function() {
      element.insert($E('div', {html: '&#9733;'}));
    });
    
    return element;
  }
});