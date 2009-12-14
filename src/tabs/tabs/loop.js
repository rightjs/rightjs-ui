/**
 * This module handles the slide-show loop feature for the Tabs
 *
 * Copyright (C) 2009 Nikolay V. Nemshilov aka St.
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
    if (isNumber(delay)) this.options.loop = delay;
    
    // attaching the loop pause feature
    if (this.options.loopPause) {
      this._stopLoop  = this._stopLoop  || this.stopLoop.bind(this);
      this._startLoop = this._startLoop || this.startLoop.bind(this);
      
      this.element
        .stopObserving('mouseover', this._stopLoop)
        .stopObserving('mouseout', this._startLoop)
        .on({
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
      
    }.bind(this).periodical(this.options.loop);
    
    return this;
  },
  
  /**
   * Stops the slideshow loop
   *
   * @return Tabs this
   */
  stopLoop: function() {
    if (this.timer) {
      this.timer.stop();
      this.timer = null;
    }
  }
  
}})());