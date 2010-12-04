/**
 * an abstract color-picking tool
 *
 * Copyright (C) 2010 Nikolay Nemshilov
 */
Rte.Tool.Color = new Class(Rte.Tool.Style, {

  extend: {
    COLORS: R([
      // TODO that's ain't no cool hacker's approach!
      '000000 444444 666666 999999 cccccc eeeeee f4f4f4 ffffff',
      'f24020 f79c33 fff84c 6af244 5ef9fd 0048f7 8950f7 ee5ff8',
      'e39e9b f5cba1 fee3a1 bcd3ab a6c3c8 a2c6e5 b1abd3 d0aabc '+
      'd77169 f1b374 fdd675 9cbe83 7ca4ae 74aad8 8983bf bb839f '+
      'cc0100 e79138 f1c332 69a84f 45818e 3d85c6 674ea7 a64d79 '+
      '990000 b45f05 bf9000 38761c 134f5c 0b5394 351b75 751a47 '+
      '660000 783e03 7f6000 264e13 0b333d 063763 1f124c 4c1030'
    ])
  },

  /**
   * Basic constructor, builds the colors picking panel
   *
   * @param Rte rte
   * @return Rte.Tool.Color this
   */
  initialize: function(rte) {
    this.$super(rte, {}).addClass('color');
    this.display.clean();

    // building the color picker menu
    Rte.Tool.Color.COLORS.each(function(line) {
      var group  = $E('li', {'class': 'group'}),
          list   = $E('ul').insertTo(group),
          colors = line.split(' '), i = 0, color, forecolor;

      for (; i < colors.length; i++) {
        color     = '#' + colors[i];
        forecolor = ('ffffff'.toInt(16) - colors[i].toInt(16)).toString(16);

        // IE will get screwed if the length of the color is less than 6
        while (forecolor.length < 6) {
          forecolor += '0';
        }

        this.items[color] = $E('li', {
          html:  '&bull;',
          style: {
            background: color,
            color: '#'+ forecolor
          }
        });

        this.items[color].insertTo(list).value = color;
      }

      this.options.append(group);
    }, this);

    return this;
  },

// protected

  /**
   * Overloading the property so that it converted any color formats
   * into a six chars hex value
   *
   * @return String current color or null
   */
  getStyleValue: function() {
    var color = this.$super(), match;

    if (color !== null) {
      if ((match = /^#(\w)(\w)(\w)$/.exec(color))) {
        color = "#"+ match[1]+match[1]+match[2]+match[2]+match[3]+match[3];
      } else if ((match = /^\s*rgb\((\d+),\s*(\d+),\s*(\d+)\)\s*$/.exec(color))) {
        color = "#"+ R(match.slice(1)).map(function(bit) {
          bit = (bit-0).toString(16);
          return bit.length === 1 ? '0'+bit : bit;
        }).join('');
      }
    }

    return color;
  },

  /**
   * Replacing the original method so that
   * it changed the color of the display thing
   * instead of text
   *
   * @param String value
   * @return void
   */
  updateDisplay: function(value) {
    this.display._.style.background = value === null ?
      'transparent' : value;
  }
});