/**
 * The Sortable unit
 *
 * Copyright (C) Nikolay V. Nemshilov aka St.
 */
var Sortable = new Class(Observer, {
  extend: {
    EVENTS: $w('update'),
    
    Options: {
      direction: 'auto',   // 'auto', 'vertical', 'horizontal', 'x', 'y'
      
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
    
    this.onUpdate(function(element, position) {
      console.log(element.innerHTML, "moved to", position);
    });
    
    this.init();
  },
  
  // detaches all the events out of the elemnts
  destroy: function() {
    this.getItems.each(function(item) {
      item.undoDraggable().undoDroppable();
    });
    
    return this;
  },
  
  // callback for the moved elements
  moved: function(element) {
    var items    = this.getItems();
    var position = items.indexOf(element);
    
    if (position > -1 && position != element.current_position) {
      this.fire('update', element, position);
      
      items.each(function(item, index) {
        item.current_position = index;
      });
    }
  },
  
// protected
  
  // inits the sortable unit
  init: function() {
    var items = this.getItems();
    
    if (items.length) {
      var callback  = this.moved.bind(this);
      
      // guessing the direction
      var direction = this.options.direction != 'auto' ? this.options.direction :
        ['left', 'right'].include(items[0].getStyle('float')) ? 'x' : 'y';
      
      // the draggable options
      var drag_options = {
        range:  this.element,
        axis:   direction,
        revert: true,
        revertDuration: 0,
        onStop: function() {
          callback(this.element);
        }
      };
      
      // the droppable options
      var drop_options = {
        overlap:      direction,
        containtment: items,
        onHover: function(draggable) {
          // calculating the swapping direction
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
      
      // processing the items
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