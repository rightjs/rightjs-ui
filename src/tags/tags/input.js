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

    // a letter size (to create some threshold when typing)
    this.space = this.meter.html('W').size().x * 2;
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

// private

  _keydown: function(event) {
    if (event.keyCode === 8 && this._.value === '') { // Backspace
      this.list.removeLast();
      this.focus();
    } else if (event.keyCode === 13) { // Enter
      event.stop();
      this._add();
    }
  },

  _keyup: function() {
    if (this._.value.indexOf(this.list.main.options.separator) !== -1) {
      this._add();
    } else {
      this._resize();
    }
  },

  _blur: function() {
    this._add();
    this.remove();
    this.meter.remove();
    this.list.reposition();
  },

  // resizes the field to fit the text
  _resize: function() {
    this.meter._.innerHTML = this._.value;
    this._.style.width = this.meter.size().x + this.space + 'px';
    this.list.reposition();
  },

  // makes a tag out of the current value
  _add: function() {
    var value = this._.value.replace(this.list.main.options.separator, '');

    if (value != false) { // no blanks
      this.list.addTag(value);
      this.focus();
    }

    this._.value = '';
    this._resize();
  }

});