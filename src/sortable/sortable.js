/**
 * The Sortable unit
 *
 * Copyright (C) Nikolay V. Nemshilov aka St.
 */
var Sortable = new Class(Observer, {
  extend: {
    EVENTS: $w('update'),
    
    Options: {
      axis: 'auto',        // 'auto', 'vertical', 'horizontal', 'x', 'y'
      
      tags: 'li',          // the list items tag name
      
      relName: 'sortable'  // the auto-discovery feature key
    }
  },
  
  /**
   * basic constructor
   *
   * @param mixed element reference
   * @param Object options
   */
  initialize: function(element, options) {
    this.element = $(element);
    this.$super(options);
    
    this.init();
  },
  
  // callback for the moved elements
  moved: function(element) {
    var items    = this.getItems();
    var position = items.indexOf(element);
    
    if (position > -1 && position != element.current_position) {
      console.log(element.innerHTML, "moved to", position);
      
      items.each(function(item, index) {
        item.current_position = index;
      })
    }
  },
  
// protected
  
  init: function() {
    var items = this.getItems();
    
    if (items.length) {
      var callback  = this.moved.bind(this);
      
      var direction = this.options.axis != 'auto' ? this.options.axis :
        ['left', 'right'].include(items[0].getStyle('float')) ? 'x' : 'y';
        
      var drag_options = {
        range:  this.element,
        axis:   direction,
        revert: true,
        revertDuration: 0,
        onStop: function() {
          callback(this.element)
        }
      };
      
      var drop_options = {
        overlap: direction,
        overlapSize: ['x', 'horizontal'].includes(direction) ? 0.2 : 0.4,
        containtment: items,
        onHover: function(draggable) {
          // calculating the sapping direction
          var drag_dims = draggable.element.dimensions();
          var this_dims = this.element.dimensions();
          
          var before = draggable.axisY ? (
              drag_dims.top > this_dims.top
            ) : (
              drag_dims.left > this_dims.left
            );
          
          this.element.insert(draggable.clone, before ? 'before' : 'after');
        }
      }
      
      items.each(function(item, index) {
        item.makeDraggable(drag_options).makeDroppable(drop_options).current_position = index;
      });
    }
  },
  
  // returns the list of the items
  getItems: function() {
    return this.element.subNodes(this.options.tags);
  }
  
  
});