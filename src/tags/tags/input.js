/**
 * The 'fake' input field element
 *
 * Copyright (C) 2011 Nikolay Nemshilov
 */
Tags.Input = new Class(Input, {

  /**
   * Constructor
   *
   * @param {Tabs} the main object
   * @return void
   */
  initialize: function(main) {
    this.main = main;
    this.list = main.list;

    this.$super({type: 'text', size: 1});
    this.onKeydown(this._keydown);
    this.onKeyup(this._keyup);
    this.onBlur(this._blur);
    this.insertTo(main.list);

    // used to dynamically measure the size of the field
    this.meter = new Element('div', {
      'class': 'meter',
      'style': {
        whiteSpace: 'nowrap',
        position:   'absolute',
        left:       '-99999em'
      }
    }).insertTo(this, 'after');
  },

  /**
   * Inserting itself into the tags list on the 'focus' call
   *
   * @return {Tags.Input} this
   */
  focus: function() {
    this.main.list.append(this, this.meter).reposition();
    return this.$super();
  },

  /**
   * Resets the input field state
   *
   * @return {Tags.Input} this
   */
  reset: function() {
    this.remove();
    this.meter.remove();
    this.list.reposition();
    this._.value = '';

    return this;
  },

// private

  _keydown: function(event) {
    if (event.keyCode === 8 && this._.value === '') {
      this.list.removeLast(); // deleting the last tag with backspace
      this.focus();
    } else if (event.keyCode === 13) {
      event.preventDefault(); // preventing the for to go off on Enter
    }
  },

  _keyup: function(event) {
    if (!R([9, 27, 37, 38, 39, 40, 13]).include(event.keyCode)) {
      if (this._.value.indexOf(this.main.options.separator) !== -1) {
        this._add();
        this.focus();
      } else {
        this._resize();
        this.main.completer.suggest(this._.value);
      }
    }
  },

  _blur: function(event) {
    if (this.main.completer.hidden() && this._.value !== '') {
      this._add();
      this.reset();
    }
  },

  // resizes the field to fit the text
  _resize: function() {
    this.meter.html(this._.value + 'xx');
    this._.style.width = this.meter.size().x + 'px';
    this.list.reposition();
  },

  // makes a tag out of the current value
  _add: function() {
    var value = this._.value.replace(this.main.options.separator, '');
    this._.value = '';

    if (!(/^\s*$/).test(value)) {
      this.list.addTag(value);
    }

    if (this.main.completer.visible()) {
      this.main.completer.hide();
    }
  }

});