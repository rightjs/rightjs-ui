/**
 * RightJS UI Slider unit
 *
 * Copyright (C) 2009 Nikolay V. Nemshilov aka St.
 */
var Slider = new Class(Observer, {
  extend: {
    EVENTS: $w('change'),
    
    Options: {
      min:       0,         // the min value
      max:       100,       // the max value
      snap:      0,         // the values threshold
      direction: 'auto'     // slider direction 'auto' or enforce with 'x', 'y'
    },
    
    rescan: function() {
      $$('div.right-slider').each(function(element) {
        if (!element._slider) {
          new Slider(element);
        }
      });
    }
  },
  
  /**
   * basic constructor
   * USAGE:
   *   new Slider('element-id'[, {options}]);
   *   new Slider({options});
   *
   * @param mixed slider element reference or options
   * @param Object options
   */
  initialize: function() {
    var args = $A(arguments);
    this.element = (args[0] && !isHash(args[0])) ? $(args[0]) : this.build();
    this.$super(isHash(args.last()) ? args.last() : eval('('+this.element.get('data-slider-options')+')'));
    
    this.element._slider = this.init().reset();
  },
  
  // basic desctructor
  destroy: function() {
    this.handle.undoDraggable();
    delete(this.element._slider);
    return this;
  },
  
  /**
   * The value setter
   *
   * NOTE: will get snapped according to the options
   *
   * @param mixed string or number value
   * @return Slider this
   */
  setValue: function(value) {
    this.value = isString(value) ? value.toFloat() : value;
    return this.moveTo(this.value).fire('change', this.value);
  },
  
  /**
   * Returns the value
   *
   * @return Float number
   */
  getValue: function() {
    return this.value;
  },
  
  /**
   * Sets the default value
   *
   * @return Slider this
   */
  reset: function() {
    return this.moveTo(this.options.min);
  },
  
  /**
   * Inserts the widget into the element
   *
   * @param mixed element reference
   * @param String optional position
   * @return Slider this
   */
  insertTo: function(element, position) {
    this.element.insertTo(element, position);
    return this.moveTo(this.value === null ? this.options.min : this.value);
  },
  
  /**
   * Assigns the slider to feed an input element on change
   *
   * @param mixed an input element reference
   * @return Slider this
   */
  assignTo: function(input) {
    return this.onChange(function(value) {
      var input = $(input);
      input[input.setValue ? 'setValue' : 'update'](value);
    });
  },
  
// protected
  
  init: function() {
    this.handle = this.element.first('div.right-slider-handle')
      .makeDraggable({
        onBefore: this.prepare.bind(this),
        onDrag: this.dragged.bind(this)
      });
      
    return this;
  },
  
  build: function() {
    return $E('div', {'class': 'right-slider'}).insert($E('div', {'class': 'right-slider-handle'}));
  },
  
  // callback for the element dragg
  dragged: function() {
    //console.log('boo');
  },
  
  // callback for the draggable before event
  prepare: function(draggable) {
    var options    = draggable.options;
    var dimensions = this.element.dimensions();
    var direction  = this.options.direction != 'auto' ? this.options.direction : 
      dimensions.width > dimensions.height ? 'x' : 'y';
    
    // moving the slider to the beginning position
    this.moveTo(this.options.min);
    var handle = this.handle.dimensions();
    options.range = {};
    
    // calculating the ranges
    if ((options.axis = direction) == 'x') {
      options.range.x = [handle.left, handle.left + dimensions.width - (handle.left - dimensions.left) * 2];
    } else {
      options.range.y = [handle.top, handle.top + dimensions.height - (handle.top - dimensions.top) * 2];
    }
    
    // moving the slider back to the current position
    this.moveTo(this.value);
  },
  
  // moves the slider to the given position
  moveTo: function(value) {
    
    
    
    return this;
  }
});