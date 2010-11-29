/**
 * Formatting style tool
 *
 * Copyright (C) 2010 Nikolay Nemshilov
 */
Rte.Tool.Style = new Class(Rte.Tool.Options, {

  initialize: function(rte) {
    var options = {}, rule, styles = Rte.Formats;

    for (rule in styles) {
      options[rule] = '<'+ rule + '>'+ styles[rule] + '</'+ rule + '>';
    }

    return this.$super(rte, options);
  }

});