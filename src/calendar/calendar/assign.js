/**
 * This module handles the calendar assignment to an input field
 *
 * Copyright (C) 2009 Nikolay V. Nemshilov aka St.
 */
Calendar.include({
  /**
   * Assigns the calendar to serve the given input element
   *
   * If no trigger element specified, then the calendar will
   * appear and disappear with the element haveing its focus
   *
   * If a trigger element is specified, then the calendar will
   * appear/disappear only by clicking on the trigger element
   *
   * @param Element input field
   * @param Element optional trigger
   * @return Calendar this
   */
  assignTo: function(input, trigger) {
    var input = $(input), trigger = $(trigger);
    
    if (trigger) {
      trigger.onClick(function(e) {
        e.stop();
        this.toggleAt(input.focus());
      }.bind(this));
    } else {
      input.on({
        focus: this.showAt.bind(this, input),
        click: function(e) { e.stop(); }
      });
    }
    
    document.onClick(this.hide.bind(this));
    
    return this;
  },
  
  /**
   * Shows the calendar at the given element left-bottom corner
   *
   * @param Element element or String element id
   * @return Calendar this
   */
  showAt: function(element) {
    var element = $(element), dims = element.dimensions();
    this.setDate(Date.parse(element.value) || new Date());
    
    // RightJS < 1.4.1 bug handling
    if (RightJS.version.replace('.', '').toInt() < 141 && Browser.WebKit) {
      dims.left += document.body.scrolls().x;
      dims.top  += document.body.scrolls().y;
    }
    
    this.element.setStyle({
      position: 'absolute',
      margin: '0',
      left: (dims.left)+'px',
      top: (dims.top + dims.height)+'px'
    }).insertTo(document.body);
      
    return this.show();
  },
  
  /**
   * Toggles the calendar state at the associated element position
   *
   * @param Element input
   * @return Calendar this
   */
  toggleAt: function(input) {
    if (this.element.parentNode && this.element.visible()) {
      this.hide();
    } else {
      this.showAt(input);
    }
    return this;
  }
});