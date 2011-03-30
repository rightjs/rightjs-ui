/**
 * The tags list element custom wrapper
 *
 * Copyright (C) 2011 Nikolay Nemshilov
 */
Tags.List = new Class(Element, {

  /**
   * Constructor, creates the list and places where it supposed to be
   *
   * @param {Tags} tags instance
   * @return void
   */
  initialize: function(main) {
    this.main  = main;

    this.$super('ul', {'class': 'list'});
    this.insertTo(main.container);

    if (this.main.options.vertical) {
      this.addClass('vertical');
    }

    // repositioning the list to put over the existing input field
    function double_styles(name) {
      return main.getStyle(name).replace(
        /[\d\.]+/, function(m) { return m.toFloat() * 2; }
      );
    }

    this.setStyle({
      fontSize:      main.getStyle('fontSize'),
      fontFamily:    main.getStyle('fontFamily'),
      fontWeight:    main.getStyle('fontWeight'),
      letterSpacing: main.getStyle('letterSpacing'),
      paddingTop:    double_styles('borderTopWidth'),
      paddingLeft:   double_styles('borderLeftWidth'),
      paddingRight:  double_styles('borderRightWidth'),
      paddingBottom: main.getStyle('borderBottomWidth')
    });

    this.setWidth(main.size().x);
    this.reposition(true);

    this.onClick(this._click);
  },

  /**
   * Sets a list of tags
   *
   * @param {Array} tags
   * @return {Tags.List} this
   */
  setTags: function(tags) {
    this.clean();

    tags.uniq().each(function(tag) {
      this.addTag(tag);
    }, this);

    return this;
  },

  /**
   * Returns a list of tags on the list
   *
   * @return {Array} of tokens
   */
  getTags: function() {
    return this.find('li').map(this._tag);
  },

  /**
   * adds the tag to the list
   *
   * @param {String} tag
   * @return {Tags.List} this
   */
  addTag: function(tag) {
    return !this._allowed(tag) ? this : (this
      .append('<li>'+ R(tag).trim() + '<b>&times;</b></li>')
      .reposition()
    );
  },

  /**
   * Removes the last item from the list
   *
   * @return {Tags.List} this
   */
  removeLast: function() {
    var item = this.find('li').last();

    if (item) {
      this._remove(item);
    }

    return this;
  },

  /**
   * Adjusts the original input field size and
   * places the list right above it,
   * in case if the list will start folding
   *
   * @return {Tags.List} this
   */
  reposition: function(force) {
    var size = this.size().y, main = this.main.size().y, style;

    if (size !== main || force === true) {
      this.main.setHeight(size);

      style = this._.style;

      style.top  = '0px';
      style.left = '0px';

      size = this.position();
      main = this.main.position();

      style.top  = main.y - size.y + 'px';
      style.left = main.x - size.x + 'px';
    }

    return this;
  },

// private

  // checks if the tag is allowed to be added to the list
  _allowed: function(tag) {
    return !this.getTags().include(tag) && (
      this.main.options.allowNew || this.main.options.tags.include(tag)
    );
  },

  // returns a tag text from an item element
  _tag: function(item) {
    return item.html().replace(/<b>.+?<\/b>/, '');
  },

  // removes an item out of the list
  _remove: function(item) {
    this.main.setValue(
      this.getTags().without(this._tag(item))
        .join(this.main.options.separator + ' ')
    );
  },

  // catches the clicks on the list
  _click: function(event) {
    if (event.target._.tagName === 'B') {
      this._remove(event.target.parent());
    }

    this.main.input.focus();
  }

});