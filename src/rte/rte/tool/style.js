/**
 * An abstract formatting tool that works with styles
 * basically it wraps a selection with a 'span' tag and then
 * handles the 'style' attribute, adds/removes various styles, etc.
 *
 * Copyright (C) 2010 Nikolay Nemshilov
 */
Rte.Tool.Style = new Class(Rte.Tool.Format, {
  include: Object.only(Rte.Tool.Options.prototype,
    'pick', 'mousedown', 'markActive', 'updateDisplay'
  ),

  tag:   'span',  // tag name of the element to be used
  style:  null,   // the style property name (dashed)

  /**
   * Joint constructor
   *
   * @param Rte rte
   * @param Object options
   * @return Rte.Tool.StyleOptions
   */
  initialize: function(rte, options) {
    this.defaultStyle = rte.editor.getStyle(this.style);

    // a regular expression to process the `style` property
    this.re = new RegExp("(^|;)\\s*"+ RegExp.escape(this.style + ":")+ "\\s*(.+?)\\s*(;|$)");
    this.attributes = { style: this.re };

    return Rte.Tool.Options.prototype.initialize.call(this, rte, options);
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
      value  = this.getStyleValue();
      active = true;
    }

    this.updateDisplay(value);

    return active;
  },

// protected

  // calling format all over again because there might be nested styles
  unformat: function() { this.format(); },

  // reformatting the selection using the `style` property
  format: function() {
    if (this.value) {
      this.attributes = {style: this.style + ":" + this.value};
      this.$super();
      this.attributes = {style: this.re};
    } else if (this.element()) {
      // removing the formatting element if there is no style value
      Rte.Tool.Format.prototype.unformat.call(this);
    }
  },

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