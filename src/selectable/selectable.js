/**
 * Selectable unit main script
 *
 * Copyright (C) 2009 Nikolay V. Nemshilov aka St.
 */
var Selectable = new Class(Observer, {
  extend: {
    EVENTS: $w('change select unselect disable enable hover leave show hide'),
    
    Options: {
      options:    null,    // a hash of key-value pairs
      selected:   null,    // an array of selected keys
      disabled:   null,    // an array of disabled keys
      
      multiple:   true,    // a flag if it shoulde a multiselect or a single select widget
      
      fxName:     'slide', // the drop-down options list fx-name null, 'slide', 'fade'
      fxDuration: 'short', // the drop-down options list fx-duration
      
      update:     null,    // a field to be assigned to
      parseIds:   false,   // if it should parse integer ids out of the keys
      
      refresh:    true     // a flag if it should automatically refresh the items list
    },
    
    rescan: function() {
      $$('*.right-selectable').each(function(element) {
        if (!element._selectable) {
          new Selectable(element);
        }
      });
    }
  },
  
  // css-classes
  baseClass:      'right-selectable',
  singleClass:    'right-selectable-single',
  selectedClass:  'right-selectable-selected',
  disabledClass:  'right-selectable-disabled',
  containerClass: 'right-selectable-container',
  
  /**
   * Basic constructor
   *
   * @param mixed reference to an element or the options hash
   * @param Object options hash
   */
  initialize: function() {
    var args = $A(arguments);
    
    if (args[0] && !isHash(args[0])) this.element = $(args[0]);
    this.$super(isHash(args.last()) ? args.last() : this.element ?
      eval('('+this.element.get('data-selectable-options')+')') : null);
    if (!this.element) this.element = this.build();
    
    this.element._selectable = this.init();
  },
  
  // standard descructor
  destroy: function() {
    this.items.each(function(item) {
      item.stopObserving('click',   this.onClick)
        .stopObserving('mouseout',  this.onMouseout)
        .stopObserving('mouseover', this.onMouseover)
        .stopObserving('mousedown', this.onMousedown)
        .stopObserving('mouseup',   this.onMouseup);
    }, this);
    
    delete(this.element._selectable);
  },
  
  /**
   * Sets the value
   *
   * @param Array of selectee keys
   * @return Selectable this
   */
  setValue: function(value) {
    // parsing the value
    if (isString(value)) value = value.split(',').map('trim').filter(function(s) { return !s.blank(); });
    
    // resetting the selections
    this.items.each('removeClass', this.selectedClass);
    
    // selecting the value
    var items = this.mapEnabled(value).each('addClass', this.selectedClass);
    if (this.isSingle) this.showItem(items[0]);
    
    return this.calcValue();
  },
  
  /**
   * Returns the list of selected items
   *
   * @return Array of selectees
   */
  getValue: function() {
    return this.value;
  },
  
  /**
   * Inserts the widget into the element at the given position
   *
   * @param mixed element reference
   * @param String optional position
   * @return Selectable this
   */
  insertTo: function(element, position) {
    this.element.insertTo(element, position);
    if (this.isSingle) this.container.insertTo(this.element, 'before');
    return this;
  },
  
  /**
   * Assigns the widget to work in pair with the input element
   *
   * @param mixed an element reference
   * @return Selectable this
   */
  assignTo: function(input) {
    var input = $(input);
    
    if (input && input.setValue) {
      var set_value = function(value) {
        input.setValue(value === null ? '' : value);
      };
      set_value(this.value);
      this.onChange(set_value);
      input.onChange(function() {
        this.setValue(input.value);
      }.bind(this));
    }
    
    return this;
  },
  
  /**
   * disables the given key or keys
   * NOTE: if no keys specified, then all the items will be disabled
   *
   * @param mixed optional key or keys to disable
   * @return Selectable this
   */
  disable: function(keys) {
    this.mapOrAll(keys).each(function(item) {
      this.fire('disable', item.addClass(this.disabledClass));
    }, this);
    return this;
  },
  
  /**
   * disables the given key or keys
   * NOTE: if no keys specified, then all the items will be enabled
   *
   * @param mixed optional key or keys to enable
   * @return Selectable this
   */
  enable: function(keys) {
    this.mapOrAll(keys).each(function(item) {
      this.fire('enable', item.removeClass(this.disabledClass));
    }, this);
    return this;
  },
  
  /**
   * Checks if the given key or keys are disabled
   * NOTE: if no keys specified, then will check if all the items are disabled
   *
   * @param mixed optional key or keys to enable
   * @return Selectable this
   */
  disabled: function(keys) {
    return this.mapOrAll(keys).every('hasClass', this.disabledClass);
  },
  
  /**
   * selects item(s) that refers to the given key or keys
   *
   * @param mixed key or keys
   * @return Selectable this
   */
  select: function(keys) {
    var items = this.mapEnabled(keys);
    
    if (this.isSingle && items) {
      this.items.each('removeClass', this.selectedClass);
      items = [items[0]];
    }
    
    items.each(function(item) {
      this.fire('select', item.addClass(this.selectedClass));
    }, this);
    
    return this;
  },
  
  /**
   * Unselects item(s) that refers to the given key or keys
   *
   * @param mixed key or keys
   * @return Selectable this
   */
  unselect: function(keys) {
    this.mapEnabled(keys).each(function(item) {
      this.fire('unselect', item.removeClass(this.selectedClass));
    }, this);
    return this;
  },
  
  /**
   * Checks if item(s) are selected
   *
   * @param mixed key or keys
   * @return Boolean check result
   */
  selected: function(keys) {
    return this.mapEnabled(keys).every('hasClass', this.selectedClass);
  },
  
  /**
   * Checks for new selectees in the element and updates the internal index
   *
   * @return Selectable this
   */
  refresh: function() {
    this.items = this.element.select('li').each(function(item) {
      if (!this.items || !this.items.include(item)) {
        item.on({
          click:     this.onClick,
          mouseup:   this.onMouseup,
          mousedown: this.onMousedown,
          mouseover: this.onMouseover,
          mouseout:  this.onMouseout
        });
      }
    }, this);
    
    return this;
  },
  
// protected

  // initis the widget
  init: function() {
    this.element.addClass(this.baseClass);
    
    if (this.isSingle = !this.options.multiple || this.element.hasClass(this.singleClass)) {
      this.buildSingle().element.addClass(this.singleClass);
    }
    
    // creating static callbacks so they could be detached
    this.onMousedown = this.mousedown.bind(this);
    this.onMouseup   = this.mouseup.bind(this);
    this.onMouseover = this.mouseover.bind(this);
    this.onMouseout  = this.mouseout.bind(this);
    this.onClick     = this.click.bind(this);
    
    this.value = null;
    this.refresh().onSelect('calcValue').onUnselect('calcValue');
    
    if (this.isSingle)         this.onSelect('showItem');
    if (this.options.disabled) this.disable(this.options.disabled);
    if (this.options.selected) this.select(this.options.selected);
    if (this.options.update)   this.assignTo(this.options.update);
    if (this.isSingle) {
      if (this.options.selected === null) this.select(this.items[0]);
      this.onSelect('hideList'); // don't move it upper, it will force the hide effect
    }
    
    return this;
  },
  
  // calculates the value out of the selected items
  calcValue: function() {
    if (this.isSingle) {
      var item  = this.items.first('hasClass', this.selectedClass);
      var value = item ? this.itemValue(item) : null;
    } else {
      var value = this.items.filter('hasClass', this.selectedClass).map(function(item) {
        return this.itemValue(item);
      }, this);
    }
    
    if (value != this.value) {
      this.value = value;
      this.fire('change', value);
    }
    
    return this;
  },
  
  // finds out the value for the item
  itemValue: function(item) {
    return item.id ? this.options.parseIds ? item.id.match(/\d+/) : item.id : this.items.indexOf(item);
  },
  
  // wrapping the events trigger to feed it with some more options
  fire: function(name, item) {
    if (item && item.tagName) {
      this.$super(name, item, this.items.indexOf(item), this);
    } else {
      this.$super.apply(this, arguments);
    }
    return this;
  },
  
  // collects the item elements by the various key defs
  map: function(keys) {
    if (!isArray(keys)) keys = [keys];
    
    return keys.map(function(key) {
      var index = (isString(key) && /^\d+$/.test(key)) ? key.toInt() : key, item = key;
      
      if (isNumber(index)) {
        item = this.items[index];
      } else if(isString(key)) {
        item = this.items.first(function(i) { return i.id == key; });
      }
      
      return item;
    }, this).compact();
  },
  
  // returns matching items or all of them if there's no key
  mapOrAll: function(keys) {
    return keys ? this.map(keys) : this.items;
  },
  
  // maps and filters only enabled items
  mapEnabled: function(keys) {
    return this.map(keys).filter(function(item) {
      return !item.hasClass(this.disabledClass);
    }, this);
  },
  
  // onmousedown callback
  mousedown: function(event) {
    event.stop();
    var item = event.target;
    
    if (!this.disabled(item)) {
      if (this.isSingle) {  // single-selects are always select
        this.select(item);
      } else if (this.selected(item)) {
        this.unselect(item);
        this._massRemove = true; // mass-removing start
      } else {
        this.select(item);
        this._massSelect = true; // mass-selection start
      }
    }
  },
  
  // onmouseup callback
  mouseup: function(event) {
    event.stop();
    this._massRemove = this._massSelect = false; // mass-selection stop
  },
  
  // mouseover callback
  mouseover: function(event) {
    var item = event.target;
    this.fire('hover', item);
    
    if (!this.isSingle) {
      if (this._massSelect) {
        this.select(item);
      } else if (this._massRemove) {
        this.unselect(item);
      }
    }
  },
  
  // mouseout callback
  mouseout: function(event) {
    this.fire('leave', event.target);
  },
  
  // mouseclick callback
  click: function(event) {
    event.stop();
  },
  
  // builds the widget programmatically
  build: function() {
    var element = $E('ul'), options = this.options.options;
    
    if (isArray(options)) {
      options.each(function(option) {
        element.insert($E('li', {html: option}));
      });
    } else {
      for (var key in options) {
        element.insert($E('li', {id: key, html: options[key]}));
      }
    }
    
    return element;
  },
  
  // builds a container for a single-select
  buildSingle: function() {
    this.container = $E('div', {'class': this.containerClass})
      .insert([$E('div', {'html': '&bull;', 'class': 'right-selectable-handle'}), $E('ul')])
      .insertTo(this.element, 'before')
      .onClick(this.showList.bind(this));
      
    document.onClick(this.hideList.bind(this));
    
    return this;
  },
  
  // shows list for the single-selects
  showList: function(event) {
    event.stop();
    if (this.isSingle) {
      var dims = this.container.dimensions();

      this.element.setStyle({
        top: (dims.top + dims.height) + 'px',
        left: dims.left + 'px',
        width: dims.width + 'px'
      }).show(this.options.fxName, {
        duration: this.options.fxDuration,
        onFinish: this.fire.bind(this, 'show')
      });
      
      if (!this.options.fxName) this.fire('show');
    }
  },
  
  // hides the list for the single-selects
  hideList: function() {
    if (this.isSingle && this.element.visible()) {
      this.element.hide(this.options.fxName, {
        duration: this.options.fxDuration,
        onFinish: this.fire.bind(this, 'hide')
      });
      
      if (!this.options.fxName) this.fire('hide');
    }
  },
  
  // shows the item in the main view of a single-selector
  showItem: function(item) {
    this.container.first('ul').update(item ? item.cloneNode(true) : '<li>&nbsp;</li>');
  }
});