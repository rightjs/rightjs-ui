/**
 * The tab panels behavior logic
 *
 * Copyright (C) 2009-2010 Nikolay V. Nemshilov
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
      this.tab.controller.tabs.each(function(tab) {
        var element = tab.panel.element;
        element[element == this.element ?
          'addClass' : 'removeClass']('right-tabs-panel-current');
      }, this);
    });
  },
  
  // updates the panel content
  update: function(content) {
    // don't use resize if it's some other hidden tab was loaded asynch
    if (this.tab.current()) {
      this.resizing(function() {
        this.element.update(content||'');
      });
    } else {
      this.element.update(content||'');
    }
    
    return this;
  },
  
  // removes the pannel
  remove: function() {
    this.element.remove();
    return this;
  },
  
  // locks the panel with a spinner locker
  lock: function() {
    this.element.insert(this.locker(), 'top');
  },
  
// protected
  
  resizing: function(callback) {
    var controller = this.tab.controller;
    
    if (controller.__working) return this.resizing.bind(this, callback).delay(100);
    
    var options    = controller.options;
    var prev_panel = controller.element.first('.right-tabs-panel-current');
    var this_panel = this.element;
    var swapping   = prev_panel != this_panel;
    var loading    = this.element.first('div.right-tabs-panel-locker');
    
    // sometimes it looses the parent on remote tabs
    if (this_panel.parentNode.hasClass('right-tabs-resizer')) this_panel.insertTo(prev_panel.parentNode);
    
    if (options.resizeFx && self.Fx && prev_panel && (swapping || loading)) {
      controller.__working = true;
      var unlock = function() { controller.__working = false; };
      
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
      var fx_wrapper = null;
      
      if (fx_name != 'fade' && prev_panel_height != new_panel_height) {
        // preserving the whole element size so it didn't jump when we are tossing the tabs around
        controller.element.style.height = controller.element.offsetHeight + 'px';
        
        // wrapping the element with an overflowed element to visualize the resize
        fx_wrapper = $E('div', {
          'class': 'right-tabs-resizer',
          'style': 'height: '+ prev_panel_height + 'px'
        });
        
        // in case of harmonica nicely hidding the previous panel
        if (controller.isHarmonica && swapping) {
          prev_panel.addClass('right-tabs-panel-current');
          var hide_wrapper = $E('div', {'class': 'right-tabs-resizer'});
          hide_wrapper.style.height = prev_panel.offsetHeight + 'px';
          var prev_back = function() {
            hide_wrapper.replace(prev_panel.removeClass('right-tabs-panel-current'));
          };
          prev_panel.wrap(hide_wrapper);
          
          fx_wrapper.style.height = '0px';
        }
        
        this_panel.wrap(fx_wrapper);
        
        // getting back the auto-size so we could resize it
        controller.element.style.height = 'auto';
        
      } else {
        // removing the resize duration out of the equasion
        rezise_duration = 0;
        duration = fade_duration;
      }
      
      var counter = 0;
      var set_back = function() {
        if (fx_wrapper) {
          if (fx_name == 'both' && !counter)
            return counter ++;
            
          fx_wrapper.replace(this_panel);
        }
        
        unlock();
      };
      
      if (hide_wrapper)
        hide_wrapper.morph({height: '0px'}, 
          {duration: resize_duration, onFinish: prev_back});
      
      if (fx_wrapper)
        fx_wrapper.morph({height: new_panel_height + 'px'},
          {duration: resize_duration, onFinish: set_back});
      
      if (fx_name != 'slide')
        this_panel.morph.bind(this_panel, {opacity: 1},
          {duration: fade_duration, onFinish: set_back}
            ).delay(resize_duration);
            
      if (!fx_wrapper && fx_name == 'slide')
        set_back();
        
    } else {
      callback.call(this);
    }
    
    return this;
  },
  
  // builds the locker element
  locker: function() {
    if (!this._locker) {
      var locker  = $E('div', {'class': 'right-tabs-panel-locker'});
      var spinner = $E('div', {'class': 'right-tabs-panel-locker-spinner'}).insertTo(locker);
      var dots    = '1234'.split('').map(function(i) {
        return $E('div', {'class': i == 1 ? 'glow':null}).insertTo(spinner);
      });

      (function() {
        spinner.insert(dots.last(), 'top');
        dots.unshift(dots.pop());
      }).periodical(400);
      
      this._locker = locker;
    }
    return this._locker;
  }
  
});