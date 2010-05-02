/**
 * The resizable unit main file
 *
 * Copyright (C) 2010 Nikolay Nemshilov
 */
var Resizable = new Class(Observer, {
  extend: {
    EVENTS: $('resize initialize destroy'),
    
    Options: {
      direction:  null, // 'top', 'left', 'right', 'bottom', null for bidrectional
      
      minWidth:   null,
      maxWidth:   null,
      minHeight:  null,
      maxHeight:  null
    },
    
    instances: [],
    
    /**
     * Tries to find or instanciate the resizable unit
     * by the mouse event
     *
     * @param Event mouse event
     * @return Resizable instance or null
     */
    findBy: function(event) {
      var target = event.target, element;
      if (target.hasClass('right-resizable-handle')) {
        element = target.parent();
        return Resizable.instances[$uid(element)] || new Resizable(element);
      }
    }
  },
  
  /**
   * Basic constructor
   *
   * @param Element reference
   * @param Object options
   */
  initialize: function(element, options) {
    this.element = $(element);
    this.$super(Object.merge(options,
      eval('('+ this.element.get('data-resizable-options') +')')
    ));
    
    Resizable.instances[$uid(this.element)] = this.init();
    this.fire('initialize');
  },
  
  /**
   * destructor
   *
   * @return Resizable this
   */
  destroy: function() {
    this.element
      .removeClass('right-resizable')
      .removeClass('right-resizable-top')
      .removeClass('right-resizable-left')
      .removeClass('right-resizable-right')
      .removeClass('right-resizable-bottom')
      .insert(this.content.childNodes);
      
    this.content.remove();
    this.handle.remove();
    
    Resizable.instances = Resizable.instances.without($uid(this.element));
    
    this.fire('destroy');
  },
  
  /**
   * Overriding the method to recognize the direction
   * option from the element class-name
   *
   * @param Object options
   * @return Resizable this
   */
  setOptions: function(options) {
    // trying to recognize the direction
    $w('top left right bottom').each(function(direction) {
      if (this.element.hasClass('right-resizable-'+direction))
        options.direction = direction;
    }, this);
    
    // trying to recognize the boundaries
    $w('minWidth maxWidth minHeight maxHeight').each(function(dimension) {
      options[dimension] = options[dimension] || this.findDim(dimension);
    }, this);
    
    return this.$super(options);
  },
  
  /**
   * Starts the resizing process
   *
   * @param Event mouse event
   */
  start: function(event) {
    this.prevSizes = this.element.sizes();
    this.prevEvPos = event.position();
    
    return Resizable.current = this;
  },
  
  /**
   * Tracks the event during the resize process
   *
   * @param Event mouse event
   */
  track: function(event) {
    var event_pos = event.position(), prev_pos = this.prevEvPos,
        prev_size = this.prevSizes, width = prev_size.x, height = prev_size.y,
        x_diff    = prev_pos.x - event_pos.x,
        y_diff    = prev_pos.y - event_pos.y,
        options   = this.options,
        direction = options.direction;
  
    // calculating the new size
    width  += (direction == 'left' ? 1 : -1) * x_diff;
    height += (direction == 'top'  ? 1 : -1) * y_diff;

    // checking the boundaries
    if (options.minWidth  && width  < options.minWidth)  width  = options.minWidth;
    if (options.minHeight && height < options.minHeight) height = options.minHeight;
    if (options.maxWidth  && width  > options.maxWidth)  width  = options.maxWidth;
    if (options.maxHeight && height > options.maxHeight) height = options.maxHeight;

    // applying the sizes
    if (direction != 'left' && direction != 'right') {
      this.setHeight(height);
    }
    if (direction != 'top' && direction != 'bottom') {
      this.setWidth(width);
    }
      
    // updating the previous state
    this.prevSizes = this.element.sizes();
    this.prevEvPos = event_pos;
  },
  
  /**
   * Sets the widget size
   *
   * @param Number width or Object {x:NN, y:NN}
   * @param Number height
   * @return Resizable this
   */
  setSize: function(in_width, in_height) {
    var width = in_width, height = in_height;
    if (isHash(in_width)) {
      width  = in_width.x;
      height = in_width.y;
    }
    return this.setWidth(width).setHeight(height);
  },
  
  /**
   * Sets the width of the widget
   *
   * @param Number width
   * @return Resizable this
   */
  setWidth: function(width) {
    this.element.setWidth(width);
    this.content.setWidth(width - this.contXDiff);
  },
  
  /**
   * Sets the height of the widget
   *
   * @param Number height
   * @return Resizable this
   */
  setHeight: function(height) {
    this.element.setHeight(height);
    this.content.setHeight(height - this.contYDiff);
  },
  
  /**
   * Overloading the standard method so that it was sending
   * current instance as an argument
   *
   * @param String event name
   * @return Resizable this
   */
  fire: function(event) {
    this.$super(event, this);
  },
  
// protected

  init: function() {
    var class_name         = 'right-resizable',
        handle_class_name  = 'right-resizable-handle',
        content_class_name = 'right-resizable-content';
    
    // assigning the main element class
    if (this.options.direction) class_name += '-'+ this.options.direction;
    this.element.addClass(class_name);
    
    // checking for the content block
    this.content = this.element.first('*.'+ content_class_name) || $E('div', {
      'class': content_class_name
    }).insert(this.element.childNodes).insertTo(this.element);
    
    // checking for the handle element
    this.handle = (this.element.first('*.'+ handle_class_name) || $E('div', {
      'class': handle_class_name
    })).insertTo(this.element);
    
    // used later during the resize process
    this.contXDiff = this.element.offsetWidth  - this.content.offsetWidth;
    this.contYDiff = this.element.offsetHeight - this.content.offsetHeight;
    
    return this;
  },
  
  // finds dimensions of the element
  findDim: function(dimension) {
    var style = this.element.getStyle(dimension);
    
    if (style && /\d+/.test(style) && style.toFloat() > 0) {
      var dummy = this.dummy || (this.dummy = $E('div', {style: 'position:absolute; top:0; left: 0; z-index: -1'}));
      dummy.setStyle(dimension.include('Width') ? 'width' : 'height', style);
      dummy.insertTo(this.element, 'before');
      var size = dummy['offset' + (dimension.include('Width') ? 'Width' : 'Height')];
      dummy.remove();
      
      return size;
    }
  }
});