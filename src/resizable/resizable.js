/**
 * The resizable unit main file
 *
 * Copyright (C) 2010-2011 Nikolay Nemshilov
 */
var Resizable = new Widget({
  extend: {
    version: '2.2.1',

    EVENTS: $w('resize start release'),

    Options: {
      direction:  null, // 'top', 'left', 'right', 'bottom', null for bidrectional

      minWidth:   null,
      maxWidth:   null,
      minHeight:  null,
      maxHeight:  null
    }
  },

  /**
   * Basic constructor
   *
   * @param Element reference
   * @param Object options
   * @return void
   */
  initialize: function(element, options) {
    this
      .$super('resizable', this.old_inst = $(element))
      .setOptions(options);

    if (this.options.direction) {
      this.addClass('rui-resizable-'+ this.options.direction);
    } else {
      this.addClass('rui-resizable');
    }

    // initializing the inner structure
    this.content = this.first('.rui-resizable-content') ||
      $E('div', {'class': 'rui-resizable-content'}).insert(this.children()).insertTo(this);
    this.handle  = this.first('.rui-resizable-handle')  ||
      $E('div', {'class': 'rui-resizable-handle'}).insertTo(this);

    // resizing the content block so it fully fit the resizable element
    var size = this.size();

    size.x -= parseInt(this.getStyle('borderLeftWidth'), 10) + parseInt(this.getStyle('borderRightWidth'), 10);
    size.y -= parseInt(this.getStyle('borderTopWidth'), 10) + parseInt(this.getStyle('borderBottomWidth'), 10);

    this.content.resize(size);
  },

  /**
   * destructor
   *
   * @return Resizable this
   */
  destroy: function() {
    this
      .removeClass('rui-resizable')
      .removeClass('rui-resizable-top')
      .removeClass('rui-resizable-left')
      .removeClass('rui-resizable-right')
      .removeClass('rui-resizable-bottom')
      .insert(this.content._.childNodes);

    this.content.remove();
    this.handle.remove();

    // swapping the old element back
    if (this.old_inst) {
      Wrapper.Cache[$uid(this._)] = this.old_inst;
    }

    return this;
  },

  /**
   * Overriding the method to recognize the direction
   * option from the element class-name
   *
   * @param Object options
   * @return Resizable this
   */
  setOptions: function(options, context) {
    options = options || {};

    // trying to recognize the direction
    $w('top left right bottom').each(function(direction) {
      if (this.hasClass('rui-resizable-'+ direction)) {
        options.direction = direction;
      }
    }, this);

    return this.$super(options, context);
  },

  /**
   * Starts the resizing process
   *
   * @param Event mouse event
   */
  start: function(event) {
    this.prevSizes = this.size();
    this.prevEvPos = event.position();

    // used later during the resize process
    this.contXDiff = this.size().x - this.content.size().x;
    this.contYDiff = this.size().y - this.content.size().y;

    // trying to recognize the boundaries
    $w('minWidth maxWidth minHeight maxHeight').each(function(dimension) {
      this[dimension] = this.findDim(dimension);
    }, this);

    return this.fire('start', {original: event});
  },

  /**
   * Tracks the event during the resize process
   *
   * @param Event mouse event
   */
  track: function(event) {
    var event_pos = event.position(), prev_pos = this.prevEvPos,
        handle    = this.handle.dimensions(),
        prev_size = this.prevSizes, width = prev_size.x, height = prev_size.y,
        x_diff    = prev_pos.x - event_pos.x,
        y_diff    = prev_pos.y - event_pos.y,
        min_x     = this.minWidth,
        max_x     = this.maxWidth,
        min_y     = this.minHeight,
        max_y     = this.maxHeight,
        options   = this.options,
        direction = options.direction;

    // calculating the new size
    width  += (direction === 'left' ? 1 : -1) * x_diff;
    height += (direction === 'top'  ? 1 : -1) * y_diff;

    // applying the boundaries
    if (width  < min_x) { width  = min_x; }
    if (width  > max_x) { width  = max_x; }
    if (height < min_y) { height = min_y; }
    if (height > max_y) { height = max_y; }

    // applying the sizes
    if (prev_size.x !== width && direction !== 'top' && direction !== 'bottom') {
      this.setWidth(width);
    }
    if (prev_size.y !== height && direction !== 'left' && direction !== 'right') {
      this.setHeight(height);
    }

    // adjusting the previous cursor position so that it didn't had a shift
    if (width == min_x || width == max_x) {
      event_pos.x = handle.left + handle.width / 2;
    }
    if (height == min_y || height == max_y) {
      event_pos.y = handle.top + handle.height / 2;
    }

    this.prevEvPos = event_pos;
    this.prevSizes = this.size();

    this.fire('resize', {original: event});
  },

  /**
   * Sets the width of the widget
   *
   * @param Number width
   * @return Resizable this
   */
  setWidth: function(width) {
    this.content.setWidth(width - this.contXDiff);
    return this.$super(width);
  },

  /**
   * Sets the height of the widget
   *
   * @param Number height
   * @return Resizable this
   */
  setHeight: function(height) {
    this.content.setHeight(height - this.contYDiff);
    return this.$super(height);
  },

  /**
   * Marks it the end of the action
   *
   * @return Resizable this
   */
  release: function(event) {
    return this.fire('release', {original: event});
  },

// protected

  // finds dimensions of the element
  findDim: function(dimension) {
    var style = this.options[dimension] || this.getStyle(dimension);

    if (style && /\d+/.test(style) && parseFloat(style) > 0) {
      var what  = R(dimension).include('Width') ? 'width' : 'height',
          dummy = (this._dummy || (this._dummy = $E('div', {
            style: 'visibility:hidden;z-index:-1'
          })))
          .setStyle(what, style)
          .insertTo(this, 'before');

      var size = dummy._['offset' + R(what).capitalize()];
      dummy.remove();

      return size;
    }
  }
});
