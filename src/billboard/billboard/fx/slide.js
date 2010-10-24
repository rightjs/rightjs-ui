/**
 * The slide visual effects class
 *
 * Copyright (C) 2010 Nikolay Nemshilov
 */
Billboard.Fx.Slide = new Class(Billboard.Fx, {

  /**
   * overloading the 'prepare' method to add some stuff
   * to the container depending on which direction do we slide
   *
   * @param {Element} old LI element
   * @param {Element} new LI element
   * @return void
   */
  prepare: function(old_item, new_item) {
    this._width = this.element.current().size().x;
    this._direction = old_item.nextSiblings().include(new_item) ? -1 : 1;

    this.$super(old_item, new_item);

    this.clone.setStyle({width: this._width + 'px'});
  },

  /**
   * Rendering the Fx
   *
   * @param Float delta
   * @return void
   */
  render: function(delta) {
    this.clone._.style.left = this._direction * this._width * delta + 'px';
  }

});