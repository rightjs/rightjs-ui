/**
 * RightJS UI Slider unit
 *
 * Copyright (C) 2009-2010 Nikolay Nemshilov
 */
var Slider = new Widget({
  include: Updater,
  
  extend: {
    version: '2.0.0',
    
    EVENTS: $w('change'),
    
    Options: {
      min:       0,     // the min value
      max:       100,   // the max value
      snap:      0,     // the values threshold
      value:     null,  // start value, if null then the min value will be used
      direction: 'x',   // slider direction 'x', 'y'
      update:    null,  // reference to an element to update
      round:     0      // the number of symbols after the decimal pointer
    },
    
    current: false
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
    var args = $A(arguments).compact(), options = args.pop(), element = args.pop();
    
    // figuring out the arguments
    if (!isHash(options) || options instanceof Element) {
      element = $(element || options);
      options = {};
    }
    
    this.$super('slider', element).setOptions(options)
      .on('selectstart', 'stopEvent'); // disable select under IE
    
    this.level  = this.first('.level')  || $E('div', {'class': 'level'}).insertTo(this);
    this.handle = this.first('.handle') || $E('div', {'class': 'handle'}).insertTo(this);
    
    options = this.options;
    this.value = options.value === null ? options.min : options.value;
    
    if (options.update) { this.assignTo(options.update); }
    if (options.direction === 'y') { this.addClass('rui-slider-vertical'); }
    else if (this.hasClass('rui-slider-vertical')) { options.direction = 'y'; }
    
    this.setValue(this.value);
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
    return this.precalc().shiftTo(value);
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
   * Inserts the widget into the element
   *
   * @param mixed element reference
   * @param String optional position
   * @return Slider this
   */
  insertTo: function(element, position) {
    return this.$super(element, position).setValue(this.value);
  },
  
// protected

  // precalculates dimensions, direction and offset for further use
  precalc: function() {
    var horizontal  = this.options.direction === 'x',
        handle      = this.handle.setStyle(horizontal ? {left: 0} : {bottom: 0}).dimensions(),
        handle_size = this.hSize = horizontal ? handle.width : handle.height,
        dims        = this.dims  = this.dimensions();
    
    this.offset = horizontal ? handle.left - dims.left : dims.top + dims.height - handle.top - handle_size;
    this.space  = (horizontal ? dims.width - handle_size - this.offset * 2 : dims.height - handle_size) - this.offset * 2;
    
    return this;
  },

  // initializes the slider drag
  start: function(event) {
    return this.precalc().e2val(event);
  },
  
  // processes the slider-drag
  move: function(event) {
    return this.e2val(event);
  },
  
  // shifts the slider to the value
  shiftTo: function(value) {
    var options = this.options, base = Math.pow(10, options.round), horizontal = options.direction === 'x';
    
    // rounding the value up
    value = Math.round(value * base) / base;
    
    // checking the value constraings
    if (value < options.min) { value = options.min; }
    if (value > options.max) { value = options.max; }
    if (options.snap) {
      var snap = options.snap;
      var diff = value % snap;
      value = diff < snap/2 ? value - diff : value - diff + snap;
    }
    
    // calculating and setting the actual position
    var position = this.space / (options.max - options.min) * (value - options.min);
    
    this.handle._.style[horizontal ? 'left' : 'bottom'] = position + 'px';
    this.level._.style[horizontal  ? 'width': 'height'] = ((position > 0 ? position : 0) + 2) + 'px';
    
    // checking the change status
    if (value !== this.value) {
      this.value = value;
      this.fire('change');
    }
    
    return this;
  },
  
  // converts the event position into the actual value in terms of the slider measures
  e2val: function(event) {
    var options = this.options, horizontal = options.direction === 'x',
        dims    = this.dims, offset = this.offset, space = this.space,
        cur_pos = event.position()[horizontal ? 'x' : 'y'] - offset - this.hSize/2,
        min_pos = horizontal ? dims.left + offset : dims.top + offset,
        value   = (options.max - options.min) / space * (cur_pos - min_pos);
    
    return this.shiftTo(horizontal ? options.min + value : options.max - value);
  }
});