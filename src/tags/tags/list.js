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

    function double_styles(name) {
      return main.getStyle(name).replace(
        /[\d\.]+/, function(m) { return parseFloat(m) * 2; }
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

    // frakking Opera '0em' sizes bug fallback
    if (main.getStyle('fontSize') === '0em') {
      this.setStyle({fontSize: '1em'});
    }

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
    tags.uniq().each(this.clean().addTag, this);

    return this;
  },

  /**
   * Returns a list of tags on the list
   *
   * @return {Array} of tokens
   */
  getTags: function() {
    return this.find('div.text').map('text');
  },

  /**
   * adds the tag to the list
   *
   * @param {String} tag
   * @return {Tags.List} this
   */
  addTag: function(tag) {
    if (this._allowed(tag)) {
      this
        .append(
          '<li>'+
            '<div class="text">'+ R(tag).trim() +'</div>'+
            '<div class="close">&times;</div>' +
          '</li>'
        ).reposition();

      this.main.fire('add', {tag: tag});
    }

    this.main._.value = this.getTags().join(
      this.main.options.separator + ' '
    );

    return this;
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

  // catches the clicks on the list
  _click: function(event) {
    if (event.target.hasClass('close')) {
      this._remove(event.target.parent());
    } else {
      this.main.input.focus();
    }
  },

  // checks if the tag is allowed to be added to the list
  _allowed: function(tag) {
    var tags    = this.getTags(),
        options = this.main.options,
        casesensitive = !options.nocase;

    return !(casesensitive ? tags.include(tag) :
      tags.map('toLowerCase').include(tag.toLowerCase())
    ) && (
      options.allowNew || (
        casesensitive ? tags.include(tag) :
          options.tags.map('toLowerCase').include(tag.toLowerCase())
      )
    );
  },

  // removes an item out of the list
  _remove: function(item) {
    var tag = item.first('div.text').text();

    this.main.setValue(
      this.getTags().without(tag)
    );

    this.main.fire('remove', {tag: tag});
  }

});