/**
 * The tab panels behavior logic
 *
 * Copyright (C) Nikolay V. Nemshilov aka St.
 */
Tabs.Panel = new Class(Observer, {
  
  initialize: function(element, tab) {
    this.tab     = tab;
    this.id      = element.id;
    this.element = element.addClass('r-tabs-panel');
  },
  
  // shows the panel
  show: function() {
    return this.resizing(function() {
      this.element.radioClass('r-tabs-panel-current');
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
    var locker  = $E('div', {'class': 'r-tabs-panel-locker'});
    var spinner = $E('div', {'class': 'r-tabs-panel-locker-spinner'}).insertTo(locker);
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
    
    var controller = this.tab.controller, options = controller.options;
    
    if (options.resizeFx && self.Fx) {
      this.__working = true;
      
      var element  = controller.element;
      var panel    = this.element;
      var fx_name  = options.resizeFx;
      
      if (fx_name == 'both' && this.element.first('div.r-tabs-panel-locker')) fx_name = 'slide';
      
      // calculating the visual effects durations
      var duration = options.resizeDuration; duration = Fx.Durations[duration] || duration;
      var resize_duration = options.resizeFx == 'fade' ? 0 : options.resizeFx == 'slide' ? duration : duration / 2;
      var fade_duration   = duration - resize_duration;
      
      // saving the previous sizes
      var prev_panel = controller.element.subNodes().filter('hasClass', 'r-tabs-panel-current').last();
      var prev_element_height = element.offsetHeight;
      var prev_panel_height   = prev_panel ? prev_panel.offsetHeight : 0;
      
      // preparing the element for resize
      if (fx_name != 'fade' && !controller.isHarmonica) {
        element.setStyle({height: prev_element_height+'px'});
      }
      
      
      if (fx_name != 'slide')
        panel.setStyle({opacity: 0});
      
      
      callback.call(this);
      
      
      // resizing the tabs element
      if (fx_name != 'fade') {
        if (controller.isHarmonica) {
          var old_size  = prev_panel_height;
          var new_size  = panel.offsetHeight;
          var set_back  = panel.setStyle.bind(element, {height: 'auto'});
          var container = panel;
        } else {
          var old_size  = prev_element_height;
          var new_size  = prev_element_height + panel.offsetHeight - prev_panel_height;
          var set_back  = element.setStyle.bind(element, {height: 'auto'});
          var container = element;
          
          if (new_size != old_size) {
            container.morph({height: new_size + 'px'}, {onFinish: set_back, duration: resize_duration });
          } else {
            set_back();
          }
        }
        
        
      }
      
      if (fx_name != 'slide')
        panel.morph.bind(panel, {opacity: 1}, {duration: fade_duration}).delay(resize_duration);
      
      
      // removing the working marker
      (function() { this.__working = false; }).bind(this).delay(duration);
    } else {
      callback.call(this);
    }
    
    return this;
  }
  
});