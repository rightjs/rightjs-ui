/**
 * The tab panels behavior logic
 *
 * Copyright (C) Nikolay V. Nemshilov aka St.
 */
Tabs.Panel = new Class(Observer, {
  
  initialize: function(element, tab) {
    this.tab     = tab;
    this.id      = element.id;
    this.element = element.addClass('right-tabs-panel');
  },
  
  // shows the panel
  show: function() {
    return this.resizing(function() {
      this.element.radioClass('right-tabs-panel-current');
    });
  },
  
  // updates the panel content
  update: function(content) {
    return this.resizing(function() {
      this.element.update(content||'');
    });
  },
  
  // removes the pannel
  remove: function() {
    this.element.remove();
    return this;
  },
  
  // locks the panel with a spinner locker
  lock: function() {
    var locker  = $E('div', {'class': 'right-tabs-panel-locker'});
    var spinner = $E('div', {'class': 'right-tabs-panel-locker-spinner'}).insertTo(locker);
    var dots    = '1234'.split('').map(function(i) {
      return $E('div', {'class': i == 1 ? 'glow':null}).insertTo(spinner);
    });
    
    (function() {
      spinner.insert(dots.last(), 'top');
      dots.unshift(dots.pop());
    }).periodical(400);
    
    this.element.insert(locker, 'top');
  },
  
// protected
  
  resizing: function(callback) {
    if (this.__working) return this.resizing.bind(this, callback).delay(20);
    
    var controller = this.tab.controller;
    var options    = controller.options;
    var prev_panel = controller.element.subNodes().first('hasClass', 'right-tabs-panel-current');
    var this_panel = this.element;
    var swapping   = prev_panel != this_panel;
    var loading    = this.element.first('div.right-tabs-panel-locker');
    
    if (options.resizeFx && self.Fx && prev_panel && (swapping || loading)) {
      this.__working = true;
      
      // calculating the visual effects durations
      var fx_name  = (options.resizeFx == 'both' && loading) ? 'slide' : options.resizeFx;
      var duration = options.resizeDuration; duration = Fx.Durations[duration] || duration;
      var resize_duration = fx_name == 'fade' ? 0 : fx_name == 'slide' ? duration : duration / 2;
      var fade_duration   = duration - resize_duration;
      
      if (fx_name != 'slide')
        this_panel.setStyle({opacity: 0});
      
      // saving the previous sizes
      var prev_panel_height = (controller.isHarmonica && swapping) ? 0 : prev_panel.offsetHeight;
      
      // applying the changes
      callback.call(this);
      
      // getting the new size
      var new_panel_height  = this_panel.offsetHeight;
      
      
      if (fx_name != 'fade' && prev_panel_height != new_panel_height) {
        // preserving the whole element size so it didn't jump when we are tossing the tabs around
        controller.element.style.height = controller.element.offsetHeight + 'px';
        
        // wrapping the element with an overflowed element to visualize the resize
        var fx_wrapper = $E('div', {'class': 'right-tabs-resizer'}).setHeight(prev_panel_height);
        var set_back = fx_wrapper.replace.bind(fx_wrapper, this_panel);
        this_panel.wrap(fx_wrapper);
        
        
        // in case of harmonica nicely hidding the previous panel
        if (controller.isHarmonica && swapping) {
          prev_panel.addClass('right-tabs-panel-current');
          var hide_wrapper = $E('div', {'class': 'right-tabs-resizer'}).setHeight(prev_panel.offsetHeight);
          var prev_back = function() {
            hide_wrapper.replace(prev_panel.removeClass('right-tabs-panel-current'));
          };
          prev_panel.wrap(hide_wrapper);
        }
        
        // getting back the auto-size so we could resize it
        controller.element.style.height = 'auto';
        
        if (hide_wrapper) hide_wrapper.morph({height: '0px'}, {duration: resize_duration, onFinish: prev_back});
        fx_wrapper.morph({height: new_panel_height + 'px'}, {duration: resize_duration, onFinish: set_back });
      } else {
        // removing the resize duration out of the equasion
        rezise_duration = 0;
        duration = fade_duration;
      }
      
      if (fx_name != 'slide')
        this_panel.morph.bind(this_panel, {opacity: 1}, {duration: fade_duration}).delay(resize_duration);
      
      // removing the working marker
      (function() { this.__working = false; }).bind(this).delay(duration);
    } else {
      callback.call(this);
    }
    
    return this;
  }
  
});