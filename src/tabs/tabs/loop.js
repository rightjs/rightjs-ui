/**
 * This module handles the slide-show loop feature for the Tabs
 *
 * Copyright (C) 2009-2010 Nikolay V. Nemshilov
 */
Tabs.include((function() {
  var old_initialize = Tabs.prototype.initialize;
  
return {
  /**
   * Overloading the constructor to start the slideshow loop automatically
   *
   */
  initialize: function() {
    old_initialize.apply(this, arguments);
    
    if (this.options.loop) {
      this.startLoop();
    }
  },
  
  /**
   * Starts the slideshow loop
   *
   * @param Number optional delay in ms
   * @return Tabs this
   */
  startLoop: function(delay) {
    if (!delay && !this.options.loop) return this;
    
    // attaching the loop pause feature
    if (this.options.loopPause) {
      this._stopLoop  = this._stopLoop  || this.stopLoop.bind(this, true);
      this._startLoop = this._startLoop || this.startLoop.bind(this, delay);
      
      this.forgetHovers().on({
        mouseover: this._stopLoop,
        mouseout:  this._startLoop
      });
    }
    
    if (this.timer) this.timer.stop();
    
    this.timer = function() {
      var enabled = this.tabs.filter('enabled');
      var current = this.tabs.first('current');
      var next    = enabled[enabled.indexOf(current)+1];
      
      this.show(next || enabled.first());
      
    }.bind(this).periodical(this.options.loop || delay);
    
    return this;
  },
  
  /**
   * Stops the slideshow loop
   *
   * @return Tabs this
   */
  stopLoop: function(event, pause) {
    if (this.timer) {
      this.timer.stop();
      this.timer = null;
    }
    if (!pause && this._startLoop)
      this.forgetHovers();
  },
  
// private
  forgetHovers: function() {
    return this.element
      .stopObserving('mouseover', this._stopLoop)
      .stopObserving('mouseout', this._startLoop);
  }
  
  
}})());