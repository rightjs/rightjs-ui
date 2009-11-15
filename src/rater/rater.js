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
      value:         null,   // default value
      update:        null,   // an element to update
      
      disabled:      false,  // if it should be disabled
      disableOnVote: false,  // if it should be disabled when user clicks a value
      
      url:           null,   // an url to send results with AJAX
      param:         'rate', // the value param name 
      Xhr:           null    // additional Xhr options
    },
    
    // searches and initializes rating units
    rescan: function() {
      $$('div.right-rater').each(function(element) {
        if (!element._rater) new Rater(element);
      });
    }
  },
  
  /**
   * basic constructor
   *
   * @param mixed element reference or an options hash
   * @param Object options hash
   */
  initialize: function() {
    var args = $A(arguments);
    
    this.element = (args[0] && !isHash(args[0])) ? $(args[0]) : null;
    this.$super(isHash(args.last()) ? args.last() : this.element ? eval('('+this.element.get('data-rater-options')+')') : null);
    
    if (!this.element) this.element = this.build();
    
    this.element._rater = this.init();
  },
  
  /**
   * Sets the element value
   *
   * @param Number or String value
   * @return Rater this
   */
  setValue: function(value) {
    if (!this.disabled()) {
      // converting the type and rounding the value
      value = isString(value) ? value.toInt() : value;
      value = isNumber(value) ? value.round() : 0;
      
      // checking constraints
      if (value > this.options.size) value = this.options.size;
      else if (value < 0) value = 0;
      
      this.highlight(value);
      
      if (this.value != value) {
        this.fire('change', this.value = value, this);
      }
    }
    
    return this;
  },
  
  /**
   * Returns the current value of the rater
   *
   * @return Number value
   */
  getValue: function() {
    return this.value;
  },
  
  /**
   * Inserts the rater into the given element
   *
   * @param mixed element reference
   * @param String optional position
   * @return Rater this
   */
  insertTo: function(element, position) {
    this.element.insertTo(element, position);
    return this;
  },
  
  /**
   * Assigns the unit to work with an input element
   *
   * @param mixed element reference
   * @return Rater this
   */
  assignTo: function(element) {
    var element = $(element);
    if (element && element.setValue) {
      element._rater = this;
      element.value  = this.value;
      
      element.onChange(function() {
        this.setValue(element.value);
      }.bind(this));
      this.onChange(element.setValue.bind(element));
      this.assignee = element;
    }
    return this;
  },
  
  /**
   * Sends an Xhr request with the current value to the options.url address
   *
   * @return Rater this
   */
  send: function() {
    if (this.options.url) {
      new Xhr(this.options.url, this.options.Xhr).send(this.options.param+"="+this.value);
      this.fire('send', this.value, this);
    }
    return this;
  },
  
  /**
   * Disables the instance
   *
   * @return Rater this
   */
  disable: function() {
    this.element.addClass('right-rater-disabled');
    return this;
  },
  
  /**
   * Enables this instance
   *
   * @return Rater this
   */
  enable: function() {
    this.element.removeClass('right-rater-disabled');
    return this;
  },
  
  /**
   * Checks if the instance is disabled
   *
   * @return boolean
   */
  disabled: function() {
    return this.element.hasClass('right-rater-disabled');
  },
  
// protected

  // callback for 'hover' event
  hovered: function(index) {
    if (!this.disabled()) {
      this.highlight(index + 1);
      this.fire('hover', index + 1, this);
    }
  },
  
  // callback for user-click
  clicked: function(index) {
    this.setValue(index + 1);
    if (this.options.disableOnVote) this.disable();
    this.send();
  },
  
  // callback when user moves the mouse out
  leaved: function() {
    this.setValue(this.value);
  },
  
  // highlights the stars
  highlight: function(number) {
    this.stars.each(function(element, i) {
      element[number - 1 < i ? 'removeClass' : 'addClass']('right-rater-glow');
    });
  },

  // initializes the script
  init: function() {
    this.stars = this.element.subNodes();
    
    this.stars.each(function(element, index) {
      element.onMouseover(this.hovered.bind(this, index))
        .onClick(this.clicked.bind(this, index));
    }, this);
    
    this.element.onMouseout(this.leaved.bind(this));
    this.setValue(this.options.value);
    
    if (this.options.disabled) this.disable();
    if (this.options.update)   this.assignTo(this.options.update);
    
    return this;
  },
  
  // builds the elements structure
  build: function() {
    var element = $E('div', {'class': 'right-rater'});
    
    this.options.size.times(function() {
      element.insert($E('div', {html: '&#9733;'}));
    });
    
    return element;
  }
});