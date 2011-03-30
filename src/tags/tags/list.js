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

    // repositioning the list to put over the existing input field
    this.setStyle({
      fontSize:    main.getStyle('fontSize'),
      fontFamily:  main.getStyle('fontFamily'),
      paddingTop:  main.getStyle('borderTopWidth') .replace(/[\d\.]+/, function(m) { return m.toFloat() * 2; }),
      paddingLeft: main.getStyle('borderLeftWidth').replace(/[\d\.]+/, function(m) { return m.toFloat() * 2; })
    });

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

    return this.append(this.main.input, this.main.input.meter);
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
      .append(this.main.input, this.main.input.meter)
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

    return this.main.input.focus();
  },

  /**
   * Adjusts the original input field size and
   * places the list right above it,
   * in case if the list will start folding
   *
   * @return {Tags.List} this
   */
  reposition: function() {
    var size = this.size().y, main = this.main.size().y, reposition = false;

    if (this.yDiff === undefined) {
      this.setWidth(this.main.size().x);
      this.yDiff = main - size;
      reposition = true;
    }

    if (size + this.yDiff !== main) {
      this.main.setHeight(size + this.yDiff);
      reposition = true;
    }

    if (reposition) {
      this.setStyle({top: '0px', left: '0px'});;

      size = this.position();
      main = this.main.position();

      this.setStyle({
        top:  main.y - size.y + 'px',
        left: main.x - size.x + 'px'
      });
    }

    return this;
  },

// private

  // checks if the tag is allowed to be added to the list
  _allowed: function(tag) {
    return !this.getTags().include(tag);
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