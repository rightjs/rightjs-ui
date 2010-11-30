/**
 * The font-size tool
 *
 * Copyright (C) 2010 Nikolay Nemshilov
 */
Rte.Tools.Fontsize = new Class(Rte.Tool.Style, {
  style: 'font-size',

  /**
   * Basic constructor
   *
   * @param Rte rte
   */
  initialize: function(rte) {
    var options = {}, i=0, sizes = Rte.FontSizes.split(/\s+/);

    for (; i < sizes.length; i++) {
      options[sizes[i]] = '<div style="font-size:'+
        sizes[i] +'">'+ sizes[i] + '</div>';
    }

    return this.$super(rte, options);
  }
});