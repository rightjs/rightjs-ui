/**
 * A shared module that toggles a widget visibility status
 * in a uniformed way according to the options settings
 *
 * Copyright (C) 2010-2012 Nikolay Nemshilov
 */
var Toggler = {
  /**
   * Shows the element
   *
   * @param String fx-name
   * @param Object fx-options
   * @return Element this
   */
  show: function(fx_name, fx_options) {
    this.constructor.current = this;
    return Toggler_toggle(this, 'show', fx_name, fx_options);
  },

  /**
   * Hides the element
   *
   * @param String fx-name
   * @param Object fx-options
   * @return Element this
   */
  hide: function(fx_name, fx_options) {
    this.constructor.current = null;
    return Toggler_toggle(this, 'hide', fx_name, fx_options);
  },

  /**
   * Toggles the widget at the given element
   *
   * @param Element the related element
   * @param String position right/bottom (bottom is the default)
   * @param Boolean marker if the element should be resized to the element size
   * @return Widget this
   */
  showAt: function(element, where, resize) {
    this.hide(null).shownAt = element = RightJS.$(element);

    // moves this element at the given one
    Toggler_re_position.call(this, element, where, resize);

    return this.show();
  },

  /**
   * Toggles the widget at the given element
   *
   * @param Element the related element
   * @param String position top/left/right/bottom (bottom is the default)
   * @param Boolean marker if the element should be resized to the element size
   * @return Widget this
   */
  toggleAt: function(element, where, resize) {
    return this.hidden() ? this.showAt(element, where, resize) : this.hide();
  }
};


/**
 * toggles the element's state according to the current settings
 *
 * @param event String 'show' or 'hide' the event name
 * @param String an optional fx-name
 * @param Object an optional fx-options hash
 * @return void
 */
function Toggler_toggle(element, event, fx_name, fx_options) {
  if ((event === 'hide' && element.visible()) || (event === 'show' && element.hidden())) {
    if (RightJS.Fx) {
      element.___fx = true;

      if (fx_name === undefined) {
        fx_name = element.options.fxName;

        if (fx_options === undefined) {
          fx_options = {
            duration: element.options.fxDuration,
            onFinish: function() {
              element.___fx = false;
              element.fire(event);
            }
          };

          // hide on double time
          if (event === 'hide') {
            fx_options.duration = (RightJS.Fx.Durations[fx_options.duration] ||
              fx_options.duration) / 2;
          }
        }
      }
    } else {
      // manually trigger the event if no fx were specified
      element.___fx = false;
      if (!fx_name) { element.fire(event); }
    }

    return element.$super(fx_name, fx_options);
  } else {
    return element;
  }
}

/**
 * Relatively positions the current element
 * against the specified one
 *
 * NOTE: this function is called in a context
 *       of another element
 *
 * @param Element the target element
 * @param String position 'right' or 'bottom'
 * @param Boolean if `true` then the element size will be adjusted
 * @return void
 */
function Toggler_re_position(element, where, resize) {
  var anchor = this.reAnchor || (this.reAnchor =
        new RightJS.Element('div', {'class': 'rui-re-anchor'}))
        .insert(this),

      pos  = anchor.insertTo(element, 'after').position(),
      dims = element.dimensions(), target = this,

      border_top    = parseInt(element.getStyle('borderTopWidth')),
      border_left   = parseInt(element.getStyle('borderLeftWidth')),
      border_right  = parseInt(element.getStyle('borderRightWidth')),
      border_bottom = parseInt(element.getStyle('borderBottomWidth')),

      top    = dims.top    - pos.y       + border_top,
      left   = dims.left   - pos.x       + border_left,
      width  = dims.width  - border_left - border_right,
      height = dims.height - border_top  - border_bottom;

  // making the element to appear so we could read it's sizes
  target.setStyle('visibility:hidden').show(null);

  if (where === 'right') {
    left += width - target.size().x;
  } else {  // bottom
    top  += height;
  }

  target.moveTo(left, top);

  if (resize) {
    if (where === 'left' || where === 'right') {
      target.setHeight(height);
    } else {
      target.setWidth(width);
    }
  }

  // rolling the invisibility back
  target.setStyle('visibility:visible').hide(null);
}