/**
 * A _shared module_ to provide the `options` list functionality
 * for the tools
 *
 * Copyright (C) 2010 Nikolay Nemshilov
 */
Rte.Tool.Options = {

  /**
   * Builds the options list
   *
   * @param Object key -> value hash
   */
  build: function(options) {
    this.trigger = $E('div', {'class': 'trigger', 'html': '&middot;'});
    this.display = $E('div', {'class': 'display'});
    this.options = $E('ul',  {'class': 'options'});

    this
      .addClass('with-options')
      .append(this.display, this.options)
      .insert(this.trigger, 'top');

    this.items = {};

    for (var value in options) {
      this.items[value] = $E('li').insert(options[value]);
      this.items[value].insertTo(this.options).value = value;
    }

    // creating an the reset value
    this.items[''] = $E('li', {'class': 'remove', 'html': '--', 'title': Rte.i18n.Remove});
    this.items[''].insertTo(this.options, 'top').value = '';

    // catching the clicks
    this.options.onMousedown(R(this.pick).bind(this));

    // hidding the menu when the user interacts with the document outside of the document
    var hide = R(this.options.hide).bind(this.options, null);
    $(document).on({mousedown: hide,
      keydown: function(event) {
        if (event.keyCode === 27) { hide(); }
      }
    });

    this.value = '';
    this.updateDisplay(null);

    return this;
  },

// protected

  // handling an option pick
  pick: function(event) {
    var target = event.stop().target;

    if (target._.tagName !== 'LI') {
      target = target.parent('LI');
    }

    if (target.value !== undefined) {
      this.options.hide();
      this.value = target.value;
      this.updateDisplay(this.value || null);
      this.markActive();
      this.exec();
    }
  },

  // toggling the menu on the icon-click
  mousedown: function() {
    if (!this.disabled) {
      $$('.rui-rte-toolbar div.with-options ul.options')
        .without(this.options).each('hide');

      // marking the current value so it could be seen
      if (this.options.hidden() && this.value !== null) {
        this.markActive();
      }

      this.options.toggle('fade', {duration: 'short'});
    }
  },

  // marks the currently active item
  markActive: function() {
    for (var item in this.items) {
      this.items[item][
        item === this.value ? 'addClass' : 'removeClass'
      ]('active');
    }
  },

  // updates the display
  updateDisplay: function(value) {
    this.display.update(
      value !== null && value in this.items ?
        this.items[value].text() : this._.title
    );
  }

};