/**
 * The basic file for Colorpicker
 *
 * Copyright (C) 2010 Nikolay Nemshilov
 */
var Colorpicker = new Widget({
  include: [Toggler, Assignable],
  
  extend: {
    version: '2.0.0',
    
    EVENTS: $w('change show hide done'),
    
    Options: {
      format:     'hex',   // hex or rgb
      
      update:     null,    // an element to update with the color text
      updateBg:   null,    // an element to update it's background color
      trigger:    null,    // a trigger element for the popup
      
      fxName:     'fade',  // popup displaying fx
      fxDuration: 'short',
      
      cssRule:    '*[data-colorpicker]'
    },
    
    i18n: {
      Done: 'Done'
    },
    
    // hides all the popup colorpickers on the page
    hideAll: function() {
      $$('div.rui-colorpicker').each(function(picker) {
        if (picker instanceof Colorpicker && !picker.inlined()) {
          picker.hide();
        }
      });
    }
  },
  
  /**
   * basic constructor
   *
   * @param Object options
   */
  initialize: function(options) {
    this
      .$super('colorpicker', options)
      .addClass('rui-panel')
      .insert([
        this.field    = new Field(),
        this.colors   = new Colors(),
        this.controls = new Controls()
      ])
      .on({
        mousedown: this.startTrack,
        
        keyup: this.recalc,
        blur:  this.update,
        focus: this.cancelTimer,
        
        done:  this.done
      });
    
    // hooking up the elements to update
    if (this.options.update)   { this.assignTo(this.options.update, this.options.trigger); }
    if (this.options.updateBg) { this.updateBg(this.options.updateBg); }
    
    // setting up the initial values
    this.tint   = R([1, 0, 0]);
    this.satur  = 0;
    this.bright = 1;
    this.color  = R([255, 255, 255]);
    
    this.recalc().update();
  },
  
  /**
   * Sets the color of the widget
   *
   * @param mixed value, Array or HEX or RGB value
   * @return Colorpicker this
   */
  setValue: function(value) {
    var color = isArray(value) ? value : this.toColor(value);
    if (color && color.length === 3) {
      
      // normalizing the data
      color = color.map(function(value) {
        return this.bound(parseInt(''+value), 0, 255);
      }, this);
      
      this.color = color;
      this.color2tint().update();
      
      // reupdating the popup-state a bit later when we have the sizes
      if (!this.colors.size().y) {
        this.update.bind(this).delay(20);
      }
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
   * Assigns the colorpicer to automatically update
   * given element's background on changes
   *
   * @param mixed element reference
   * @return Colorpicker this
   */
  updateBg: function(element_ref) {
    var element = $(element_ref);
    if (element) {
      this.onChange(R(function(color) {
        element._.style.backgroundColor = this.toRgb();
      }).bind(this));
    }
    return this;
  },
  
  /**
   * Inlines the widget into the given element
   *
   * @param Element reference
   * @param String optional position
   * @return Colorpicker this
   */
  insertTo: function(element, position) {
    return this
      .$super(element, position)
      .addClass('rui-colorpicker-inline');
  },
  
  /**
   * Checks if that's an inlined version of the widget
   *
   * @return Boolean check result
   */
  inlined: function() {
    return this.hasClass('rui-colorpicker-inline');
  },
  
  /**
   * Finalizes the action
   *
   * @return Colorpicker this
   */
  done: function() {
    if (!this.inlined()) {
      this.hide();
    }
    return this;
  },
  
// protected

  // catching up the user options
  setOptions: function(user_options) {
    user_options = user_options || {};
    this.$super(user_options, $(user_options.trigger || user_options.update));
  },

  // updates the preview and pointer positions
  update: function() {
    this.field._.style.backgroundColor   = 'rgb('+ this.tint.map(function(c) { return Math.round(c*255); }) +')';
    
    // updating the input fields
    var color = this.color, controls = this.controls;
    
    controls.preview._.style.backgroundColor = controls.display._.value = this.toHex();
    
    controls.rDisplay._.value = color[0];
    controls.gDisplay._.value = color[1];
    controls.bDisplay._.value = color[2];
    
    // adjusting the field pointer position
    var pointer = this.field.pointer._.style,
      field = this.field.size(),
      top  = field.y - this.bright * field.y - 2,
      left = this.satur * field.x - 2;
    
    pointer.top  = this.bound(top,  0, field.y - 5) + 'px';
    pointer.left = this.bound(left, 0, field.x - 5) + 'px';
    
    // adjusting the ting pointer position
    var tint = this.tint, position;
    field = this.colors.size();
  
    if (tint[1] == 0) { // the red-blue section
      position = tint[0] == 1 ? tint[2] : (2 - tint[0]);
    } else if (tint[0] == 0) { // the blue-green section
      position = 2 + (tint[2] == 1 ? tint[1] : (2 - tint[2]));
    } else { // the green-red section
      position = 4 + (tint[1] == 1 ? tint[0] : (2 - tint[1]));
    }
    
    position = position / 6 * field.y;
    
    this.colors.pointer._.style.top = this.bound(position, 0, field.y - 4) + 'px';
    
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
      var field = event.target, value = field._.value, color = $A(this.color), changed=false;
      
      if (field === this.controls.display && /#\w{6}/.test(value)) {
        // using the hex values
        changed = color = this.toColor(value);
      } else if (/^\d+$/.test(value)) {
        // using the rgb values
        color[field._.cIndex] = value;
        changed  = true;
      }
      
      if (changed) { this.setValue(color); }
      
    } else {
      this.tint2color();
    }
    
    return this;
  },
  
  // starts the mousemoves tracking
  startTrack: function(event) {
    this.stopTrack();
    this.cancelTimer();
    
    if (event.target === this.field.pointer) {
      event.target = this.field;
    } else if (event.target === this.colors.pointer) {
      event.target = this.colors;
    }
    
    if (event.target === this.field || event.target === this.colors) {
      event.stop();
      Colorpicker.tracking = this;
      event.target.tracking = true;
      this.trackMove(event); // jumping over there
    }
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
        if (top == field.height) { top = field.height - 0.1; }
        
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
  },
  
  cancelTimer: function(event) {
    R(function() { // IE has a lack of sync in here
      if (this._hide_delay) {
        this._hide_delay.cancel();
        this._hide_delay = null;
      }
    }).bind(this).delay(10);
  }
});