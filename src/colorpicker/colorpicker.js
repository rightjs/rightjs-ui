/**
 * The basic file for Colorpicker
 *
 * Copyright (C) 2010 Nikolay Nemshilov
 */
var Colorpicker = new Class(Observer, {
  extend: {
    EVENTS: $w('change show hide done'),
    
    Options: {
      format:     'hex',   // hex or rgb
      
      update:     null,    // an element to update with the color text
      updateBg:   null,    // an element to update it's background color
      
      fxName:     'fade',  // popup displaying fx
      fxDuration: 'short',
      
      cssRule:    '*[rel^=colorpicker]'
    },
    
    i18n: {
      Done: 'Done'
    },
    
    // builds or finds a colorpicker for the target element
    find: function(element) {
      var uid = $uid(element), instances = Colorpicker.instances;
      
      if (!instances[uid]) {
        var pick = instances[uid] = new Colorpicker(eval('('+ element.get('data-colorpicker-options') +')'));
        
        if (element.tagName == 'INPUT')
          pick.assignTo(element);
        else {
          var attr = Colorpicker.Options.cssRule.split('[').last().split('^=').first(),
              match = /\[(.+?)\]/.exec(element.get(attr)), input;
          
          if (match && (input = $(match[1]))) {
            pick.assignTo(input, element);
          }
        }
      }
      
      return instances[uid];
    },
    
    instances: []
  },
  
  /**
   * basic constructor
   *
   * @param Object options
   */
  initialize: function(options) {
    this.$super(options);
    this.init();
  },
  
  /**
   * Sets the color of the widget
   *
   * @param mixed value, Array or HEX or RGB value
   * @return Colorpicker this
   */
  setValue: function(value) {
    var color = isArray(value) ? value : this.toColor(value);
    if (color && color.length == 3) {
      
      // normalizing the data
      color = color.map(function(value) {
        return this.bound((''+value).toInt(), 0, 255);
      }, this);
      
      this.color = color;
      this.color2tint().update();
    }
    return this;
  },
  
  /**
   * Returns the value of the widget
   * formatted according to the options
   *
   * @param Boolean if you need a clean RGB values array
   * @return mixed value
   */
  getValue: function(array) {
    return array ? this.color : this[this.options.format === 'rgb' ? 'toRgb' : 'toHex']();
  },
  
  /**
   * Inlines the widget into the given element
   *
   * @param Element reference
   * @param String optional position
   * @return Colorpicker this
   */
  insertTo: function(element, position) {
    this.element
      .addClass('right-colorpicker-inline')
      .insertTo(element, position);
      
    return this;
  },
  
// protected

  // initializes the widget
  init: function() {
    this.build();
    
    // attaching the mouse-events to the fields
    [this.field, this.colors].each(function(element) {
      element.onMousedown(this.startTrack.bind(this));
    }, this);
    
    // tracking the changes on the input fields
    [this.display, this.rDisplay, this.gDisplay, this.bDisplay].each('on', {
      keyup: this.recalc.bind(this),
      blur:  this.update.bind(this),
      focus: this.cancelTimer.bind(this)
    });
    
    // attaching the done button
    this.button.onClick(this.fire.bind(this, 'done'));
    
    // preventing the general body clicks
    this.element.onMousedown(function(event) {
      if (event.target.tagName !== 'INPUT') {
        event.stop();
        this.cancelTimer();
      }
    }.bind(this));
    
    // attaching the picker own events
    this
      .onDone('hide')
      .onChange(function(color) {
        if (this.target) {
          this.target[this.target.tagName == 'INPUT' ? 'value' : 'innerHTML'] = 
            this[this.options.format == 'rgb' ? 'toRgb' : 'toHex']();
        }
      }.bind(this));
    
    // hooking up the elements to update
    if (this.options.update)   this.assignTo(this.options.update);
    if (this.options.updateBg) this.updateBg(this.options.updateBg);
    
    // setting up the initial value
    // NOTE: to speed the things up a bit we use params
    //       for tint, saturation and brightness and 
    //       normal RGB value to keep the current color
    this.tint   = [1, 0, 0];
    this.satur  = 0;
    this.bright = 1;
    this.color  = [255, 255, 255];
    
    this.recalc().update();
  },
  
  // builds the widget
  build: function() {
    var base = this.element = $E('div', {'class': 'right-colorpicker right-ui-panel'});
    
    // the field block
    this.field = $E('div', {'class': 'field'}).insertTo(base);
    this.fieldPointer = $E('div', {'class': 'field-pointer'}).insertTo(this.field);
    
    // the tint block
    this.colors = $E('div', {'class': 'colors'}).insertTo(base);
    this.colorsPointer = $E('div', {'class': 'colors-pointer'}).insertTo(this.colors);
    
    // the controls block
    $E('div', {'class': 'controls'}).insert([
      this.preview = $E('div', {'class': 'preview', 'html': '&nbsp;'}).insertTo(base),
      this.display = $E('input', {'type': 'text', 'class': 'display', maxlength: 7}).insertTo(base),
      $E('div', {'class': 'rgb-display'}).insert([
        $E('div').insert([$E('label', {html: 'R:'}), this.rDisplay = $E('input', {maxlength: 3, cIndex: 0})]),
        $E('div').insert([$E('label', {html: 'G:'}), this.gDisplay = $E('input', {maxlength: 3, cIndex: 1})]),
        $E('div').insert([$E('label', {html: 'B:'}), this.bDisplay = $E('input', {maxlength: 3, cIndex: 2})])
      ]),
      this.button  = $E('input', {'type': 'button', 'class': 'right-ui-button', value: Colorpicker.i18n.Done})
    ]).insertTo(base);
  },
  
  // updates the preview and pointer positions
  update: function() {
    this.field.style.backgroundColor   = 'rgb('+ this.tint.map(function(c) { return (c*255).round(); }) +')';
    this.preview.style.backgroundColor = this.display.value = this.toHex();
    
    // updating the input fields
    var color = this.color;
    this.rDisplay.value = color[0];
    this.gDisplay.value = color[1];
    this.bDisplay.value = color[2];
    
    // adjusting the field pointer position
    var pointer = this.fieldPointer.style,
      field = this.field.sizes(),
      top  = field.y - this.bright * field.y - 2,
      left = this.satur * field.x - 2;
    
    pointer.top  = this.bound(top,  0, field.y - 5) + 'px';
    pointer.left = this.bound(left, 0, field.x - 5) + 'px';
    
    // adjusting the ting pointer position
    var field = this.colors.sizes(), tint = this.tint, position;
  
    if (tint[1] == 0) { // the red-blue section
      position = tint[0] == 1 ? tint[2] : (2 - tint[0]);
    } else if (tint[0] == 0) { // the blue-green section
      position = 2 + (tint[2] == 1 ? tint[1] : (2 - tint[2]));
    } else { // the green-red section
      position = 4 + (tint[1] == 1 ? tint[0] : (2 - tint[1]));
    }
    
    position = position / 6 * field.y;
    
    this.colorsPointer.style.top = this.bound(position, 0, field.y - 4) + 'px';
    
    // tracking the color change events
    if (this.prevColor !== ''+this.color) {
      this.fire('change', this.color);
      this.prevColor = ''+ this.color;
    }
    
    return this;
  },
  
  // recalculates the state after the input field changes
  recalc: function(event) {
    if (event) {
      var field = event.target, value = field.value, color = this.color.clone(), changed=false;
      
      if (field == this.display && /#\w{6}/.test(value)) {
        // using the hex values
        changed = color = this.toColor(value);
      } else if (/^\d+$/.test(value)) {
        // using the rgb values
        color[field.cIndex] = value;
        changed  = true;
      }
      
      if (changed) this.setValue(color);
      
    } else {
      this.tint2color();
    }
    
    return this;
  },
  
  // starts the mousemoves tracking
  startTrack: function(event) {
    event.stop();
    this.stopTrack();
    this.cancelTimer();
    Colorpicker.tracking = this;
    event.target.tracking = true;
    this.trackMove(event); // jumping over there
  },
  
  // stops tracking the mousemoves
  stopTrack: function() {
    Colorpicker.tracking = false;
    this.field.tracking  = false;
    this.colors.tracking = false;
  },
  
  // tracks the cursor moves over the fields
  trackMove: function(event) {
    var field, pos = event.position(), top, left;
    
    if (this.field.tracking) {
      field   = this.field.dimensions();
    } else if (this.colors.tracking) {
      field   = this.colors.dimensions();
    }
    
    if (field) {
      top   = this.bound(pos.y - field.top,  0, field.height);
      left  = this.bound(pos.x - field.left, 0, field.width);
      
      if (this.field.tracking) {
        this.satur  = left / field.width;
        this.bright = 1 - top / field.height;
        
      } else if (this.colors.tracking) {
        // preventing it from jumping to the top
        if (top == field.height) top = field.height - 0.1;
        
        var step = field.height / 6,
            tint = this.tint = [0, 0, 0],
            stright = top % step / step,
            reverse = 1 - stright;
        
        if (top < step) {
          tint[0] = 1;
          tint[2] = stright;
        } else if (top < step * 2) {
          tint[0] = reverse;
          tint[2] = 1;
        } else if (top < step * 3) {
          tint[2] = 1;
          tint[1] = stright;
        } else if (top < step * 4) {
          tint[2] = reverse;
          tint[1] = 1;
        } else if (top < step * 5) {
          tint[1] = 1;
          tint[0] = stright;
        } else {
          tint[1] = reverse;
          tint[0] = 1;
        }
      }
      
      this.recalc().update();
    }
  }
});