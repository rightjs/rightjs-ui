/**
 * Basic billboard visual effect
 *
 * Copyright (C) 2010 Nikolay Nemshilov
 */
Billboard.Fx = new Class(Fx, {

  /**
   * basic constructor
   *
   * @param Billboard billboard
   * @return void
   */
  initialize: function(billboard) {
    this.container = $E('div', {'class': 'rui-billboard-fx-container'});

    this.$super(billboard, {
      duration: billboard.options.fxDuration,
      onStart: function() {
        billboard._running = true;
        billboard.insert(this.container);
      },
      onFinish: function() {
        this.container.remove();
        billboard._running = false;
        billboard.fire('change');
      }
    });
  },

  /**
   * Starts an fx on the given item
   *
   * @param {Element} old LI element
   * @param {Element} new LI element
   * @return void
   */
  prepare: function(old_item, new_item) {
    old_item.removeClass('rui-billboard-current');
    new_item.addClass('rui-billboard-current');

    this.clone = old_item.clone();

    this.container.update(this.clone);
  }

});