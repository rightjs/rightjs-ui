/**
 * This module handles the colorpicker assignments
 * to input fields
 *
 * Copyright (C) 2010 Nikolay Nemshilov
 */
Colorpicker.include({
  /**
   * Hides the pop up element
   *
   * @return Colorpicker this
   */
  hide: function() {
    if (!this.element.hasClass('right-colorpicker-inline')) {
      this.target = null;
      Colorpicker.current = null;
      this.element.hide(this.options.fxName, {
        duration: this.options.fxDuration
      });
      
      this.fire('hide');
    }
    
    return this;
  },
  
  /**
   * Shows the element as a popup
   *
   * @param Element where to show the popup
   * @return Colorpicker this
   */
  show: function(target) {
    // moving into the target position
    if (target) {
      var element = $(target).dimensions(), style = this.element.style;
      
      if (element) {
        style.left = element.left + 'px';
        style.top  = element.top + element.height + 'px';
        
        this.target = $(target);
      }
    }
    
    // hide the others
    if (Colorpicker.current && Colorpicker.current !== this) {
      Colorpicker.current.element.hide();
    }
    
    this.element.insertTo(document.body);
    
    if (!this.element.visible()) {
      this.element.show(this.options.fxName, {
        duration: this.options.fxDuration
      });
      
      this.fire('show');
    }
    
    if (this.target) {
      this.setValue(this.target.value);
    }
    
    return Colorpicker.current = this;
  },
  
  /**
   * Toggles the visibility status
   *
   * @param Element target
   * @return Colorpicker this
   */
  toggle: function(target) {
    return this[this.element.visible() ? 'hide' : 'show'](target);
  },
  
  /**
   * Assigns the colorpicer to work in pair with an input of a content element
   *
   * @param Element reference
   * @param Element optional trigger element
   * @return Colorpicker this
   */
  assignTo: function(input, trigger) {
    var input = $(input), trigger = $(trigger);
    
    if (trigger) {
      trigger.onClick(function(e) {
        e.stop();
        this.toggle(input.focus());
      }.bind(this));
    } else {
      input.onFocus(this.show.bind(this, input));
    }
    
    input.on({
      blur:  function() {
        this.timer = (function() {
          this.hide();
        }).bind(this).delay(100);
      }.bind(this),
      
      keyUp: function() {
        this.setValue(input.value);
      }.bind(this)
    });
    
    this.element.hide();
    
    return this;
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
      this.onChange(function(color) {
        element.style.backgroundColor = this.toRgb();
      }.bind(this));
    }
    return this;
  },
  
// protected

  cancelTimer: function() {
    (function() { // IE has a lack of sync in here
      if (this.timer) {
        this.timer.cancel();
        this.timer = null;
      }
    }).bind(this).delay(10);
  }
});