/**
 * Fade visual effects class
 *
 * Copyright (C) 2010 Nikolay Nemshilov
 */
Billboard.Fx.Fade = new Class(Billboard.Fx, {

  /**
   * Starts an fx on the given item
   *
   * @param {Element} old LI element
   * @param {Element} new LI element
   * @return void
   */
  prepare: function(old_item, new_item) {
    this.$super(old_item, new_item);
  },

  /**
   * Rendering the effect
   *
   * @param Float delta value
   * @return void
   */
  render: function(delta) {
    this.container.setStyle({opacity: 1 - delta});
  }

});