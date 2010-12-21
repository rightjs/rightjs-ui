/**
 * Formatting style tool
 *
 * Copyright (C) 2010 Nikolay Nemshilov
 */
Rte.Tools.Format = new Class(Rte.Tool.Format, {
  include: Rte.Tool.Options,

  /**
   * Constructor, builds the options list and
   * defines the formats index for quick access
   *
   * @param Rte rte
   */
  initialize: function(rte) {
    var options = {}, rule, tag, match;

    this.formats = {};

    for (rule in Rte.Formats) {
      if ((match = rule.match(/^([a-z0-9]+)(\.([a-z0-9_\-]+))?$/))) {
        tag = match[1];

        this.formats[rule] = { tag: tag.toUpperCase(), attrs: {}, match: {} };

        if (match[3]) {
          this.formats[rule]['attrs']['class'] = match[3];
          this.formats[rule]['match']['class'] = new RegExp(
            '(^|\\s+)'+ RegExp.escape(match[3]) + '(\\s+|$)'
          );
        }

        options[rule] = '<'+ tag + ' class="'+ match[3] + '">'+
          Rte.Formats[rule] + '</'+ tag + '>';
      }
    }

    this.$super(rte).build(options);

    return this;
  },

  /**
   * Handling the formatting
   *
   * @return void
   */
  exec: function() {
    if (this.formats[this.value]) {
      this.tag   = this.formats[this.value].tag;
      this.attrs = this.formats[this.value].attrs;

      this.format();
    } else {
      this.unformat();
    }
  },

  /**
   * Overloading the original method so that it updated the
   * currently used formatting style in the display area
   *
   * @return boolean check result
   */
  active: function() {
    var active = this.element() !== null;
    this.updateDisplay(this.rule);
    return active;
  },

// protected

  // overloading the original method to handle multiple options
  element: function() {
    var rule, element, status = this.rte.status;

    for (rule in this.formats) {
      element = status.findElement(
        this.formats[rule]['tag'],
        this.formats[rule]['match']
      );

      if (element !== null) {
        this.rule = rule;
        return element;
      }
    }

    return (this.rule = null);
  }



});