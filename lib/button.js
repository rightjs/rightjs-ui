/**
 * A shared button unit.
 * NOTE: we use the DIV units instead of INPUTS
 *       so those buttons didn't interfere with
 *       the user's tab-index on his page
 *
 * Copyright (C) 2010-2011 Nikolay Nemshilov
 */
var Button = new RightJS.Class(RightJS.Element, {
  /**
   * Constructor
   *
   * @param String caption
   * @param Object options
   * @return void
   */
  initialize: function(caption, options) {
    this.$super('div', options);
    this._.innerHTML = caption;
    this.addClass('rui-button');
    this.on('selectstart', 'stopEvent');
  },

  /**
   * Disasbles the button
   *
   * @return Button this
   */
  disable: function() {
    return this.addClass('rui-button-disabled');
  },

  /**
   * Enables the button
   *
   * @return Button this
   */
  enable: function() {
    return this.removeClass('rui-button-disabled');
  },

  /**
   * Checks if the button is disabled
   *
   * @return Button this
   */
  disabled: function() {
    return this.hasClass('rui-button-disabled');
  },

  /**
   * Checks if the button is enabled
   *
   * @return Button this
   */
  enabled: function() {
    return !this.disabled();
  },

  /**
   * Overloading the method, so it fired the events
   * only when the button is active
   *
   * @return Button this
   */
  fire: function() {
    if (this.enabled()) {
      this.$super.apply(this, arguments);
    }
    return this;
  }
});
