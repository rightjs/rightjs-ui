/**
 * This module contains various caluculations logic for
 * the Colorpicker widget
 *
 * Copyright (C) 2010 Nikolay Nemshilov
 */
Colorpicker.include({
  /**
   * Converts the color to a RGB string value
   *
   * @param Array optional color
   * @return String RGB value
   */
  toRgb: function(color) {
    return 'rgb('+ this.color.join(',') +')';
  },

  /**
   * Converts the color to a HEX string value
   *
   * @param Array optional color
   * @return String HEX value
   */
  toHex: function(color) {
    return '#'+ this.color.map(function(c) { return (c < 16 ? '0' : '') + c.toString(16); }).join('');
  },

  /**
   * Converts a string value into an Array of color
   *
   * @param String value
   * @return Array of color or null
   */
  toColor: function(in_value) {
    var value = in_value.toLowerCase(), match;

    if ((match = /rgb\((\d+)\s*,\s*(\d+)\s*,\s*(\d+)\)/.exec(value))) {
      return [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])];

    } else if (/#[\da-f]+/.test(value)) {
      // converting the shortified hex in to the full-length version
      if ((match = /^#([\da-f])([\da-f])([\da-f])$/.exec(value))) {
        value = '#'+match[1]+match[1]+match[2]+match[2]+match[3]+match[3];
      }

      if ((match = /#([\da-f]{2})([\da-f]{2})([\da-f]{2})/.exec(value))) {
        return [match[1], match[2], match[3]].map(function(n) { return parseInt(n, 16); });
      }
    }
  },

  /**
   * converts color into the tint, saturation and brightness values
   *
   * @return Colorpicker this
   */
  color2tint: function() {
    var color = $A(this.color).sort(function(a,b) { return a-b; }),
        min = color[0], max = color[2];

    this.bright = max / 255;
    this.satur  = 1 - min / (max || 1);

    this.tint.each(function(value, i) {
      this.tint[i] = ((!min && !max) || min == max) ? i == 0 ? 1 : 0 :
        (this.color[i] - min) / (max - min);
      return this.tint[i];
    }, this);

    return this;
  },

  /**
   * Converts tint, saturation and brightness into the actual RGB color
   *
   * @return Colorpicker this
   */
  tint2color: function() {
    var tint = this.tint, color = this.color;

    for (var i=0; i < 3; i++) {
      color[i] = 1 + this.satur * (tint[i] - 1);
      color[i] = Math.round(255 * color[i] * this.bright);
    }

    return this;
  },

  /**
   * bounds the value to the given limits
   *
   * @param {Number} value
   * @param {Number} min value
   * @param {Number} max value
   * @return {Number} the value in bounds
   */
  bound: function(in_value, min, max) {
    var value = in_value;

    if (min < max) {
      value = value < min ? min : value > max ? max : value;
    } else {
      if (value > max) { value = max; }
      if (value < min) { value = min; }
    }

    return value;
  }
});
