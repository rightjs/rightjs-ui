/**
 * An abstract formatting tool that works with styles
 * basically it wraps a selection with a 'span' tag and then
 * handles the 'style' attribute, adds/removes various styles, etc.
 *
 * Copyright (C) 2010 Nikolay Nemshilov
 */
Rte.Tool.Style = new Class(Rte.Tool.Format, {
  include: Rte.Tool.Options,

  tag:   'span',  // tag name of the element to be used
  style:  null,   // the style property name (dashed)

  /**
   * Joint constructor
   *
   * @param Rte rte
   * @return Rte.Tool.StyleOptions
   */
  initialize: function(rte, options) {
    // a regular expression to process the `style` property
    this.re    = new RegExp("(^|;)\\s*"+ RegExp.escape(this.style + ":")+ "\\s*(.+?)\\s*(;|$)");
    this.attrs = { style: this.re };

    this.$super(rte).build(options);

    return this;
  },

  /**
   * Triggers the action
   *
   * @return void
   */
  exec: function() {
    // unformatting if there is a value
    if (this.active()) {
      this.attrs = {style: this.style + ":" + this._value};
      this.unformat();
    }

    // formatting if some value was asked
    if (this.value) {
      this.attrs = {style: this.style + ":" + this.value};
      this.format();
    }

    // getting back the RE checker
    this.attrs = {style: this.re};
  },

  /**
   * Overloading the original method so that we could do some additional
   * features with the actual current value
   *
   * @return void
   */
  active: function() {
    var element = this.element(), active = false, value = null;

    if (element !== null) {
      this._value = value  = this.getStyleValue();
      active = true;
    }

    this.updateDisplay(value);

    return active;
  },

// protected

  /**
   * Finds the current style value (if any)
   *
   * @return string style value or null if nothing
   */
  getStyleValue: function() {
    var element = this.element();
    var attribute = element !== null ? element.getAttribute('style') : null;

    if (attribute !== null) {
      if ((attribute = attribute.match(this.re)) !== null) {
        attribute = attribute[2];
      }
    }

    return attribute;
  }
});