/**
 * The font-size tool
 *
 * Copyright (C) 2010 Nikolay Nemshilov
 */
Rte.Tool.Fontsize = new Class(Rte.Tool.Options, {
  command: 'fontsize',

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