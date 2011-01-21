/**
 * The native tooltips feature for RithJS
 *
 * Copyright (C) 2009-2011 Nikolay Nemshilov
 */
var Tooltip = new Widget({
  extend: {
    version: '2.2.1',

    EVENTS: $w('show hide'),

    Options: {
      cssRule:    '[data-tooltip]', // a css-marker of an element with a tooltip

      fxName:     'fade',           // the appearance effect name
      fxDuration: 400,              // the appearance effect duration
      delay:      400,              // the appearance delay

      move:       true,             // if it should be moved with the mouse

      idSuffix:   '-tooltip'        // ID prefix for tooltips with ID
    },

    current:   null,  // the currently active tooltip reference
    instances: R([]), // keeps the list of instances

    // tries to find a tip closest to the event
    find: function(event) {
      var element = event.target;

      if (element.match(Tooltip.Options.cssRule)) {
        var uid = $uid(element);
        return (Tooltip.instances[uid] || (Tooltip.instances[uid] = new Tooltip(element)));
      }
    }
  },

  /**
   * Constructor
   *
   * @param Element associated element
   * @param Object options
   */
  initialize: function(element, options) {
    this.associate = element = $(element);

    this
      .$super('tooltip')
      .setOptions(options, element)
      .insert('<div class="rui-tooltip-arrow"></div>'+
        '<div class="rui-tooltip-container">'+
          (element.get('title') || element.get('alt'))+
        '</div>'
      )
      .on({
        mouseout:  this._mouseOut,
        mouseover: this._cancelTimer
      })
      .insertTo(document.body);

    // adding the ID if needed
    if (element.has('id')) {
      this.set('id', element.get('id') + this.options.idSuffix);
    }

    // removing the titles from the elment
    element.set({ title: '', alt: ''});
  },

  /**
   * Hides the tooltip
   *
   * @return Tooltip this
   */
  hide: function() {
    this._cancelTimer();

    this._timer = R(function() {
      Element.prototype.hide.call(this, this.options.fxName, {
        engine:   'javascript', // Webkit too slow in here
        duration: this.options.fxDuration
      });
      Tooltip.current = null;
      this.fire('hide');
    }).bind(this).delay(100);

    return this;
  },

  /**
   * Shows the tooltip with a dealy
   *
   * @param Boolean if true will show tooltip immediately
   * @return Tooltip this
   */
  show: function(immediately) {
    // hidding all the others
    Tooltip.instances.each(function(tip) {
      if (tip && tip !== this) { tip.hide(); }
    }, this);

    // show the tooltip with a delay
    this._timer = R(function() {
      Element.prototype.show.call(this.stop(),
        this.options.fxName, {
          engine: 'javascript', // webkit it too slow on that
          duration: this.options.fxDuration
        }
      );

      Tooltip.current = this.fire('show');
    }).bind(this).delay(this.options.delay);

    return (Tooltip.current = this);
  },

  /**
   * Moves it to where the event happened
   *
   * @return Tooltip this
   */
  moveToEvent: function(event) {
    if (this.options.move) {
      this._.style.left = event.pageX + 'px';
      this._.style.top  = event.pageY + 'px';
    }

    return this;
  },

// protected

  // cancels a show timeout
  _cancelTimer: function() {
    if (this._timer) {
      this._timer.cancel();
      this._timer = null;
    }
    return false;
  },

  _mouseOut: function(event) {
    event.stop();
    if (event.relatedTarget !== this.associate) {
      this.hide();
    }
  }
});
