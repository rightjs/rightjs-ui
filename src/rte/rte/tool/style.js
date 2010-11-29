/**
 * An abstract formatting tool that works with styles
 * basically it wraps a selection with a 'span' tag and then
 * handles the 'style' attribute, adds/removes various styles, etc.
 *
 * Copyright (C) 2010 Nikolay Nemshilov
 */
Rte.Tool.Style = new Class(Rte.Tool.Format, {
  tag:   'span',
  style:  null, // the style property name (dashed)

// protected

  unformat: function() {
    this.format(); // calling format all over again because there might be nested styles
  },

  format: function() {
    if (this.value) {
      this.attributes = {style: this.style + ":" + this.value};
      this.$super();
      this.attributes = {}; // resetting the attributes so that it was filled up again in the #element method
    } else if (this.element()) {
      // removing the formatting element if there is no style value
      this.rte.editor.removeElement(this.element());
    }
  },

  /**
   * Overloading the element search to handle style matching
   *
   * @return raw dom element or null if nothing found
   */
  element: function() {
    if (!('style' in this.attributes)) {
      this.attributes = {style: new RegExp("(^|;| )"+ RegExp.escape(this.style + ":"))};
    }

    return this.$super();
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
      this.valueRE = this.valueRE || new RegExp("(^|;| )"+ RegExp.escape(this.style + ":")+ "\\s(.+?)\\s*(;|$)");
      if ((attribute = attribute.match(this.valueRE)) !== null) {
        attribute = attribute[2];
      }
    }

    return attribute;
  }
});