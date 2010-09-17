/**
 * The Rating widget
 *
 * Copyright (C) 2009-2010 Nikolay Nemshilov
 */
var Rater = new Widget({
  include: Updater,

  extend: {
    version: '2.0.0',

    EVENTS: $w('change hover send'),

    Options: {
      html:          '&#9733;', // the dot html code

      size:          5,      // number of stars in the line
      value:         null,   // default value
      update:        null,   // an element to update

      disabled:      false,  // if it should be disabled
      disableOnVote: false,  // if it should be disabled when user clicks a value

      url:           null,   // an url to send results with AJAX
      param:         'rate', // the value param name
      Xhr:           null    // additional Xhr options
    }
  },

  /**
   * basic constructor
   *
   * @param mixed element reference or an options hash
   * @param Object options hash
   */
  initialize: function(options) {
    this
      .$super('rater', options)
      .on({
        click:      this._clicked,
        mouseover:  this._hovered,
        mouseout:   this._left
      });

    if (this.empty()) {
      for (var i=0; i < this.options.size; i++) {
        this.insert('<div>'+ this.options.html + '</div>');
      }
    }

    options = this.options;

    if (options.value === null) {
      options.value = this.find('.active').length;
    }

    this.setValue(options.value);

    if (options.disabled) {
      this.disable();
    }

    if (options.update) {
      this.assignTo(options.update);
    }
  },

  /**
   * Sets the element value
   *
   * @param Number or String value
   * @return Rater this
   */
  setValue: function(value) {
    if (!this.disabled()) {
      // converting the type and rounding the value
      value = isString(value) ? R(value).toInt() : value;
      value = isNumber(value) ? R(value).round() : 0;

      // checking constraints
      value = R(value).max(this.options.size);
      value = R(value).min(0);

      // highlighting the value
      this.highlight(value);

      if (this.value != value) {
        this.fire('change', {value: this.value = value});
      }
    }

    return this;
  },

  /**
   * Returns the current value of the rater
   *
   * @return Number value
   */
  getValue: function() {
    return this.value;
  },

  /**
   * Sends an Xhr request with the current value to the options.url address
   *
   * @return Rater this
   */
  send: function() {
    if (this.options.url) {
      this.request = new Xhr(this.options.url, this.options.Xhr)
        .send(this.options.param+"="+this.value);
      this.fire('send', {value: this.value});
    }
    return this;
  },

  /**
   * Disables the instance
   *
   * @return Rater this
   */
  disable: function() {
    return this.addClass('rui-rater-disabled');
  },

  /**
   * Enables this instance
   *
   * @return Rater this
   */
  enable: function() {
    return this.removeClass('rui-rater-disabled');
  },

  /**
   * Checks if the instance is disabled
   *
   * @return boolean
   */
  disabled: function() {
    return this.hasClass('rui-rater-disabled');
  },

// protected

  // callback for 'hover' event
  _hovered: function(event) {
    var index = this.children().indexOf(event.target);
    if (!this.disabled() && index > -1) {
      this.highlight(index + 1);
      this.fire('hover', {value: index + 1});
    }
  },

  // callback for user-click
  _clicked: function(event) {
    var index = this.children().indexOf(event.target);
    if (!this.disabled() && index > -1) {
      this.setValue(index + 1);
      if (this.options.disableOnVote) {
        this.disable();
      }
      this.send();
    }
  },

  // callback when user moves the mouse out
  _left: function() {
    this.setValue(this.value);
  },

  // visually highlights the value
  highlight: function(value) {
    this.children().each(function(element, i) {
      element[value - 1 < i ? 'removeClass' : 'addClass']('active');
    });
  }
});
