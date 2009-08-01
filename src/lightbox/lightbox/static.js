/**
 * The class level interface
 *
 * @copyright (C) 2009 Nikolay V. Nemshilov aka St.
 */
Lightbox.extend({
  hide: function() {
    this.boxes.each('hide');
  },
  
  show: function() {
    return this.inst('show', arguments);
  },
  
  load: function() {
    return this.inst('load', arguments);
  },

// private

  inst: function(name, args) {
    var inst = new Lightbox();
    return inst[name].apply(inst, args);
  }
});