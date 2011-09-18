/**
 * RightJS UI Slider unit
 *
 * Copyright (C) 2009-2011 Nikolay Nemshilov
 */
var Slider = new Widget({
  include: Updater,

  extend: {
    version: '2.3.0',

    EVENTS: $w('change'),

    Options: {
      min:       0,     // the min value
      max:       100,   // the max value
      snap:      0,     // the values threshold
      range:     false, // whether a single handle slider or a range slider
      value:     null,  // start value, if null then the min value will be used
      values:    null,  // range values when range = true, if null then then min/max value will be used
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

    options = this.options;
    this.value = options.value === null ? options.min : options.value;

    if (options.range === true) {
      this.handles = new Array();
      this.handles[0] = this.first('.handle.from') || $E('div', {'class': 'handle from'}).insertTo(this);
      this.handles[1] = this.first('.handle.to') || $E('div', {'class': 'handle to'}).insertTo(this);

      this.values = [0, 0];
      this.values[0] = options.values === null ? options.min : options.values[0];
      this.values[1] = options.values === null ? options.max : options.values[1];

      this.setValue(this.values[0], 'from');
      this.setValue(this.values[1], 'to');

    } else {
      this.handle = this.first('.handle') || $E('div', {'class': 'handle'}).insertTo(this);
      this.setValue(this.value);
    }

    if (options.update) { this.assignTo(options.update); }
    if (options.direction === 'y') { this.addClass('rui-slider-vertical'); }
    else if (this.hasClass('rui-slider-vertical')) { options.direction = 'y'; }

  },

  /**
   * The value setter
   *
   * NOTE: will get snapped according to the options
   *
   * @param mixed string or number value, an optional type specifying 'from' or 'to' when using with range slider
   * @return Slider this
   */
  setValue: function(value, type) {
    return this.precalc().shiftTo(value, type);
  },

  /**
   * Returns the value
   *
   * @return Float number
   */
  getValue: function() {
    if (this.options.range === true) {
      return this.values[0];
    } else {
      return this.value;
    }
  },

  /**
   * Returns the values that used to store the range
   *
   * @return An array storing the from/to float numbers
   */
  getValues: function() {
    return this.values;
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
    var horizontal = this.options.direction === 'x',
        dims       = this.dims = this.dimensions();

    if (this.options.range === true) {
      var handle_f    = this.handles[0].setStyle(horizontal ? {left: 0} : {bottom: 0}).dimensions(),
          handle_size = this.hSize = horizontal ? handle_f.width : handle_f.height;
          // Assuming both handles are in the same size

      this.offset = horizontal ? handle_f.left - dims.left : dims.top + dims.height - handle_f.top - handle_size;
      this.space  = (horizontal ? dims.width : dims.height) - handle_size - (this.offset * 2);

      var handle_t = this.handles[1].setStyle(horizontal ? {left: this.space + 'px'} :
                                                           {bottom: this.space + 'px'}).dimensions();

    } else {
      var handle      = this.handle.setStyle(horizontal ? {left: 0} : {bottom: 0}).dimensions(),
          handle_size = this.hSize = horizontal ? handle.width : handle.height;

      this.offset = horizontal ? handle.left - dims.left : dims.top + dims.height - handle.top - handle_size;
      this.space  = (horizontal ? dims.width : dims.height) - handle_size - this.offset * 2;
    }

    return this;
  },

  // initializes the slider drag
  start: function(event) {
    this._type = null
    if (event.target.hasClass('handle')) {
      if (event.target.hasClass('from')) {
        this._type = "from";
      } else if (event.target.hasClass('to')) {
        this._type = "to";
      }
    }

    return this.precalc().e2val(event);
  },

  // processes the slider-drag
  move: function(event) {
    return this.e2val(event);
  },

  // shifts the slider to the value
  shiftTo: function(value, type) {
    var options = this.options, base = Math.pow(10, options.round), horizontal = options.direction === 'x';

    // rounding the value up
    value = Math.round(value * base) / base;

    // checking the value constraings
    if (value < options.min) { value = options.min; }
    if (value > options.max) { value = options.max; }

    // if range slider check if the "from" handle's value is larger than the "to" handle's
    if (options.range === true) {
      if ((type === "to") && (value < this.values[0])) {
          value = this.values[0];
      }
      if ((type === "from") || (type === undefined)) {
        if (value > this.values[1]) {
          value = this.values[1];
        }
      }
    }

    if (options.snap) {
      var snap = options.snap;
      var diff = (value - options.min) % snap;
      value = diff < snap/2 ? value - diff : value - diff + snap;
    }

    if (options.range === true) {
      var value_f = (type === "from") ? value : this.values[0];
      var value_t = (type === "to")   ? value : this.values[1];

      // calculating and setting the actual position
      var position_f = this.space / (options.max - options.min) * (value_f - options.min);
      var position_t = this.space / (options.max - options.min) * (value_t - options.min);
      var length = position_t - position_f;

      if (type === "to") {
        this.handles[1]._.style[horizontal ? 'left' : 'bottom'] = position_t + 'px';
      } else {
        this.handles[0]._.style[horizontal ? 'left' : 'bottom'] = position_f + 'px';
       }

      this.level._.style[horizontal ? 'left': 'top'] = ((position_f > 0 ? position_f : 0) + 2) + 'px';
      this.level._.style[horizontal ? 'width': 'height'] = ((length > 0 ? length : 0) + 2) + 'px';

      // checking the change status
      var fireEvent = false;
      if ((type === "from") && (value !== this.values[0])) {
        this.values[0] = value;
        fireEvent = true;
      }
      if ((type === "to") && (value !== this.values[1])) {
        this.values[1] = value;
        fireEvent = true;
      }
      if (fireEvent) {
        this.fire('change', {value: value, values: this.values});
      }

    } else {
      // calculating and setting the actual position
      var position = this.space / (options.max - options.min) * (value - options.min);
      this.handle._.style[horizontal ? 'left' : 'bottom'] = position + 'px';
      this.level._.style[horizontal  ? 'width': 'height'] = ((position > 0 ? position : 0) + 2) + 'px';

      // checking the change status
      if (value !== this.value) {
        this.value = value;
        this.fire('change', {value: value});
      }
    }


    return this;
  },

  // converts the event position into the actual value in terms of the slider measures
  e2val: function(event) {
    var options = this.options, horizontal = options.direction === 'x',
        dims    = this.dims, offset = this.offset, space = this.space,
        cur_pos = event.position()[horizontal ? 'x' : 'y'] - offset - this.hSize/2,
        min_pos = horizontal ? dims.left + offset : dims.top + offset,
        value   = (options.max - options.min) / space * (cur_pos - min_pos),
        type    = this._type;

    if (type == null) {
      return this.shiftTo(horizontal ? options.min + value : options.max - value);
    } else if (type === "to") {
      this.shiftTo(this.values[0], "from");
      return this.shiftTo(horizontal ? options.min + value : options.max - value, "to");
    } else {
      this.shiftTo(this.values[1], "to");
      return this.shiftTo(horizontal ? options.min + value : options.max - value, "from");
    }
  }
});
