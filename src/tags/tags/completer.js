/**
 * The tags completer popup menu
 *
 * Copyright (C) 2011 Nikolay Nemshilov
 */
Tags.Completer = new Class(Element, {

  extend: {
    current: null // currently visible list reference
  },

  /**
   * Constructor
   *
   * @param {Tags} main object
   * @return void
   */
  initialize: function(main) {
    this.main  = main;
    this.list  = main.list;
    this.input = main.input;

    this.$super('ul', {'class': 'completer'});
    this.addClass('rui-dd-menu');
    this.insertTo(main.container);

    this.onClick(this._click);
  },

  /**
   * Starts the suggesting process
   *
   */
  suggest: function(value) {
    if (!(/^\s*$/).test(value) && this.main.options.autocomplete) {
      var tags = this._filter(this.main.options.tags, value);

      if (tags.length !== 0) {
        this._.innerHTML = tags.map(function(tag) {
          return '<li>'+ tag.replace(value, '<b>'+ value + '</b>') +'</li>';
        }).join('');

        this.picked = false;

        return this.show();
      }
    }

    return this.hide();
  },

  /**
   * Overloading the method so it appeared right below the input field
   *
   * @return {Tags.Completer} this
   */
  show: function() {
    var input  = this.input.dimensions(),
        style  = this._.style,
        pos;

    style.display = 'block';

    style.top  = '0px';
    style.left = '0px';

    pos = this.position();

    style.left = input.left - pos.x + 'px';
    style.top  = input.top  - pos.y + input.height + 'px';

    return (Tags.Completer.current = this);
  },

  /**
   * Hides the list of suggestions
   *
   * @return {Tags.Completer} this
   */
  hide: function() {
    this._.innerHTML       = '';
    this._.style.display   = 'none';

    Tags.Completer.current = null;

    return this;
  },


  /**
   * Highlights the next item on the list
   *
   * @return {Tags.Completer} this
   */
  next: function() {
    var item = this.first('.current');

    if (item)  { item = item.next(); }
    if (!item) { item = this.first(); }
    if (item)  { item.radioClass('current'); }

    return this;
  },

  /**
   * Highlights the previous item on the list
   *
   * @return {Tags.Completer} this
   */
  prev: function() {
    var item = this.first('.current');

    if (item)  { item = item.prev(); }
    if (!item) { item = this.children().last(); }
    if (item)  { item.radioClass('current'); }

    return this;
  },

  /**
   * Copies the picked item data into the input field
   * and hides the list
   *
   * @return {Tags.Completer} this
   */
  done: function() {
    var item = this.first('.current');

    if (item) {
      this.list.addTag(item.text());
      this.input.reset().focus();
    }

    return this.hide();
  },

// private

  // handles mouse clicks on the list
  _click: function(event) {
    var item = event.find('li');

    if (item) {
      this.input._cancelTimer();
      item.radioClass('current');
    }

    this.done();
  },

  // finds an appropriate list of tags for the suggestion
  _filter: function(tags, value) {
    var used   = this.list.getTags(),
        nocase = this.main.options.nocase;

    if (nocase) {
      used  = used.map('toLowerCase');
      value = value.toLowerCase();
    }

    return tags.filter(function(tag) {
      var low_tag = nocase ? tag.toLowerCase() : tag;

      return low_tag.indexOf(value) !== -1 && !used.include(low_tag);
    });
  }
});