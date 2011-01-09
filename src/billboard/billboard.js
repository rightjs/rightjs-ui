/**
 * Billboards basic class
 *
 * Copyright (C) 2010-2011 Nikolay Nemshilov
 */
var Billboard = new Widget('UL', {
  extend: {
    version: '2.2.0',

    EVENTS:  $w('change first last'),

    Options: {
      fxName:      'stripe',  // visual effect name
      fxDuration:  'long',    // visual effect duration

      autostart:   true,      // if it should automatically start rotate things
      delay:       4000,      // delay between item shows
      loop:        true,      // loop after reaching the last one

      showButtons: true,      // should it show the next/prev buttons or not
      prevButton:  'native',  // prev item button, 'native' or an ID of your own
      nextButton:  'native',  // next item button, 'native' or an ID of your own

      stripes:     10,        // the number of stripes

      cssRule:     '*.rui-billboard'
    }
  },

  /**
   * Basic constructor
   *
   * @param mixed an element reference
   * @return void
   */
  initialize: function(element) {
    this.$super('billboard', element);

    // initializing the buttons
    if (this.options.showButtons) {
      this.prevButton = this.options.prevButton !== 'native' ? $(this.options.prevButton) :
        $E('div', {'class': 'rui-billboard-button-prev', 'html': '&lsaquo;'}).insertTo(this);
      this.nextButton = this.options.nextButton !== 'native' ? $(this.options.nextButton) :
        $E('div', {'class': 'rui-billboard-button-next', 'html': '&rsaquo;'}).insertTo(this);

      this.prevButton.onClick(R(function(event) {
        event.stop(); this.showPrev();
      }).bind(this));
      this.nextButton.onClick(R(function(event) {
        event.stop(); this.showNext();
      }).bind(this));
    }

    // catching the 'first'/'last' events
    this.onChange(function(event) {
      if (event.item === this.items().first()) {
        this.fire('first');
      } else if (event.item === this.items().last()) {
        this.fire('last');
      }
    });

    // stopping/starting the slideshow with mouse over/out events
    this.on({
      mouseover: function() {
        this.stop();
      },

      mouseout: function(event) {
        if (this.options.autostart && !event.find('.rui-billboard')) {
          this.start();
        }
      }
    });

    // autostart
    if (this.options.autostart) {
      this.start();
    }
  },

  /**
   * Returns the list of items to swap
   *
   * @return Array swappable items
   */
  items: function() {
    return this.children().without(this.prevButton, this.nextButton);
  },

  /**
   * Show next item on the list
   *
   * @return Billboard this
   */
  showNext: function() {
    var items = this.items(), index = items.indexOf(this.current()) + 1;

    if (index == items.length && this.options.loop) {
      index = 0;
    }

    return this.current(index);
  },

  /**
   * Show prev item on the list
   *
   * @return Billboard this
   */
  showPrev: function() {
    var items = this.items(), index = items.indexOf(this.current()) - 1;

    if (index < 0 && this.options.loop) {
      index = items.length - 1;
    }

    return this.current(index);
  },

  /**
   * Gets/sets the current item
   *
   * @param mixed integer index or a LI element reference
   * @return Billboard this or current LI element
   */
  current: function(index) {
    var items = this.items();

    if (arguments.length) {
      if (index instanceof Element) {
        index = items.indexOf(index);
      }

      this.runFx(items[index]);
    } else {
      return items.length ? (
        items.first('hasClass', 'rui-billboard-current')  ||
        items.first().addClass('rui-billboard-current')
      ) : null;
    }

    return this;
  },

  /**
   * Starts the slide show
   *
   * @return Billboard this
   */
  start: function() {
    this.timer = R(this.showNext).bind(this).periodical(this.options.delay);
  },

  /**
   * stops the slideshow
   *
   * @return Billboard this
   */
  stop: function() {
    if (this.timer) {
      this.timer.stop();
    }
  },

  /**
   * Wrapping the event trigger so it always sent the
   * current element references
   *
   * @param String event name
   * @param Object options
   * @return Billboard this
   */
  fire: function(name, options) {
    return this.$super(name, Object.merge({
      index: this.items().indexOf(this.current()),
      item:  this.current()
    }, options));
  },

// protected

  /**
   * Runs the fx transition
   *
   * @param Element new LI element
   * @return void
   */
  runFx: function(item) {
    if (item && !this._running) {
      var Fx = Billboard.Fx[R(this.options.fxName || '').capitalize()];

      if (Fx) {
        new Fx(this).start(this.current(), item);
      } else {
        this.current().removeClass('rui-billboard-current');
        item.addClass('rui-billboard-current');
      }
    }
  }
});