/**
 * The 'fake' input field element
 *
 * Copyright (C) 2011 Nikolay Nemshilov
 */
Tags.Input = new Class(Input, {

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

    // a letter size (to create some threshold when typing)
    this.space = this.meter.html('W').size().x;
  },

// private

  _keydown: function(event) {
    if (event.keyCode === 8 && this._.value === '') { // Backspace
      this.list.removeLast();
    } else if (event.keyCode === 13) { // Enter
      event.stop();
      this._cutOff();
    }
  },

  _keyup: function() {
    if (this.value().endsWith(this.list.main.options.separator)) {
      this._cutOff();
    } else {
      this._resize();
    }
  },

  _blur: function() {
    this._cutOff();
  },

  // resizes the field to fit the text
  _resize: function() {
    this.meter._.innerHTML = this._.value;
    this._.style.width = this.meter.size().x + this.space * 2 + 'px';
    this.list.reposition();
  },

  // cuts off the text and makes a tag out of it
  _cutOff: function() {
    var value = this._.value.replace(this.list.main.options.separator, '');

    if (value != false) { // no blanks
      this.list.addTag(value);
      this._.value = '';
      this.focus();
    }

    this._resize();
  }

});