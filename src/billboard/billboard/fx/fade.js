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

    this.container.morph({opacity: 0}, {
      duration: this.options.duration,
      onFinish: this.finish.bind(this)
    });
  }

});