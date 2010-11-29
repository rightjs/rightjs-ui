/**
 * An abstract tool with an options menu
 *
 * Copyright (C) 2010 Nikolay Nemshilov
 */
Rte.Tool.Options = new Class(Rte.Tool, {

  /**
   * Constructor
   *
   * @param Rte rte instance
   * @param Object key -> value hash
   */
  initialize: function(rte, options) {
    this.trigger = $E('div', {'class': 'trigger', 'html': '&middot;'});
    this.display = $E('div', {'class': 'display'});
    this.options = $E('ul',  {'class': 'options'});

    this
      .$super(rte)
      .addClass('with-options')
      .append(this.display, this.options)
      .insert(this.trigger, 'top');

    this.items = R([]);

    for (var value in options) {
      this.items.push($E('li', {html: options[value]}));
      this.items.last().insertTo(this.options).value = value;
    }

    this.options.onMousedown(R(this.pick).bind(this));

    // hidding the menu when the user interacts with the document outside of the document
    var hide = R(this.options.hide).bind(this.options, null);

    $(document).on({
      mousedown: hide,
      keydown: function(event) {
        if (event.keyCode === 27) {
          hide();
        }
      }
    });

    this.display.html(this.get('title'));

    return this;
  },

// protected

  // handling an option pick
  pick: function(event) {
    var target = event.stop().target, value = target.value;

    if (value !== undefined) {
      this.options.hide();

      this.value = value;
      this.exec();
    }
  },

  // toggling the menu on the icon-click
  mousedown: function() {
    if (!this.disabled) {
      $$('.rui-rte-toolbar div.with-options ul.options')
        .without(this.options).each('hide');

      if (this.options.hidden() && this.value !== null) {
        // marking the current value
        this.items.each(function(item) {
          item[item.value == this.value ? 'addClass' : 'removeClass']('active');
        }, this);
      }

      this.options.toggle('fade', {duration: 'short'});
    }
  }

});